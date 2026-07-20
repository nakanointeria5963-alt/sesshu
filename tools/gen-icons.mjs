/* アプリアイコン一式（icon-192/icon-512/maskable-512/apple-touch-icon）を
   同じSVGモチーフ（節酒＝目盛り付きグラス＋達成チェック）から生成する。
   色を変えたい場合はこのファイルのカラーコードを直接編集して再実行する。
   実行: node tools/gen-icons.mjs */
import { chromium } from 'playwright';
import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXEC =
  process.env.CHROME_PATH ||
  (existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
    : '');

function svg(scale) {
  const glassGroup = `
    <g transform="translate(50,50) scale(${scale}) translate(-50,-50)">
      <rect x="30" y="24" width="40" height="52" rx="9" fill="#fdf3d9" />
      <rect x="27" y="21" width="46" height="7" rx="3.5" fill="#fdf3d9" />
      <rect x="33" y="49" width="34" height="23" rx="5" fill="#0e7490" opacity="0.55" />
      <rect x="34.5" y="31" width="7" height="3.4" rx="1.7" fill="#155e75" />
      <rect x="34.5" y="39" width="9" height="3.4" rx="1.7" fill="#155e75" />
      <rect x="34.5" y="47" width="7" height="3.4" rx="1.7" fill="#155e75" />
      <circle cx="68" cy="68" r="14.5" fill="#0e7490" />
      <circle cx="68" cy="68" r="12.5" fill="#22c55e" />
      <path d="M61.5 68.5 L66 73 L75 63" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#155e75" />
        <stop offset="1" stop-color="#0891b2" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="100" height="100" fill="url(#bg)" />
    ${glassGroup}
  </svg>`;
}

function html(scale) {
  return `<!doctype html><html><head><style>html,body{margin:0;padding:0;}</style></head><body>${svg(scale)}</body></html>`;
}

/* maskable-512はOSが円形にクロップするため、内容を安全域(中心80%程度)に収める */
const targets = [
  { file: 'icon-192.png', size: 192, scale: 0.86 },
  { file: 'icon-512.png', size: 512, scale: 0.86 },
  { file: 'maskable-512.png', size: 512, scale: 0.62 },
  { file: 'apple-touch-icon.png', size: 180, scale: 0.86 },
];

const browser = await chromium.launch(EXEC ? { executablePath: EXEC } : {});
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  await page.setContent(html(t.scale));
  await page.waitForTimeout(50);
  const buf = await page.screenshot();
  writeFileSync(path.join(OUT, t.file), buf);
  await page.close();
  console.log('wrote', t.file);
}
await browser.close();
