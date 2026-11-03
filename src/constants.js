// 多美卡车型预置清单（全部为现行常规版真实车型，编号为参考值，可能因年份/版本不同，请以包装盒为准）
// 每项 { name: 车型名, number: 包装盒编号 }
export const presetModels = [
  { name: '丰田 Supra', number: '22' },
  { name: '日产 GT-R', number: '23' },
  { name: '本田 NSX', number: '43' },
  { name: '马自达 CX-60', number: '6' },
  { name: '丰田 普锐斯', number: '19' },
  { name: '丰田 Sienta', number: '16' },
  { name: '丰田 埃尔法', number: '12' },
  { name: '丰田 Noah', number: '50' },
  { name: '丰田 Hilux', number: '67' },
  { name: '日产 Skyline', number: '48' },
  { name: '日产 Fairlady Z', number: '88' },
  { name: '本田 思域 Type R', number: '78' },
  { name: '马自达 CX-5', number: '93' },
  { name: '斯巴鲁 WRX', number: '2' },
  { name: '三菱 欧蓝德 PHEV', number: '10' },
  { name: '铃木 吉姆尼', number: '14' },
  { name: '特斯拉 Model 3', number: '98' },
  { name: '兰博基尼 Aventador', number: '70' },
  { name: '法拉利', number: '46' },
  { name: '特斯拉 Model Y', number: '28' },
  { name: '救护车', number: '18' },
  { name: '消防车', number: '41' },
  { name: '警车', number: '1' },
  { name: '巴士', number: '20' },
  { name: '卡车', number: '85' },
  { name: '新干线 H5系 运输车', number: '122' },
  { name: '丰田 皇冠', number: '72' },
  { name: '丰田 卡罗拉', number: '52' },
  { name: '丰田 兰德酷路泽', number: '38' },
  { name: '本田 Freed', number: '44' },
  { name: '本田 雅阁', number: '36' },
  { name: '日产 GT-R Nismo', number: '60' },
  { name: '日产 Serena', number: '94' },
  { name: '日产 Sakura', number: '8' },
  { name: '斯巴鲁 森林人', number: '99' },
  { name: '三菱 Delica Mini', number: '24' },
  { name: '斯巴鲁 Levorg', number: '59' },
  { name: '大发 轻卡', number: '76' },
  { name: '讴歌 Integra', number: '75' },
  { name: '兰博基尼 Countach', number: '74' },
  { name: '兰博基尼 Huracán', number: '11' },
  { name: '奔驰 EQS', number: '47' },
  { name: '布加迪 Chiron', number: '37' },
  { name: '雷克萨斯 IS 350 F Sport', number: '100' },
  { name: '奔驰 G-Class', number: '35' },
  { name: '奔驰 AMG GT', number: '7' },
  { name: '丰田 皇冠 轿车', number: '62' },
  { name: '丰田 皇冠 Athlete', number: '92' },
  { name: '大发 Move Canbus', number: '86' },
  { name: '光冈 Buddy', number: '21' },
  { name: '三菱 Triton', number: '30' },
  { name: 'UD 卡车 Quon', number: '31' },
  { name: '悍马 H2', number: '15' },
  { name: '大发 Rocky 巡逻车', number: '81' },
  { name: '福特 野马', number: '91' },
  { name: '伦敦巴士', number: '95' },
  { name: '小松 挖掘机', number: '9' },
  { name: '垃圾车', number: '45' },
  { name: '出租车', number: '51' },
  { name: '摩托车（警用）', number: '4' },
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
