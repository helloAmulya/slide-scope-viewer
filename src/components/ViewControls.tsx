
import { ZoomIn, ZoomOut, Home, Move, Crosshair } from "lucide-react";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ViewControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
  maxScale: number;
  minScale: number;
}

const ViewControls = memo(({ 
  onZoomIn, 
  onZoomOut, 
  onReset,
  scale,
  maxScale,
  minScale
}: ViewControlsProps) => {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 animate-fade-in">
      <div className="bg-white border border-viewer-border rounded-full p-1 shadow-elevation">
        <div className="flex flex-col">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onZoomIn}
                  className="control-btn"
                  disabled={scale >= maxScale}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={20} className={scale >= maxScale ? "text-gray-300" : ""} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom in</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-px w-full bg-viewer-border my-1"></div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onZoomOut}
                  className="control-btn"
                  disabled={scale <= minScale}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={20} className={scale <= minScale ? "text-gray-300" : ""} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onReset}
              className="control-btn"
              aria-label="Reset view"
            >
              <Home size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

ViewControls.displayName = "ViewControls";

export default ViewControls;
