
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { DetectionResult, Finding } from "@/types";
import { preloadImage } from "@/utils/imageUtils";
import BoundingBox from "./BoundingBox";
import ViewControls from "./ViewControls";
import NavigationHub from "./NavigationHub";
import { Loader2 } from "lucide-react";

interface SlideViewerProps {
  imageUrl: string;
  detections: DetectionResult[];
  activeFindingId: string | null;
  findings: Finding[];
}

const ZOOM_FACTOR = 1.2;
const MIN_SCALE = 0.5;
const MAX_SCALE = 10;
const DEFAULT_SCALE = 1;

const SlideViewer = memo(({ 
  imageUrl, 
  detections, 
  activeFindingId,
  findings 
}: SlideViewerProps) => {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Determine the highlighted detection (if any)
  const activeFinding = findings.find(f => f.id === activeFindingId);
  const highlightedDetectionIndex = activeFinding?.detectionIndex ?? -1;

  // Preload the image and get its dimensions
  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        const img = await preloadImage(imageUrl);
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        
        // Center the image
        if (viewportRef.current) {
          const viewport = viewportRef.current;
          const viewportWidth = viewport.clientWidth;
          const viewportHeight = viewport.clientHeight;
          
          // Calculate initial scale to fit image in viewport
          const scaleX = viewportWidth / img.naturalWidth;
          const scaleY = viewportHeight / img.naturalHeight;
          const initialScale = Math.min(scaleX, scaleY, 1);
          
          setScale(initialScale);
          
          // Center the image
          const scaledWidth = img.naturalWidth * initialScale;
          const scaledHeight = img.naturalHeight * initialScale;
          setOffsetX((viewportWidth - scaledWidth) / 2);
          setOffsetY((viewportHeight - scaledHeight) / 2);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load image:", error);
        setIsLoading(false);
      }
    };
    
    loadImage();
  }, [imageUrl]);
  
  // Focus on the highlighted detection when activeFindingId changes
  useEffect(() => {
    if (highlightedDetectionIndex >= 0 && highlightedDetectionIndex < detections.length) {
      const detection = detections[highlightedDetectionIndex];
      const [x, y, width, height] = detection.bbox;
      
      // Calculate center of the bounding box
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      
      // Get viewport dimensions
      if (viewportRef.current) {
        const viewport = viewportRef.current;
        const viewportWidth = viewport.clientWidth;
        const viewportHeight = viewport.clientHeight;
        
        // Set scale to ensure good visibility (zoom in a bit)
        const newScale = Math.min(
          viewportWidth / (width * 4),
          viewportHeight / (height * 4),
          MAX_SCALE
        );
        
        setScale(Math.max(newScale, scale));
        
        // Center the bounding box
        const newOffsetX = -centerX * newScale + viewportWidth / 2;
        const newOffsetY = -centerY * newScale + viewportHeight / 2;
        
        // Apply smooth transition
        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);
      }
    }
  }, [highlightedDetectionIndex, detections, scale]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    
    setIsDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartOffset({ x: offsetX, y: offsetY });
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
    }
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startDragPos.x;
    const dy = e.clientY - startDragPos.y;
    
    setOffsetX(startOffset.x + dx);
    setOffsetY(startOffset.y + dy);
  }, [isDragging, startDragPos, startOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.1s ease-out';
    }
  }, []);
  
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get cursor position relative to viewport
    if (!viewportRef.current) return;
    const viewport = viewportRef.current;
    const rect = viewport.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    
    // Calculate cursor position relative to image at current scale
    const imageX = (cursorX - offsetX) / scale;
    const imageY = (cursorY - offsetY) / scale;
    
    // Calculate new scale
    let newScale = scale;
    if (e.deltaY < 0) {
      // Zoom in
      newScale = Math.min(scale * ZOOM_FACTOR, MAX_SCALE);
    } else {
      // Zoom out
      newScale = Math.max(scale / ZOOM_FACTOR, MIN_SCALE);
    }
    
    // Calculate new offsets to zoom into/out of the cursor position
    const newOffsetX = cursorX - imageX * newScale;
    const newOffsetY = cursorY - imageY * newScale;
    
    setScale(newScale);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };
  
  const handleZoomIn = () => {
    if (scale >= MAX_SCALE) return;
    
    // Get viewport center
    if (!viewportRef.current) return;
    const viewport = viewportRef.current;
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    
    // Calculate center position relative to image at current scale
    const centerX = (viewportWidth / 2 - offsetX) / scale;
    const centerY = (viewportHeight / 2 - offsetY) / scale;
    
    // Calculate new scale
    const newScale = Math.min(scale * ZOOM_FACTOR, MAX_SCALE);
    
    // Calculate new offsets to zoom into the center
    const newOffsetX = viewportWidth / 2 - centerX * newScale;
    const newOffsetY = viewportHeight / 2 - centerY * newScale;
    
    setScale(newScale);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };
  
  const handleZoomOut = () => {
    if (scale <= MIN_SCALE) return;
    
    // Get viewport center
    if (!viewportRef.current) return;
    const viewport = viewportRef.current;
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    
    // Calculate center position relative to image at current scale
    const centerX = (viewportWidth / 2 - offsetX) / scale;
    const centerY = (viewportHeight / 2 - offsetY) / scale;
    
    // Calculate new scale
    const newScale = Math.max(scale / ZOOM_FACTOR, MIN_SCALE);
    
    // Calculate new offsets to zoom out from the center
    const newOffsetX = viewportWidth / 2 - centerX * newScale;
    const newOffsetY = viewportHeight / 2 - centerY * newScale;
    
    setScale(newScale);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };
  
  const handleReset = () => {
    // Reset to initial view
    if (!viewportRef.current) return;
    const viewport = viewportRef.current;
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    
    // Calculate scale to fit image in viewport
    const scaleX = viewportWidth / imageSize.width;
    const scaleY = viewportHeight / imageSize.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    // Center the image
    const scaledWidth = imageSize.width * newScale;
    const scaledHeight = imageSize.height * newScale;
    const newOffsetX = (viewportWidth - scaledWidth) / 2;
    const newOffsetY = (viewportHeight - scaledHeight) / 2;
    
    setScale(newScale);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };
  
  const handleNavigate = (x: number, y: number) => {
    setOffsetX(x);
    setOffsetY(y);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Calculate viewport dimensions
  const viewportWidth = viewportRef.current?.clientWidth || 0;
  const viewportHeight = viewportRef.current?.clientHeight || 0;
  
  return (
    <div className="slide-container">
      <div
        ref={viewportRef}
        className="slide-viewport"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div
          ref={containerRef}
          className="slide-canvas"
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
          }}
        >
          <img
            src={imageUrl}
            alt="Whole Slide Image"
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              objectFit: 'contain',
            }}
          />
          
          {detections.map((detection, index) => (
            <BoundingBox
              key={index}
              detection={detection}
              scale={1}
              offsetX={0}
              offsetY={0}
              isHighlighted={index === highlightedDetectionIndex}
            />
          ))}
        </div>
      </div>
      
      {imageSize.width > 0 && (
        <NavigationHub
          imageUrl={imageUrl}
          scale={scale}
          offsetX={offsetX}
          offsetY={offsetY}
          viewportWidth={viewportWidth}
          viewportHeight={viewportHeight}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
          onNavigate={handleNavigate}
        />
      )}
      
      <ViewControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        scale={scale}
        maxScale={MAX_SCALE}
        minScale={MIN_SCALE}
      />
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="flex flex-col items-center gap-4">
            <div className="loading-spinner"></div>
            <p className="text-foreground font-medium">Loading slide image...</p>
          </div>
        </div>
      )}
    </div>
  );
});

SlideViewer.displayName = "SlideViewer";

export default SlideViewer;
