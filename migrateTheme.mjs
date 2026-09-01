import fs from 'fs';
import path from 'path';

const dir = './src/components';
const appJsx = './src/App.jsx';

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.jsx'))
  .map(f => path.join(dir, f))
  .concat([appJsx]);

const mappings = [
  // Backgrounds
  { regex: /'#09090b'/g, rep: "'var(--bg-main)'" },
  { regex: /'#121215'/g, rep: "'var(--bg-card)'" },
  { regex: /'#18181b'/g, rep: "'var(--bg-subtle)'" },
  
  // Text colors
  { regex: /'#ffffff'/g, rep: "'var(--text-main)'" },
  { regex: /'#fff'/g, rep: "'var(--text-main)'" },
  { regex: /'#a1a1aa'/g, rep: "'var(--text-muted)'" },
  { regex: /'#71717a'/g, rep: "'var(--text-muted)'" },
  { regex: /'#52525b'/g, rep: "'var(--text-muted)'" },
  { regex: /'#000000'/g, rep: "'var(--bg-main)'" }, // Assuming this was text on green buttons or backgrounds
  
  // Borders
  { regex: /'#27272a'/g, rep: "'var(--border-color)'" },
  
  // Specific fix for Landing Page gradient which was hardcoded
  { regex: /background: 'linear-gradient\(to bottom, #09090b, #121215\)'/g, rep: "background: 'var(--bg-main)'" },

  // Any remaining rgba backgrounds using dark colors
  { regex: /'rgba\(9, 9, 11, [0-9.]+\)'/g, rep: "'rgba(255, 255, 255, 0.95)'" }
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  mappings.forEach(({ regex, rep }) => {
    content = content.replace(regex, rep);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
