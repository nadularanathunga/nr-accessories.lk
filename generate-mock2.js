const fs = require('fs');
const seedContent = fs.readFileSync('server/seed.js', 'utf8');

const startIndex = seedContent.indexOf('const sampleProducts = [');
const endIndex = seedContent.indexOf('];', startIndex) + 1;
let sampleProductsStr = seedContent.slice(startIndex, endIndex);

// Replace ALL image URLs with magic pattern images based on category keywords
// But wait, the easiest way is just to load it as an array and map it in JS, then write it out.
