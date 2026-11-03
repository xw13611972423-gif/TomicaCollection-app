// 主题 token：浅色 / 深色
export function createTheme(mode) {
  const dark = mode === 'dark';
  return {
    dark,
    bg: dark ? '#0E1116' : '#F2F4F7',
    card: dark ? '#1A1F27' : '#FFFFFF',
    text: dark ? '#F2F4F7' : '#1A1D21',
    text2: dark ? '#B8BEC9' : '#4A4F57',
    text3: dark ? '#8A909B' : '#9AA0A8',
    border: dark ? '#262D38' : '#E7EAEF',
    accent: dark ? '#4DA3FF' : '#1E88E5',
    accentSoft: dark ? 'rgba(77,163,255,0.16)' : '#E3F2FD',
    danger: dark ? '#FF6B6B' : '#E53935',
    dangerSoft: dark ? 'rgba(255,107,107,0.18)' : 'rgba(229,57,53,0.12)',
    chip: dark ? '#232A35' : '#EDF0F4',
    chipText: dark ? '#D7DBE3' : '#3A4047',
    inputBg: dark ? '#1A1F27' : '#FFFFFF',
    placeholder: dark ? '#6B7280' : '#9AA0A8',
    // 液态玻璃
    glass: dark ? 'rgba(30,36,46,0.55)' : 'rgba(255,255,255,0.55)',
    glassStrong: dark ? 'rgba(30,36,46,0.78)' : 'rgba(255,255,255,0.80)',
    glassBorder: dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)',
    glassHighlight: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.75)',
  };
}

// 液态玻璃表面（按钮 / 卡片通用）：玻璃开启时半透明，关闭时实色
export function glassSurface(theme, glass, radius = 18, strong = false) {
  if (glass) {
    return {
      backgroundColor: strong ? theme.glassStrong : theme.glass,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      borderRadius: radius,
    };
  }
  return {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: radius,
  };
}
