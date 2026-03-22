#!/usr/bin/env node

/**
 * Production Deployment Script
 * Deploys to Firebase production project with safety checks
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

const PRODUCTION_PROJECT = 'sutrakala-aa44b';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function exec(command) {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit', cwd: ROOT_DIR });
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase());
    });
  });
}

async function main() {
  console.log('\n🚀 PRODUCTION DEPLOYMENT\n');
  console.log('⚠️  WARNING: This will deploy to production!\n');

  // Safety check
  const confirm = await askQuestion('Are you sure you want to deploy to production? (yes/no): ');

  if (confirm !== 'yes') {
    console.log('\n❌ Deployment cancelled.\n');
    process.exit(0);
  }

  // Step 1: Run tests
  console.log('\n📋 Step 1/5: Running tests...');
  try {
    exec('npm test');
  } catch (error) {
    console.error('❌ Tests failed. Aborting deployment.');
    process.exit(1);
  }

  // Step 2: Security check
  console.log('\n🔒 Step 2/5: Running security checks...');
  try {
    exec('npm audit --audit-level=high');
  } catch (error) {
    const skip = await askQuestion('⚠️  Security vulnerabilities found. Continue? (yes/no): ');
    if (skip !== 'yes') {
      console.log('\n❌ Deployment cancelled.\n');
      process.exit(0);
    }
  }

  // Step 3: Build
  console.log('\n📦 Step 3/5: Building production assets...');
  exec('NODE_ENV=production npm run build');

  // Step 4: Deploy to Firebase
  console.log('\n☁️  Step 4/5: Deploying to Firebase...');
  exec(`firebase deploy --only hosting,firestore,functions --project ${PRODUCTION_PROJECT}`);

  // Step 5: Verify deployment
  console.log('\n✅ Step 5/5: Verifying deployment...');
  const productionUrl = 'https://sutrakala.web.app';
  console.log(`\n🎉 Production deployment successful!`);
  console.log(`\nProduction URL: ${productionUrl}\n`);

  rl.close();
}

main().catch((error) => {
  console.error('\n❌ Deployment failed:', error.message);
  rl.close();
  process.exit(1);
});
