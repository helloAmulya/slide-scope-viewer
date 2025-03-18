
import { useState, useEffect } from "react";
import SlideViewer from "@/components/SlideViewer";
import FindingsPanel from "@/components/FindingsPanel";
import { OutputData, Finding, OutputJson, DetectionResult } from "@/types";
import { toast } from "sonner";

// Sample slide image - will be replaced with actual data
const placeholderImageUrl = "/lovable-uploads/c18bce35-d835-4bae-bf53-a4118b246e61.png";

// Sample output.json data
const sampleOutputJson: OutputJson = {
  "id": 19,
  "patient_id": "7",
  "wsi_video_url": "None",
  "inference_results": {
    "delayTime": 950,
    "executionTime": 7223,
    "id": "sync-e1323ad4-a299-4159-9342-1fa220a3c2b5-e1",
    "output": {
      "detection_results": [
        [
          121,
          4,
          163,
          45,
          "Circular_RBC"
        ],[
          520,
          0,
          563,
          24,
          "Circular_RBC"
        ]
      ]
    },
    "status": "COMPLETED",
    "workerId": "vgfqxs1imv8aym"
  },
  "celery_status": "completed",
  "filename": "7_20241209_024613.png",
  "sample_type": "blood",
  "date": "2024-12-09"
};

// Function to parse the output.json format into the expected app format
const parseOutputJson = (json: OutputJson): OutputData => {
  const detectionResults: DetectionResult[] = [];
  
  if (json.inference_results?.output?.detection_results) {
    json.inference_results.output.detection_results.forEach((detection, index) => {
      if (Array.isArray(detection) && detection.length >= 5) {
        const [x, y, x2, y2, className] = detection;
        
        if (typeof x === 'number' && typeof y === 'number' && 
            typeof x2 === 'number' && typeof y2 === 'number' && 
            typeof className === 'string') {
          
          // Convert from [x1, y1, x2, y2] to [x, y, width, height]
          const width = x2 - x;
          const height = y2 - y;
          
          detectionResults.push({
            bbox: [x, y, width, height],
            class_name: className,
            class_id: index, // Using index as class_id for color mapping
          });
        }
      }
    });
  }
  
  return {
    image_path: placeholderImageUrl, // Use the placeholder for now
    detection_results: detectionResults
  };
};

// Generate findings based on detection results
const generateFindings = (data: OutputData): Finding[] => {
  return data.detection_results.map((detection, index) => ({
    id: `finding-${index}`,
    title: `${detection.class_name}`,
    description: `${detection.class_name} detected at coordinates X:${detection.bbox[0]}, Y:${detection.bbox[1]}`,
    detectionIndex: index
  }));
};

const Index = () => {
  const [data, setData] = useState<OutputData>({ image_path: placeholderImageUrl, detection_results: [] });
  const [findings, setFindings] = useState<Finding[]>([]);
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const processData = () => {
      try {
        setIsLoading(true);
        
        // Parse the sample output.json
        const parsedData = parseOutputJson(sampleOutputJson);
        setData(parsedData);
        
        // Generate findings based on the parsed data
        const generatedFindings = generateFindings(parsedData);
        setFindings(generatedFindings);
        
        // Set the first finding as active if there are any
        if (generatedFindings.length > 0) {
          setActiveFindingId(generatedFindings[0].id);
        }
        
        setIsLoading(false);
        toast.success("Slide image loaded successfully");
      } catch (error) {
        console.error("Error processing data:", error);
        setIsLoading(false);
        toast.error("Failed to process slide data");
      }
    };
    
    processData();
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
