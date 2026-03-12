
import fs from 'fs';
import path from 'path';

const projectRoot = 'c:/Users/Kino/.gemini/antigravity/scratch/diccionario-torrevejense';
const dictionaryPath = path.join(projectRoot, 'src/lib/data/dictionary.json');

const data = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

const refs = [];
const regex = /(src|href)=["']([^"']+)["']/gi;

data.forEach(entry => {
    let match;
    while ((match = regex.exec(entry.html)) !== null) {
        refs.push({ headword: entry.headword, attr: match[1], url: match[2] });
    }
});

console.log(`Found ${refs.length} references in dictionary.json`);

const broken = [];
refs.forEach(ref => {
    if (ref.url.startsWith('http')) return; // Skip external for now or check later
    
    // Check if it exists in static (if it existed) or anywhere else
    const possiblePaths = [
        path.join(projectRoot, 'static', ref.url),
        path.join(projectRoot, ref.url),
        path.join(projectRoot, 'src', ref.url)
    ];
    
    let exists = false;
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            exists = true;
            break;
        }
    }
    
    if (!exists) {
        broken.push(ref);
    }
});

console.log(`Broken local references: ${broken.length}`);
broken.forEach(b => {
    console.log(`- Headword: ${b.headword} | ${b.attr}: ${b.url}`);
});
