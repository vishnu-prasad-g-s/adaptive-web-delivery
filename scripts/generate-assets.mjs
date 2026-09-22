import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const probeDir = path.join(publicDir, 'probe');
const smallDir = path.join(publicDir, 'images', 'small');
const largeDir = path.join(publicDir, 'images', 'large');

[probeDir, smallDir, largeDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. Create probe-50kb.bin (51,200 bytes)
const probeBuffer = Buffer.alloc(51200, 'X');
fs.writeFileSync(path.join(probeDir, 'probe-50kb.bin'), probeBuffer);
console.log('Created probe-50kb.bin (50 KB)');

// 2. Products color theme and labels
const products = [
  { id: 'p1', name: 'Aura Headphones', color: '#3B82F6', icon: '🎧' },
  { id: 'p2', name: 'Pulse Smartwatch', color: '#8B5CF6', icon: '⌚' },
  { id: 'p3', name: 'Sonic Speaker', color: '#EC4899', icon: '🔊' },
  { id: 'p4', name: 'Lumina Keyboard', color: '#10B981', icon: '⌨️' },
  { id: 'p5', name: 'ErgoGlide Mouse', color: '#F59E0B', icon: '🖱️' },
  { id: 'p6', name: 'Optix 4K Webcam', color: '#6366F1', icon: '📷' },
  { id: 'p7', name: 'Nova Pad Tablet', color: '#14B8A6', icon: '📱' },
  { id: 'p8', name: 'ChargePod 65W', color: '#EF4444', icon: '⚡' }
];

async function generateImages() {
  for (const p of products) {
    const svgContent = `
      <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${p.color}" stop-opacity="1" />
            <stop offset="100%" stop-color="#0F172A" stop-opacity="1" />
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#grad)" />
        <circle cx="400" cy="350" r="180" fill="#ffffff" fill-opacity="0.15" />
        <text x="400" y="380" font-family="sans-serif" font-size="120" text-anchor="middle" fill="#ffffff">${p.icon}</text>
        <text x="400" y="580" font-family="sans-serif" font-size="42" font-weight="bold" text-anchor="middle" fill="#ffffff">${p.name}</text>
        <text x="400" y="640" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#E2E8F0">Adaptive Delivery Demo Asset</text>
      </svg>
    `;

    const svgBuffer = Buffer.from(svgContent);

    // High quality large JPEG (800x800, quality 90)
    await sharp(svgBuffer)
      .resize(800, 800)
      .jpeg({ quality: 90 })
      .toFile(path.join(largeDir, `${p.id}.jpg`));

    // Low quality small JPEG (200x200, quality 40)
    await sharp(svgBuffer)
      .resize(200, 200)
      .jpeg({ quality: 40 })
      .toFile(path.join(smallDir, `${p.id}.jpg`));

    console.log(`Generated small & large JPEGs for ${p.id} (${p.name})`);
  }
}

generateImages().then(() => console.log('Asset generation complete!'));
