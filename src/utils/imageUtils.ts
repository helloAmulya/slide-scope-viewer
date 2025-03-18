
import { DetectionResult } from "@/types";

export const calculateThumbnailPosition = (
  viewportWidth: number,
  viewportHeight: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  thumbnailSize: { width: number; height: number }
) => {
  // Calculate the visible portion of the image in the main viewport
  const visibleWidth = viewportWidth / scale;
  const visibleHeight = viewportHeight / scale;

  // Calculate the position of the visible area relative to the image
  const visibleX = -offsetX / scale;
  const visibleY = -offsetY / scale;

  // Calculate the scale factor for the thumbnail
  const thumbnailScale = Math.min(
    thumbnailSize.width / imageWidth,
    thumbnailSize.height / imageHeight
  );

  // Calculate the dimensions of the indicator box
  const indicatorWidth = visibleWidth * thumbnailScale;
  const indicatorHeight = visibleHeight * thumbnailScale;

  // Calculate the position of the indicator box relative to the thumbnail
  const indicatorX = visibleX * thumbnailScale;
  const indicatorY = visibleY * thumbnailScale;

  return {
    x: indicatorX,
    y: indicatorY,
    width: indicatorWidth,
    height: indicatorHeight,
  };
};

export const calculateBoundingBoxPosition = (
  bbox: number[],
  scale: number,
  offsetX: number,
  offsetY: number
) => {
  const [x, y, width, height] = bbox;
  
  return {
    x: x * scale + offsetX,
    y: y * scale + offsetY,
    width: width * scale,
    height: height * scale,
  };
};

export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export const getColorForClassId = (classId: number): string => {
  // A list of distinct colors for different class IDs
  const colors = [
    '#FF2D55', // red
    '#5AC8FA', // blue
    '#FFCC00', // yellow
    '#34C759', // green
    '#AF52DE', // purple
    '#FF9500', // orange
    '#00C7BE', // teal
  ];
  
  return colors[classId % colors.length];
};
