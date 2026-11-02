import { Platform } from 'react-native';
import { File, Directory, Paths } from 'expo-file-system';

// expo-file-system 在 Web 上不支持，所以按平台分流：
// - 原生 (iOS/Android)：照片复制到 App 文档目录 images/ 持久保存
// - Web：照片转成 base64 data URI，直接存进 AsyncStorage(localStorage)
const IS_WEB = Platform.OS === 'web';

// 把相机/相册返回的临时 uri 规范化成可持久化的形式。
// Web 上 blob:/data: 统一转成 data URI（fetch + FileReader），这样刷新后图片还在。
export async function normalizeImageUri(uri) {
  if (!uri) return uri;
  if (!IS_WEB) return uri; // 原生保持 file:// uri，交给 saveImageToDocuments 复制
  if (typeof uri === 'string' && uri.startsWith('data:')) return uri; // 已是 data URI
  try {
    const res = await fetch(uri);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject(fr.error);
      fr.readAsDataURL(blob);
    });
  } catch (e) {
    return uri; // 失败退回原始 uri（临时，仅本次会话可见）
  }
}

// 确保图片目录存在
export async function ensureImagesDir() {
  if (IS_WEB) return;
  try {
    const imagesDir = new Directory(Paths.document, 'images');
    imagesDir.create({ intermediates: true, idempotent: true });
  } catch (e) {
    // 已存在等错误忽略
  }
}

// 把临时图片复制到 App 文档目录，持久保存（Web 上直接返回 data URI）
export async function saveImageToDocuments(sourceUri) {
  if (IS_WEB) return sourceUri; // Web 上已是 data URI
  try {
    await ensureImagesDir();
    const ext = (sourceUri.split('.').pop() || 'jpg').toLowerCase();
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const src = new File(sourceUri);
    const dest = new File(new Directory(Paths.document, 'images'), filename);
    await src.copy(dest);
    return dest.uri;
  } catch (e) {
    // 复制失败则退回原始 uri（可能在缓存里，临时可用）
    return sourceUri;
  }
}

// 删除图片文件（只删除 App 文档目录内的；Web 上 data URI 随记录一起删除）
export function deleteImageFile(uri) {
  if (IS_WEB) return;
  try {
    if (uri && uri.includes('/images/')) {
      const f = new File(uri);
      if (f.exists) f.delete();
    }
  } catch (e) {
    // 忽略
  }
}
