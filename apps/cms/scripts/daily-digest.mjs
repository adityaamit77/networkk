import fs from 'node:fs';
import path from 'node:path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pagesDir = path.resolve(__dirname, '../../website/src/content/pages');
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));

const pagesMissingH2 = [];
const imagesMissingAlt = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
  const { blocks = [] } = data;
  let hasH2 = false;
  blocks.forEach((block) => {
    const props = block.props || {};
    if (block.type === 'Heading' && props.level === 2 && props.text) {
      hasH2 = true;
    }
    if (props.media && !props.media.alt) {
      imagesMissingAlt.push(`${file}: ${block.type} missing alt text`);
    }
  });
  if (!hasH2) {
    pagesMissingH2.push(file);
  }
}

const summary = {
  pagesMissingH2,
  imagesMissingAlt
};

console.log('Daily SEO digest', JSON.stringify(summary, null, 2));

// Optionally post digest to notification endpoint if env configured
if (process.env.CMS_URL) {
  try {
    fetch(`${process.env.CMS_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 0,
        data: summary
      })
    });
  } catch {
    // ignore network errors in digest script
  }
}
