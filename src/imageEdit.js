import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

const OPTS = { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG };

export async function rotateImage(uri) {
  const r = await ImageManipulator.manipulateAsync(uri, [{ rotate: 90 }], OPTS);
  return r.uri;
}

export async function flipHorizontal(uri) {
  const r = await ImageManipulator.manipulateAsync(uri, [{ flip: ImageManipulator.FlipType.Horizontal }], OPTS);
  return r.uri;
}

export async function flipVertical(uri) {
  const r = await ImageManipulator.manipulateAsync(uri, [{ flip: ImageManipulator.FlipType.Vertical }], OPTS);
  return r.uri;
}

export async function cropSquare(uri) {
  const dims = await new Promise((resolve) => {
    Image.getSize(uri, (w, h) => resolve({ w, h }), () => resolve({ w: 0, h: 0 }));
  });
  if (!dims.w || !dims.h) return uri;
  const size = Math.min(dims.w, dims.h);
  const originX = (dims.w - size) / 2;
  const originY = (dims.h - size) / 2;
  const r = await ImageManipulator.manipulateAsync(
    uri,
    [{ crop: { originX, originY, width: size, height: size } }],
    OPTS
  );
  return r.uri;
}
