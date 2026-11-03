// 多美卡常见车型预置清单（可自行增删）
export const presetModels = [
  '丰田 Supra',
  '丰田 AE86',
  '丰田 86 / GR86',
  '丰田 埃尔法',
  '丰田 海狮',
  '丰田 普拉多',
  '日产 GT-R',
  '日产 Skyline',
  '日产 Fairlady Z',
  '本田 NSX',
  '本田 思域 Type R',
  '马自达 RX-7',
  '马自达 MX-5',
  '斯巴鲁 WRX',
  '三菱 Lancer EVO',
  '铃木 吉姆尼',
  '保时捷 911',
  '兰博基尼 Aventador',
  '法拉利',
  '迈凯伦',
  '救护车',
  '消防车',
  '警车',
  '巴士',
  '卡车',
  '新干线',
];

// 预置颜色（name 显示名，hex 十六进制）
export const presetColors = [
  { name: '红色', hex: '#E53935' },
  { name: '橙色', hex: '#FB8C00' },
  { name: '黄色', hex: '#FDD835' },
  { name: '绿色', hex: '#43A047' },
  { name: '蓝色', hex: '#1E88E5' },
  { name: '紫色', hex: '#8E24AA' },
  { name: '黑色', hex: '#212121' },
  { name: '白色', hex: '#FAFAFA' },
  { name: '灰色', hex: '#9E9E9E' },
  { name: '银色', hex: '#B0BEC5' },
  { name: '金色', hex: '#C9A227' },
  { name: '棕色', hex: '#6D4C41' },
  { name: '粉色', hex: '#EC407A' },
  { name: '特殊涂装', hex: '#7E57C2' },
];

// 型号选择里的「自定义」占位项
export const CUSTOM_MODEL_MARKER = '自定义…';

// 判断颜色是否为浅色（用于勾选符号的对比色）
export function isLightHex(hex) {
  const h = (hex || '').replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 0.6;
}

// 价格货币选项
export const presetCurrencies = ['¥', '$', '€', '£', 'HK$', 'NT$'];

// 购买地快捷选项
export const presetLocations = ['淘宝', '京东', '闲鱼', '日本', '香港', '实体店', '官网', '其他'];

// HSV → 十六进制（h: 0-360，s: 0-1，v: 0-1）
export function hsvToHex(h, s, v) {
  const hh = ((h % 360) + 360) % 360;
  const i = Math.floor(hh / 60) % 6;
  const f = hh / 60 - Math.floor(hh / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r, g, b;
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    default: r = v; g = p; b = q; break;
  }
  const toHex = (x) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 十六进制 → HSV
// 返回 { h: 0-360, s: 0-1, v: 0-1 }
export function hexToHsv(hex) {
  const raw = (hex || '#E53935').replace('#', '');
  const full = raw.length >= 6 ? raw.slice(0, 6) : raw.padEnd(6, '0');
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d > 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const sat = max === 0 ? 0 : d / max;
  return { h: hue, s: sat, v: max };
}
