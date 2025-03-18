
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

  // Use class_id if available, otherwise use a default value
  const classId = detection.class_id !== undefined ? detection.class_id : 0;
  const color = getColorForClassId(classId);
  
  // Create className based on isHighlighted status
  const boxClasses = `
    bounding-box
    absolute
    pointer-events-none
    border-solid
    ${isHighlighted ? 'z-10' : 'z-0'}
    ${isHighlighted ? 'border-[3px]' : 'border-[2px]'}
  `;

  return (
    <div
      className={boxClasses}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderColor: color,
        backgroundColor: isHighlighted ? `${color}33` : `${color}1A`,
        boxShadow: isHighlighted ? `0 0 0 1px rgba(255,255,255,0.5), 0 0 10px ${color}66` : 'none',
      }}
    />
  );
});

BoundingBox.displayName = "BoundingBox";

export default BoundingBox;
