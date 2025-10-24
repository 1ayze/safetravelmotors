# Supabase Connection Setup Guide

This document outlines the steps and prompts used to connect the SafeTravels Motors application to Supabase, including all necessary details and configurations.

## Prerequisites
- A Supabase account and project created at https://supabase.com
- Node.js and npm installed
- Prisma CLI installed (`npm install -g prisma`)

## Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Note down the project URL and keys from the project settings

## Step 2: Gather Connection Details
The following environment variables are required for Supabase connection:

**Prompts used to collect details:**
- SUPABASE_URL: The URL of your Supabase project (e.g., https://your-project.supabase.co)
- SUPABASE_ANON_KEY: The anonymous/public key for client-side operations
- SUPABASE_SERVICE_ROLE_KEY: The service role key for server-side operations (keep this secret)

**Example values provided:**
```
SUPABASE_URL=https://lssduryhinbmcpnbrhqk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzc2R1cnloaW5ibWNwbmJyaHFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTMwNjgxOCwiZXhwIjoyMDc2ODgyODE4fQ.C-ck4jtKkI--frDzOlT1pACRrPjmMJoiT_mUwWZpjw4
DATABASE_URL=postgresql://postgres:olgamaxime123@db.lssduryhinbmcpnbrhqk.supabase.co:5432/postgres
```

## Step 3: Update Environment Variables
Update the `.env` file in the project root with the following variables:

```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

Note: The `.env` file is already configured with the provided values.

## Step 4: Execute Database Schema
1. Go to your Supabase dashboard SQL Editor
2. Execute the entire contents of `schema_supabase.sql`
3. This creates the `users` and `cars` tables with indexes and triggers

**Schema includes:**
- Users table for admin authentication
- Cars table for inventory management
- Default admin user (username: admin, password: admin123)
- Indexes for performance
- Triggers for automatic updatedAt timestamps

## Step 5: Configure Prisma
The Prisma schema (`backend/prisma/schema.prisma`) is already configured for PostgreSQL and matches the Supabase schema.

**Key configurations:**
- Provider: postgresql
- Database URL: env("DATABASE_URL")
- Models: User and Car

## Step 6: Run Prisma Migrations
Execute the following commands in the backend directory:

```bash
cd backend
npx prisma generate --schema=prisma/schema.prisma
npx prisma migrate deploy --schema=prisma/schema.prisma
```

Note: If encountering permission errors during generation, try running as administrator or in a different terminal.

## Step 7: Test Database Connection
Start the backend server and verify the connection:

```bash
cd backend
npm run dev
```

Check that the application can connect to Supabase and perform CRUD operations on users and cars.

## Additional Files and Configurations
- `backend/src/config/supabase.ts`: Supabase client configuration
- `schema_supabase.sql`: Database schema for Supabase
- `backend/prisma/schema.prisma`: Prisma schema definition
- `backend/.env`: Environment variables (contains Supabase keys)

## Troubleshooting
- Ensure all environment variables are set correctly
- Verify Supabase project is active and keys are valid
- Check network connectivity to Supabase
- Confirm schema was executed successfully in Supabase SQL Editor

## Security Notes
- Never commit `.env` files to version control
- Keep SUPABASE_SERVICE_ROLE_KEY secure (server-side only)
- Use SUPABASE_ANON_KEY for client-side operations
- Regularly rotate keys if compromised

## Next Steps
- Implement authentication using the users table
- Set up car inventory management
- Configure file uploads for car images
- Test all CRUD operations
