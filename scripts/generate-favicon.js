const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="128" height="128" rx="24" fill="url(#grad1)"/>
  
  <g transform="translate(20, 20)">
    <path d="M44 8 L64 8 L68 20 L76 20 A4 4 0 0 1 80 24 L80 72 A4 4 0 0 1 76 76 L12 76 A4 4 0 0 1 8 72 L8 24 A4 4 0 0 1 12 20 L40 20 Z" 
          fill="white" 
          opacity="0.9"/>
    
    <rect x="26" y="32" width="36" height="8" rx="2" fill="#3B82F6"/>
    <rect x="26" y="44" width="36" height="8" rx="2" fill="#6366F1"/>
    <rect x="26" y="56" width="36" height="8" rx="2" fill="#8B5CF6"/>
    
    <circle cx="16" cy="60" r="3" fill="white" opacity="0.7"/>
    <circle cx="72" cy="60" r="3" fill="white" opacity="0.7"/>
  </g>
</svg>`;

const publicDir = path.join(__dirname, '../public');
const faviconPath = path.join(publicDir, 'favicon.svg');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(faviconPath, svgContent);
console.log('✅ favicon.svg created successfully!');
console.log('📁 Location:', faviconPath);
