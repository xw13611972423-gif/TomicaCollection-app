import { File, Directory, Paths } from 'expo-file-system';

const imagesDir = new Directory(Paths.document, 'images');

// 确保图片目录存在
export async function ensureImagesDir() {
  try {
    imagesDir.create({ intermediates: true, idempotent: true });
  } catch (e) {
    // 已存在等错误忽略
  }
}

// 把临时图片（相机/相册返回的 uri）复制到 App 文档目录，持久保存
export async function saveImageToDocuments(sourceUri) {
  try {
    await ensureImagesDir();
    const ext = (sourceUri.split('.').pop() || 'jpg').toLowerCase();
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const src = new File(sourceUri);
    const dest = new File(imagesDir, filename);
    await src.copy(dest);
    return dest.uri;
  } catch (e) {
    // 复制失败则退回原始 uri（可能在缓存里，临时可用）
    return sourceUri;
  }
}

// 删除图片文件（只删除 App 文档目录内的）
export function deleteImageFile(uri) {
  try {
    if (uri && uri.includes('/images/')) {
      const f = new File(uri);
      if (f.exists) f.delete();
    }
  } catch (e) {
    // 忽略
  }
}
