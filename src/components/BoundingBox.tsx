
import { calculateBoundingBoxPosition, getColorForClassId } from "@/utils/imageUtils";
import { DetectionResult } from "@/types";
import { memo } from "react";

interface BoundingBoxProps {
  detection: DetectionResult;
  scale: number;
  offsetX: number;
  offsetY: number;
  isHighlighted?: boolean;
}

const BoundingBox = memo(({ 
  detection, 
  scale, 
  offsetX, 
  offsetY,
  isHighlighted = false
}: BoundingBoxProps) => {
  const { x, y, width, height } = calculateBoundingBoxPosition(
    detection.bbox,
    scale,
    offsetX,
    offsetY
  );

  const color = getColorForClassId(detection.class_id);
  
  return (
    <div
      className={`bounding-box ${isHighlighted ? 'z-10' : 'z-0'}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderColor: color,
        backgroundColor: isHighlighted 
          ? `${color}33` // 20% opacity
          : `${color}1A`, // 10% opacity
        borderWidth: isHighlighted ? '3px' : '2px',
        boxShadow: isHighlighted ? `0 0 0 1px rgba(255,255,255,0.5), 0 0 10px ${color}66` : 'none',
      }}
    />
  );
});

BoundingBox.displayName = "BoundingBox";

export default BoundingBox;
