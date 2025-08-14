import { NextResponse } from 'next/server'
import { prismaReferrals } from '@/lib/prisma-referrals'

export async function GET() {
    try {
        const users = await prismaReferrals.user.findMany()
        return NextResponse.json(users)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const user = await prismaReferrals.user.create({
            data: {
                email: body.email,
                name: body.name,
            },
        })
        return NextResponse.json(user, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
}
