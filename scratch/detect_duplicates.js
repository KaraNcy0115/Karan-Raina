
import fs from 'fs';

const content = fs.readFileSync('client/src/App.tsx', 'utf8');
const lines = content.split('\n');

let keysInObject = new Set();

lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.includes('{') && !trimmed.includes('}')) {
        keysInObject = new Set();
    }
    
    // Key match: something like "key," or "key: value," or "key = value"
    // Also handle shorthand: "key,"
    const keyMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*[:=,]/);
    if (keyMatch) {
        const key = keyMatch[1];
        if (keysInObject.has(key)) {
            console.log(`Duplicate key "${key}" found at line ${index + 1}`);
        }
        keysInObject.add(key);
    }
    
    if (trimmed.includes('}')) {
        keysInObject = new Set();
    }
});
