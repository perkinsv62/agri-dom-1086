const { spawn } = require('child_process');
const fs = require('fs');

const outFile = 'eslint-report.json';

console.log('Running ESLint...');

const eslint = spawn('npx', ['eslint', 'src', '-f', 'json'], { shell: true });

let stdout = '';
let stderr = '';

eslint.stdout.on('data', (data) => {
  stdout += data.toString();
});

eslint.stderr.on('data', (data) => {
  stderr += data.toString();
});

eslint.on('close', (code) => {
  // Even if exit code !== 0, write stdout to file if present
  if (stdout && stdout.trim().length > 0) {
    try {
      fs.writeFileSync(outFile, stdout, 'utf8');
      console.log(`ESLint output written to ${outFile} (${stdout.length} bytes).`);
    } catch (err) {
      console.error('Failed to write eslint report:', err);
      process.exit(1);
    }

    if (code === 0) {
      console.log('ESLint finished with exit code 0.');
      process.exit(0);
    } else {
      console.log(`ESLint finished with exit code ${code} (lint errors present). Output saved.`);
      // Exit with 0 so CI/script can continue; we still have the JSON file
      process.exit(0);
    }
  } else {
    console.error('No ESLint JSON output captured.');
    if (stderr) console.error('Stderr:', stderr.substring(0, 4000));
    process.exit(1);
  }
});
