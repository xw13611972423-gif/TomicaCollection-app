// 多美卡车型预置清单（编号留空，请按包装盒上的两位编号自行填写）
// 每项 { name: 车型名, number: 包装盒编号（两位） }
export const presetModels = [
  { name: '丰田 Supra', number: '' },
  { name: '日产 GT-R', number: '' },
  { name: '本田 NSX', number: '' },
  { name: '马自达 RX-7', number: '' },
  { name: '丰田 AE86', number: '' },
  { name: '丰田 86 / GR86', number: '' },
  { name: '丰田 埃尔法', number: '' },
  { name: '丰田 海狮', number: '' },
  { name: '丰田 普拉多', number: '' },
  { name: '日产 Skyline', number: '' },
  { name: '日产 Fairlady Z', number: '' },
  { name: '本田 思域 Type R', number: '' },
  { name: '马自达 MX-5', number: '' },
  { name: '斯巴鲁 WRX', number: '' },
  { name: '三菱 Lancer EVO', number: '' },
  { name: '铃木 吉姆尼', number: '' },
  { name: '保时捷 911', number: '' },
  { name: '兰博基尼 Aventador', number: '' },
  { name: '法拉利', number: '' },
  { name: '迈凯伦', number: '' },
  { name: '救护车', number: '' },
  { name: '消防车', number: '' },
  { name: '警车', number: '' },
  { name: '巴士', number: '' },
  { name: '卡车', number: '' },
  { name: '新干线', number: '' },
  { name: '丰田 皇冠', number: '' },
  { name: '丰田 卡罗拉', number: '' },
  { name: '丰田 兰德酷路泽', number: '' },
  { name: '本田 飞度', number: '' },
  { name: '本田 S2000', number: '' },
  { name: '日产 GT-R Nismo', number: '' },
  { name: '日产 奇骏', number: '' },
  { name: '马自达 RX-8', number: '' },
  { name: '斯巴鲁 森林人', number: '' },
  { name: '三菱 帕杰罗', number: '' },
  { name: '铃木 奥拓', number: '' },
  { name: '大发 轻卡', number: '' },
  { name: '保时捷 918 Spyder', number: '' },
  { name: '兰博基尼 Countach', number: '' },
  { name: '法拉利 F40', number: '' },
  { name: '迈凯伦 P1', number: '' },
  { name: '布加迪 Veyron', number: '' },
  { name: '柯尼塞格', number: '' },
  { name: '奔驰 G-Class', number: '' },
  { name: '奔驰 AMG GT', number: '' },
  { name: '宝马 M3', number: '' },
  { name: '奥迪 R8', number: '' },
  { name: '大众 甲壳虫', number: '' },
  { name: 'MINI Cooper', number: '' },
  { name: '特斯拉 Model S', number: '' },
  { name: '特斯拉 Cybertruck', number: '' },
  { name: '悍马 H2', number: '' },
  { name: 'Jeep 牧马人', number: '' },
  { name: '福特 野马', number: '' },
  { name: '雪佛兰 科迈罗', number: '' },
  { name: '道奇 Charger', number: '' },
  { name: '垃圾车', number: '' },
  { name: '出租车', number: '' },
  { name: '摩托车（警用）', number: '' },
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

// 价格货币选项
export const presetCurrencies = ['¥', '$', '€', '£', 'HK$', 'NT$'];

// 购买地快捷选项
export const presetLocations = ['淘宝', '京东', '闲鱼', '日本', '香港', '实体店', '官网', '其他'];

// 判断颜色是否为浅色（用于勾选符号的对比色）
export function isLightHex(hex) {
  const h = (hex || '').replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 0.6;
}

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
