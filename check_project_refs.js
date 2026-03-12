
import fs from 'fs';
import path from 'path';

const projectRoot = 'c:/Users/Kino/.gemini/antigravity/scratch/diccionario-torrevejense';

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.svelte-kit') {
                getAllFiles(filePath, fileList);
            }
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const allFiles = getAllFiles(projectRoot);
const brokenRefs = [];

const regex = /(src|href)=["']([^"']+)["']/gi;

allFiles.forEach(file => {
    // Skip large binary files if any, though we know there are none
    if (file.endsWith('.json') || file.endsWith('.svelte') || file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.css')) {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            const url = match[2];
            if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#') || url.includes('%sveltekit')) continue;
            
            // Check existence
            const possiblePaths = [
                path.join(projectRoot, 'static', url),
                path.join(projectRoot, url),
                path.join(path.dirname(file), url)
            ];
            
            let exists = false;
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    exists = true;
                    break;
                }
            }
            
            if (!exists) {
                brokenRefs.push({ file, attr: match[1], url });
            }
        }
    }
});

console.log(`Found ${brokenRefs.length} potentially broken references project-wide.`);
brokenRefs.forEach(b => {
    console.log(`- File: ${path.relative(projectRoot, b.file)} | ${b.attr}: ${b.url}`);
});
