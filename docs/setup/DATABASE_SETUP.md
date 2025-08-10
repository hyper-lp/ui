# Database Setup Complete! 🎉

## What We've Created

### 1. Database Management Scripts
- `scripts/db-reset.ts` - Reset database with confirmation
- `scripts/db-create-baseline.ts` - Create a clean migration baseline
- `scripts/db-sync-check.ts` - Compare dev and prod schemas
- `scripts/db-migrate-prod.ts` - Safely migrate production with backups

### 2. Environment Configuration
- `.env.development` - Template for development settings
- `.env.production` - Template for production settings
- Both files are gitignored for security

### 3. Documentation
- [Migration Guide](../setup/MIGRATION_GUIDE.md) - Complete guide for managing migrations
- [Terminology](../architecture/TERMINOLOGY.md) - Proper vocabulary for the project

### 4. New NPM Scripts
```bash
pnpm db:reset        # Reset database
pnpm db:baseline     # Create baseline migration
pnpm db:sync         # Check dev/prod sync
pnpm db:migrate:prod # Safe production migration
pnpm db:status       # Check migration status
```

## Next Steps to Fix Your Databases

### Step 1: Configure Your Environments

1. Copy your current DATABASE_URL to `.env.development`:
   ```bash
   # Edit .env.development and add your dev Neon database URL
   ```

2. Set up production environment:
   ```bash
   # Edit .env.production and add your prod Neon database URL
   ```

### Step 2: Reset and Sync Both Databases

Since you mentioned there isn't much data, let's start fresh:

1. **Reset development database:**
   ```bash
   pnpm db:reset
   ```

2. **Create a clean baseline:**
   ```bash
   pnpm db:baseline
   ```

3. **Apply to development:**
   ```bash
   pnpm prisma:deploy
   ```

4. **Apply to production:**
   ```bash
   pnpm db:migrate:prod
   ```

### Step 3: Verify Everything is Synced

```bash
pnpm db:sync
```

This should show both databases are in sync with all migrations applied.

## How to Prevent Future Sync Issues

### Development Workflow

1. **Always make schema changes in dev first:**
   ```bash
   # Edit prisma/schema.prisma
   pnpm prisma:migrate  # Create migration in dev
   ```

2. **Test thoroughly in development**

3. **Before deploying, check sync:**
   ```bash
   pnpm db:sync
   ```

4. **Apply to production:**
   ```bash
   pnpm db:migrate:prod
   ```

### Key Rules

✅ **DO:**
- Create migrations in dev first
- Test before applying to prod
- Run sync checks regularly
- Keep backups

❌ **DON'T:**
- Delete migration files
- Edit existing migrations
- Use `db push` in production
- Skip the sync check

## Quick Reference

| Command | What it does | When to use |
|---------|--------------|-------------|
| `pnpm db:sync` | Check if databases match | Before every deployment |
| `pnpm db:migrate:prod` | Apply migrations to prod | After testing in dev |
| `pnpm db:reset` | Start fresh | Major schema changes |
| `pnpm db:status` | See migration status | Debugging issues |

## Troubleshooting

If databases get out of sync again:

1. Run `pnpm db:sync` to see what's different
2. Apply missing migrations to the behind environment
3. If that fails, reset both and start fresh (nuclear option)

## Important Files

- `prisma/schema.prisma` - Your database schema
- `prisma/migrations/` - Migration history (never delete!)
- `.env.development` - Dev database config
- `.env.production` - Prod database config
- [Migration Guide](../setup/MIGRATION_GUIDE.md) - Detailed documentation

## Ready to Fix the Build?

Once your databases are synced, we can tackle the build errors. The main issue is that the Prisma schema has been updated but the service code hasn't been fully migrated to match.

The build errors are happening because:
1. The new schema uses relations (e.g., `assetId` → `TrackedAsset`)
2. Field names have changed (e.g., `ownerAddress` → `accountId`)
3. Some models have been completely restructured

After syncing the databases, we'll need to update the service layer to match the new schema.