#!/usr/bin/env node

/**
 * Production startup script for Render deployment
 * Handles Prisma client generation and database setup gracefully
 */

const { execSync } = require('child_process');

console.log('🚀 Starting EasyAssign Server...\n');

// Step 1: Generate Prisma Client (always required)
console.log('📦 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client');
  console.error(error.message);
  process.exit(1);
}

// Step 2: Push database schema (only if DATABASE_URL is available)
if (process.env.DATABASE_URL) {
  console.log('🗄️  Pushing database schema...');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    console.log('✅ Database schema pushed successfully\n');
  } catch (error) {
    console.warn('⚠️  Database push failed (this is okay if schema is already up to date)');
    console.warn('   Error:', error.message);
    console.log('   Continuing with server startup...\n');
  }
} else {
  console.warn('⚠️  DATABASE_URL not set, skipping database push\n');
}

// Step 3: Start the server
console.log('🌐 Starting Node.js server...\n');
require('./server.js');

