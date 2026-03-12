
import fs from 'fs';
import path from 'path';

const projectRoot = 'c:/Users/Kino/.gemini/antigravity/scratch/diccionario-torrevejense';
const dictionaryPath = path.join(projectRoot, 'src/lib/data/dictionary.json');

if (!fs.existsSync(dictionaryPath)) {
    console.error('dictionary.json not found');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

const resources = new Set();
const srcRegex = /src=["']([^"']+)["']/gi;
const hrefRegex = /href=["']([^"']+\.(jpg|jpeg|png|gif|svg|pdf|mp3|mp4))["']/gi;

data.forEach(entry => {
    let match;
    while ((match = srcRegex.exec(entry.html)) !== null) {
        resources.add(match[1]);
    }
    while ((match = hrefRegex.exec(entry.html)) !== null) {
        resources.add(match[1]);
    }
});

console.log(`Found ${resources.size} unique resource references in dictionary.json`);

const broken = [];
resources.forEach(res => {
    // Check if it's a relative path that we can verify
    // Common patterns: Comunes/Images/Pix/...
    // Let's assume they should be in 'static' or some specific directory if they are served
    
    // In SvelteKit, if they are referenced as absolute paths from root, they would be in 'static'
    // If they are relative like 'Comunes/...', we need to know where they are supposed to be.
    // Based on previous errors: /entrada/Comunes/Images/Pix/Marina.jpg
    // This suggests they might be expected in a directory structure that isn't standard SvelteKit 'static'
    // or they are missing from 'static'.
    
    let fullPath = path.join(projectRoot, 'static', res);
    if (!fs.existsSync(fullPath)) {
        // Also check relative to where the page might be (though in JSON it's usually static)
        broken.push(res);
    }
});

console.log(`Total broken references: ${broken.length}`);
broken.slice(0, 20).forEach(b => console.log(`  - ${b}`));

fs.writeFileSync('all_broken_resources.json', JSON.stringify(broken, null, 2));
