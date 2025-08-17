#!/usr/bin/env tsx

/**
 * Database Reset Script
 * 
 * This script safely resets the database and applies all migrations
 * Use with caution - this will delete all data!
 */

import { execSync } from 'child_process'
import * as readline from 'readline'
import { prismaReferrals } from '@/lib/prisma-referrals'
// import { prismaMonitoring } from '@/lib/prisma-monitoring' // Disabled for now

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, resolve)
    })
}

async function main() {
    console.log('🚨 DATABASE RESET SCRIPT 🚨')
    console.log('This will:')
    console.log('1. Drop all tables in the current database')
    console.log('2. Re-apply all migrations')
    console.log('3. Seed with initial data (if configured)')
    console.log('')
    console.log(`Referrals DB: ${process.env.DATABASE_URL_REFERRALS?.split('@')[1]?.split('/')[0] || 'Unknown'}`)
    console.log(`Monitoring DB: ${process.env.DATABASE_URL_MONITORING?.split('@')[1]?.split('/')[0] || 'Unknown'}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log('')

    const answer = await question('Are you SURE you want to continue? Type "yes" to proceed: ')

    if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Reset cancelled')
        process.exit(0)
    }

    try {
        console.log('\n📦 Step 1: Disconnecting from databases...')
        await prismaReferrals.$disconnect()
        // await prismaMonitoring.$disconnect() // Disabled for now

        console.log('🗑️  Step 2: Resetting databases...')
        console.log('   Resetting Referrals DB...')
        execSync('pnpm prisma:referrals:reset --force --skip-seed', {
            stdio: 'inherit',
        })
        console.log('   Resetting Monitoring DB...')
        execSync('pnpm prisma:monitoring:reset --force --skip-seed', {
            stdio: 'inherit',
        })

        console.log('🔄 Step 3: Applying migrations...')
        console.log('   Deploying Referrals DB migrations...')
        execSync('pnpm prisma:referrals:deploy', {
            stdio: 'inherit',
        })
        console.log('   Deploying Monitoring DB migrations...')
        execSync('pnpm prisma:monitoring:deploy', {
            stdio: 'inherit',
        })

        console.log('✨ Step 4: Generating Prisma Clients...')
        execSync('pnpm prisma:generate', {
            stdio: 'inherit',
        })

        // Optional: Add seed data
        const seedAnswer = await question('\nDo you want to add seed data? (y/n): ')
        if (seedAnswer.toLowerCase() === 'y') {
            console.log('🌱 Step 5: Seeding database...')
            // Add your seed logic here
            console.log('   (No seed data configured yet)')
        }

        console.log('\n✅ Database reset complete!')
        console.log('Your database is now clean and all migrations have been applied.')
    } catch (error) {
        console.error('❌ Error during reset:', error)
        process.exit(1)
    } finally {
        rl.close()
        await prismaReferrals.$disconnect()
        // await prismaMonitoring.$disconnect() // Disabled for now
    }
}

main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
})