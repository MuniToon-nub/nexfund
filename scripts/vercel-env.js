const fs = require('fs');
const { execSync } = require('child_process');

const env = fs.readFileSync('.env.local', 'utf8')
  .split('\n')
  .filter(l => l && !l.startsWith('#'))
  .map(l => l.split('='));

env.forEach(([k, ...v]) => {
  const val = v.join('=');
  if (val) {
    console.log(`Adding ${k} to Vercel...`);
    try {
      execSync(`npx vercel env add ${k} production`, { input: val, stdio: ['pipe', 'inherit', 'inherit'] });
      execSync(`npx vercel env add ${k} preview`, { input: val, stdio: ['pipe', 'inherit', 'inherit'] });
      execSync(`npx vercel env add ${k} development`, { input: val, stdio: ['pipe', 'inherit', 'inherit'] });
    } catch (e) {
      console.log(`Error adding ${k}: ${e.message}`);
    }
  }
});
