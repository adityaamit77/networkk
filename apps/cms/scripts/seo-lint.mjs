import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pagesDir = path.resolve(__dirname, '../../website/src/content/pages');
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));
const errors = [];
const titles = new Map();
const globalH1s = new Map();

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
  const { seo = {}, blocks = [] } = data;

  if (!seo.title) {
    errors.push(`${file}: missing seo.title`);
  } else {
    if (seo.title.length > 60) {
      errors.push(`${file}: seo.title longer than 60 characters`);
    }
    if (titles.has(seo.title)) {
      errors.push(`${file}: duplicate seo.title also in ${titles.get(seo.title)}`);
    } else {
      titles.set(seo.title, file);
    }
  }

  if (!seo.description) {
    errors.push(`${file}: missing seo.description`);
  } else {
    const len = seo.description.length;
    if (len < 120 || len > 160) {
      errors.push(`${file}: seo.description length ${len} outside 120-160 characters`);
    }
  }

  if (!seo.canonical) {
    errors.push(`${file}: missing seo.canonical`);
  }

  if (seo.jsonldRequired && !seo.jsonld) {
    errors.push(`${file}: missing required JSON-LD`);
  }

  const pageH1s = [];

  blocks.forEach((block, idx) => {
    const props = block.props || {};
    if (props.media && !props.media.alt) {
      errors.push(`${file}: ${block.type} block #${idx + 1} missing alt text`);
    }
    if (block.type === 'Hero' && props.title) {
      pageH1s.push(props.title);
      if (globalH1s.has(props.title)) {
        errors.push(`${file}: duplicate H1 "${props.title}" also in ${globalH1s.get(props.title)}`);
      } else {
        globalH1s.set(props.title, file);
      }
    }
    if (block.type === 'Heading' && props.level === 1 && props.text) {
      pageH1s.push(props.text);
      if (globalH1s.has(props.text)) {
        errors.push(`${file}: duplicate H1 "${props.text}" also in ${globalH1s.get(props.text)}`);
      } else {
        globalH1s.set(props.text, file);
      }
    }
  });

  if (pageH1s.length > 1) {
    errors.push(`${file}: multiple H1s`);
  }
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
