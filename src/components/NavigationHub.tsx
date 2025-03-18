
import { useEffect, useRef, memo } from "react";
import { calculateThumbnailPosition } from "@/utils/imageUtils";

interface NavigationHubProps {
  imageUrl: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  viewportWidth: number;
  viewportHeight: number;
  imageWidth: number;
  imageHeight: number;
  onNavigate: (x: number, y: number) => void;
}

const NavigationHub = memo(({
  imageUrl,
  scale,
  offsetX,
  offsetY,
  viewportWidth,
  viewportHeight,
  imageWidth,
  imageHeight,
  onNavigate
}: NavigationHubProps) => {
  const hubRef = useRef<HTMLDivElement>(null);
  const thumbnailSize = { width: 200, height: 200 };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hubRef.current) return;
    
    const rect = hubRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert thumbnail coordinates to main image coordinates
    const thumbnailScale = Math.min(
      thumbnailSize.width / imageWidth,
      thumbnailSize.height / imageHeight
    );
    
    const imageX = x / thumbnailScale;
    const imageY = y / thumbnailScale;
    
    // Calculate center offset
    const centerOffsetX = -(imageX - viewportWidth / (2 * scale));
    const centerOffsetY = -(imageY - viewportHeight / (2 * scale));
    
    onNavigate(centerOffsetX * scale, centerOffsetY * scale);
  };
  
  const indicator = calculateThumbnailPosition(
    viewportWidth,
    viewportHeight,
    imageWidth,
    imageHeight,
    scale,
    offsetX,
    offsetY,
    thumbnailSize
  );
  
  // Calculate max dimensions based on the aspect ratio
  const thumbnailScale = Math.min(
    thumbnailSize.width / imageWidth,
    thumbnailSize.height / imageHeight
  );
  
  const scaledWidth = imageWidth * thumbnailScale;
  const scaledHeight = imageHeight * thumbnailScale;
  
  return (
    <div 
      className="navigation-hub animate-scale-in"
      style={{ width: `${thumbnailSize.width}px`, height: `${thumbnailSize.height}px` }}
      ref={hubRef}
      onClick={handleClick}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          width: `${thumbnailSize.width}px`, 
          height: `${thumbnailSize.height}px` 
        }}
      >
        <img 
          src={imageUrl} 
          alt="Navigation overview"
          className="pointer-events-none"
          style={{ 
            width: `${scaledWidth}px`, 
            height: `${scaledHeight}px`,
            objectFit: "contain" 
          }}
        />
        <div 
          className="navigation-hub-indicator"
          style={{
            left: `${indicator.x}px`,
            top: `${indicator.y}px`,
            width: `${indicator.width}px`,
            height: `${indicator.height}px`,
          }}
        />
      </div>
    </div>
  );
});

NavigationHub.displayName = "NavigationHub";

export default NavigationHub;
