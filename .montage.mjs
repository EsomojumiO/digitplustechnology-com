import sharp from "sharp";
import fs from "fs";
const [outName, cols, ...files] = process.argv.slice(2);
const C = +cols, tile = 300, pad = 6, labelH = 22;
const rows = Math.ceil(files.length / C);
const W = C*(tile+pad)+pad, H = rows*(tile+labelH+pad)+pad;
const composites = [];
for (let i=0;i<files.length;i++){
  const f = files[i];
  const col = i%C, row = Math.floor(i/C);
  const x = pad+col*(tile+pad), y = pad+row*(tile+labelH+pad);
  try {
    const buf = await sharp(f).resize(tile, tile, {fit:"cover"}).toBuffer();
    composites.push({input: buf, left:x, top:y+labelH});
    const label = f.split("/").pop().replace(".jpg","").slice(0,42);
    const svg = Buffer.from(`<svg width="${tile}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="2" y="15" font-family="monospace" font-size="12" fill="#fff">${i+1}. ${label}</text></svg>`);
    composites.push({input: svg, left:x, top:y});
  } catch(e){ console.error("skip",f,e.message); }
}
await sharp({create:{width:W,height:H,channels:3,background:"#222"}}).composite(composites).jpeg({quality:80}).toFile(outName);
console.log("wrote", outName, files.length, "images");
