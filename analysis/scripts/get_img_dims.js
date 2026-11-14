const fs = require('fs');

function getDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // Simple JPEG dimension reader
  let i = 0;
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    while (i < buf.length - 8) {
      if (buf[i] === 0xFF && (buf[i+1] >= 0xC0 && buf[i+1] <= 0xC3)) {
        const height = buf.readUInt16BE(i + 5);
        const width = buf.readUInt16BE(i + 7);
        return { width, height };
      }
      i++;
    }
  }
  return { width: 'unknown', height: 'unknown' };
}

const p1 = 'C:/Users/Anish/.gemini/antigravity/brain/525a3917-62e9-41cb-a3f3-f335a4d7f180/.user_uploaded/media_1794624193430_c2c53a16.jpg';
const p2 = 'C:/Users/Anish/.gemini/antigravity/brain/525a3917-62e9-41cb-a3f3-f335a4d7f180/.user_uploaded/media_1794624310171_a4ec62fc.jpg';
const p3 = 'C:/Users/Anish/.gemini/antigravity/brain/525a3917-62e9-41cb-a3f3-f335a4d7f180/.user_uploaded/media_1794624399569_83d97ec9.jpg';

console.log('Image 1:', getDimensions(p1));
console.log('Image 2:', getDimensions(p2));
console.log('Image 3:', getDimensions(p3));

