import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pagesDir = path.resolve(__dirname, '../../website/src/content/pages');
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));
const errors = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
  const { seo = {}, blocks = [] } = data;

  if (!seo.title) {
    errors.push(`${file}: missing seo.title`);
  }
  if (!seo.description) {
    errors.push(`${file}: missing seo.description`);
  }

  blocks.forEach((block, idx) => {
    if (block.type === 'Hero' && block.props?.media && !block.props.media.alt) {
      errors.push(`${file}: Hero block #${idx + 1} missing alt text`);
    }
  });
}

if (errors.length) {
  console.error('SEO issues found:');
  for (const err of errors) {
    console.error(' -', err);
  }
  process.exit(1);
} else {
  console.log('SEO linter: no critical issues found.');
}
