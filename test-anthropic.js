// Quick test script to verify Anthropic API key
// Run: node test-anthropic.js

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');

const apiKey = process.env.ANTHROPIC_API_KEY;

console.log('\n🔍 Anthropic API Key Test\n');
console.log('='.repeat(50));

if (!apiKey) {
  console.error('❌ ANTHROPIC_API_KEY not found in .env.local');
  process.exit(1);
}

console.log(`✓ API Key found: ${apiKey.substring(0, 15)}...`);
console.log(`✓ Key length: ${apiKey.length} characters`);
console.log(`✓ Key starts with: ${apiKey.substring(0, 12)}`);

if (!apiKey.startsWith('sk-ant-')) {
  console.warn('⚠️  Warning: Key should start with "sk-ant-"');
}

console.log('\n📡 Testing API connection...\n');

const anthropic = new Anthropic({ apiKey });

async function testAPI() {
  const models = [
    'claude-sonnet-4-20250514',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-5-haiku-20241022',
  ];
  
  for (const model of models) {
    try {
      console.log(`Testing model: ${model}...`);
      const response = await anthropic.messages.create({
        model,
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Hello' }],
      });
      
      console.log(`✅ SUCCESS! Model ${model} is working!`);
      console.log(`   Response: ${response.content[0].text.substring(0, 50)}...`);
      console.log('\n✓ Your SnapDx app should work now!\n');
      return; // Exit on first success
    } catch (error) {
      console.log(`✗ Model ${model} failed: ${error.status} ${error.message}`);
    }
  }
  
  console.error('\n❌ ALL MODELS FAILED!');
  console.error('\nDetailed error:', JSON.stringify(error, null, 2));
  
  console.log('\n💡 Solution:');
  console.log('   1. Go to: https://console.anthropic.com/settings/keys');
  console.log('   2. Create a new API key');
  console.log('   3. Make sure billing is set up (add credits)');
  console.log('   4. Update ANTHROPIC_API_KEY in .env.local');
  console.log('   5. Restart your Next.js dev server');
}

testAPI();
