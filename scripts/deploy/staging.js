#!/usr/bin/env node

/**
 * Staging Deployment Script
 * Deploys to Firebase staging project
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

const STAGING_PROJECT = 'sutrakala-staging';

function exec(command) {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit', cwd: ROOT_DIR });
}

async function main() {
  console.log('\n🚀 Deploying to staging...\n');

  // Step 1: Run tests
  console.log('📋 Step 1/4: Running tests...');
  try {
    exec('npm test');
  } catch (error) {
    console.error('❌ Tests failed. Aborting deployment.');
    process.exit(1);
  }

  // Step 2: Build
  console.log('\n📦 Step 2/4: Building production assets...');
  exec('NODE_ENV=staging npm run build');

  // Step 3: Deploy to Firebase
  console.log('\n☁️  Step 3/4: Deploying to Firebase...');
  exec(`firebase deploy --only hosting,firestore --project ${STAGING_PROJECT}`);

  // Step 4: Verify deployment
  console.log('\n✅ Step 4/4: Verifying deployment...');
  const stagingUrl = `https://${STAGING_PROJECT}.web.app`;
  console.log(`\n🎉 Deployment successful!`);
  console.log(`\nStaging URL: ${stagingUrl}\n`);
}

main().catch((error) => {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
});
