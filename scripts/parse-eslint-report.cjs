const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, '..', 'eslint-report.json');
const outPath = path.resolve(__dirname, '..', 'eslint-priority.json');

function safeParse(content) {
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    process.exitCode = 2;
    return null;
  }
}

if (!fs.existsSync(reportPath)) {
  console.error('eslint-report.json not found at', reportPath);
  process.exitCode = 1;
  process.exit(1);
}

const raw = fs.readFileSync(reportPath, 'utf8');
const data = safeParse(raw);
if (!data) process.exit(2);

// data is an array of file results from ESLint
const prioritized = data
  .map((file) => ({
    filePath: file.filePath,
    errorCount: file.errorCount || 0,
    warningCount: file.warningCount || 0,
    messages: file.messages || [],
  }))
  .sort((a, b) => {
    if (b.errorCount !== a.errorCount) return b.errorCount - a.errorCount;
    if (b.warningCount !== a.warningCount) return b.warningCount - a.warningCount;
    return a.filePath.localeCompare(b.filePath);
  });

const top = prioritized.slice(0, 50);

fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), totalFiles: data.length, top }, null, 2), 'utf8');

console.log('Wrote', outPath);
console.log('Top files:');
top.forEach((f, i) => {
  console.log(`${i + 1}. ${f.filePath} — errors: ${f.errorCount}, warnings: ${f.warningCount}`);
});
