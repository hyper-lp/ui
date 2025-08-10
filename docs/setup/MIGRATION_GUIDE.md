# Database Migration Guide

## Overview

This guide explains how to manage database migrations and keep development and production databases in sync.

## Environment Setup

### 1. Configure Environment Files

Create two environment files from the templates:

```bash
# For development
cp .env.development .env.local
# Edit .env.local with your dev database URL

# For production  
cp .env.production .env.prod
# Edit .env.prod with your production database URL (keep secure!)
```

### 2. Database URLs

Your database URLs should look like:
```
postgresql://user:password@host:5432/database?sslmode=require
```

For Neon databases:
- Dev: Use a dev branch or separate project
- Prod: Use the main branch with pooled connection

## Common Workflows

### Starting Fresh (Reset Everything)

When you need to completely reset and start with a clean schema:

```bash
# 1. Reset your dev database
tsx scripts/db-reset.ts

# 2. Create a baseline migration
tsx scripts/db-create-baseline.ts

# 3. Apply to dev
npx prisma migrate deploy

# 4. Apply to prod (carefully!)
tsx scripts/db-migrate-prod.ts
```

### Regular Development Flow

```bash
# 1. Make schema changes in prisma/schema.prisma

# 2. Create migration for dev
npx prisma migrate dev --name descriptive_name

# 3. Test thoroughly in dev

# 4. Check sync status
tsx scripts/db-sync-check.ts

# 5. Apply to production
tsx scripts/db-migrate-prod.ts
```

### Checking Database Sync

Run this regularly to ensure databases are in sync:

```bash
tsx scripts/db-sync-check.ts
```

This will show you which migrations are applied in each environment.

## Migration Best Practices

### ✅ DO:

1. **Always test migrations in dev first**
   - Run the full application
   - Test all affected features
   - Check for data integrity

2. **Use descriptive migration names**
   ```bash
   npx prisma migrate dev --name add_user_roles
   npx prisma migrate dev --name refactor_perp_positions
   ```

3. **Create backups before production migrations**
   - The production migration script does this automatically
   - Keep backups for at least 7 days

4. **Review migrations before applying**
   - Check the SQL in `prisma/migrations/*/migration.sql`
   - Look for destructive operations (DROP, DELETE, etc.)

5. **Keep migrations small and focused**
   - One logical change per migration
   - Easier to debug and rollback if needed

### ❌ DON'T:

1. **Never delete migration files**
   - Even if they haven't been applied to production
   - This breaks the migration history

2. **Never edit existing migrations**
   - Create a new migration to fix issues
   - Editing breaks checksums and causes conflicts

3. **Never use `prisma db push` in production**
   - It bypasses migrations and can cause schema drift
   - Always use `prisma migrate deploy`

4. **Never skip the sync check**
   - Always verify databases are in sync before deploying
   - Prevents migration conflicts

## Troubleshooting

### "Migration already applied" error

This happens when migration histories diverge. To fix:

1. Check which migrations are applied:
   ```bash
   npx prisma migrate status
   ```

2. If safe, reset and reapply:
   ```bash
   tsx scripts/db-reset.ts
   npx prisma migrate deploy
   ```

### "Database schema drift" warning

The actual database doesn't match migrations. To fix:

1. Create a migration to capture the drift:
   ```bash
   npx prisma migrate dev --name fix_schema_drift
   ```

2. Review and apply the migration

### Production migration fails

1. **Don't panic!** The backup was created first
2. Check the error message
3. Fix the issue in dev
4. Test the fix
5. Try the migration again

### Databases out of sync

Run the sync check to see what's different:
```bash
tsx scripts/db-sync-check.ts
```

Then apply missing migrations to the appropriate environment:
```bash
# For dev
npx prisma migrate deploy

# For prod
tsx scripts/db-migrate-prod.ts
```

## Scripts Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `db-reset.ts` | Completely reset database | Starting fresh, major schema changes |
| `db-create-baseline.ts` | Create baseline migration | Initial setup, consolidating migrations |
| `db-sync-check.ts` | Compare dev/prod schemas | Before deployments, regular checks |
| `db-migrate-prod.ts` | Safe production migration | Applying migrations to production |

## Package.json Scripts

Add these helpful scripts to your package.json:

```json
{
  "scripts": {
    "db:reset": "tsx scripts/db-reset.ts",
    "db:baseline": "tsx scripts/db-create-baseline.ts",
    "db:sync": "tsx scripts/db-sync-check.ts",
    "db:migrate:prod": "tsx scripts/db-migrate-prod.ts",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:status": "prisma migrate status"
  }
}
```

## Emergency Procedures

### Rolling Back a Migration

If a migration causes issues in production:

1. **Restore from backup** (created by migration script)
2. **Fix the migration** in development
3. **Create a new migration** to fix the issue
4. **Test thoroughly**
5. **Apply the fix** to production

### Complete Reset (Nuclear Option)

Only use this if absolutely necessary:

1. Export any critical data
2. Drop all tables
3. Create baseline migration
4. Apply to all environments
5. Re-import critical data

## Deployment Checklist

Before deploying to production:

- [ ] Schema changes tested in dev
- [ ] Migrations created with descriptive names
- [ ] `pnpm build` passes without errors
- [ ] `tsx scripts/db-sync-check.ts` shows databases in sync
- [ ] Backup strategy confirmed
- [ ] Rollback plan prepared
- [ ] Team notified of deployment

## Tips for Preventing Sync Issues

1. **Single source of truth**: Always create migrations in dev first
2. **Linear history**: Apply migrations in order
3. **Regular sync checks**: Run sync check before deployments
4. **Document changes**: Add comments to complex migrations
5. **Test in staging**: If possible, test in a staging environment first
6. **Automate checks**: Add sync check to CI/CD pipeline

## Questions?

If you encounter issues not covered here:

1. Check Prisma documentation: https://www.prisma.io/docs
2. Review migration files in `prisma/migrations/`
3. Check database logs
4. Create a test database to experiment safely