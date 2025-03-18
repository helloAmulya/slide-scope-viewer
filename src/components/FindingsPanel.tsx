
import { useEffect, useRef, memo } from "react";
import { Finding } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface FindingsPanelProps {
  findings: Finding[];
  activeFindingId: string | null;
  onSelectFinding: (findingId: string) => void;
}

const FindingsPanel = memo(({ 
  findings, 
  activeFindingId, 
  onSelectFinding 
}: FindingsPanelProps) => {
  const activeItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeFindingId && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeFindingId]);

  return (
    <div className="findings-panel w-full h-full animate-slide-up">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-1 tracking-tight">Artigence AI</h2>
        <p className="text-sm text-muted-foreground mb-4">Blood Sample Analysis</p>
        <Separator className="mb-6" />
        <h3 className="text-lg font-medium mb-4">Findings ({findings.length})</h3>
      </div>
      
      <ScrollArea className="h-[calc(100%-200px)]">
        <div className="pb-4">
          {findings.map((finding) => (
            <div
              key={finding.id}
              ref={finding.id === activeFindingId ? activeItemRef : null}
              className={`findings-item p-4 mx-4 mb-3 rounded-md transition-all cursor-pointer hover:bg-gray-100 ${
                finding.id === activeFindingId ? 'bg-gray-100 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => onSelectFinding(finding.id)}
            >
              <h4 className="font-medium mb-1">{finding.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{finding.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

FindingsPanel.displayName = "FindingsPanel";

export default FindingsPanel;
