
import { useState, useEffect } from "react";
import SlideViewer from "@/components/SlideViewer";
import FindingsPanel from "@/components/FindingsPanel";
import { OutputData, Finding } from "@/types";
import { toast } from "sonner";

// Sample slide image - will be replaced with actual data
const placeholderImageUrl = "/lovable-uploads/c18bce35-d835-4bae-bf53-a4118b246e61.png";

// Sample data for initial testing
const sampleData: OutputData = {
  image_path: placeholderImageUrl,
  detection_results: [
    {
      bbox: [100, 100, 150, 150],
      score: 0.95,
      class_id: 0,
      class_name: "abnormal cell"
    },
    {
      bbox: [400, 300, 100, 100],
      score: 0.87,
      class_id: 1,
      class_name: "normal cell"
    }
  ]
};

// Generate sample findings based on detection results
const generateFindings = (data: OutputData): Finding[] => {
  return data.detection_results.map((detection, index) => ({
    id: `finding-${index}`,
    title: `${detection.class_name} (${(detection.score * 100).toFixed(0)}%)`,
    description: `Detection score: ${detection.score.toFixed(2)}. This ${detection.class_name} was detected with high confidence.`,
    detectionIndex: index
  }));
};

const Index = () => {
  const [data, setData] = useState<OutputData>(sampleData);
  const [findings, setFindings] = useState<Finding[]>(generateFindings(sampleData));
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // In a real application, you would fetch the output.json file
  // and update the state with the fetched data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // For now, we'll use the sample data
        // In production, you would fetch from an API or file
        // const response = await fetch('/output.json');
        // const data = await response.json();
        
        setData(sampleData);
        const generatedFindings = generateFindings(sampleData);
        setFindings(generatedFindings);
        
        // Set the first finding as active
        if (generatedFindings.length > 0) {
          setActiveFindingId(generatedFindings[0].id);
        }
        
        setIsLoading(false);
        toast.success("Slide image loaded successfully");
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
        toast.error("Failed to load slide data");
      }
    };
    
    fetchData();
  }, []);

  const handleSelectFinding = (findingId: string) => {
    setActiveFindingId(findingId);
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen w-full overflow-hidden bg-white">
      {/* Left panel - Findings */}
      <FindingsPanel 
        findings={findings} 
        activeFindingId={activeFindingId} 
        onSelectFinding={handleSelectFinding} 
      />
      
      {/* Main content - Slide viewer */}
      <SlideViewer 
        imageUrl={data.image_path} 
        detections={data.detection_results}
        activeFindingId={activeFindingId}
        findings={findings}
      />
    </div>
  );
};

export default Index;
