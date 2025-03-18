
import { useState, useEffect } from "react";
import SlideViewer from "@/components/SlideViewer";
import FindingsPanel from "@/components/FindingsPanel";
import DatasetSelector from "@/components/DatasetSelector";
import { OutputData, Finding, OutputJson, Dataset } from "@/types";
import { toast } from "sonner";
import { loadJsonFile, parseOutputJson, getDefaultImagePath } from "@/services/dataService";
import { v4 as uuidv4 } from "uuid";

// Sample data for initial state
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

// Generate findings based on detection results
const generateFindings = (data: OutputData, datasetId: string): Finding[] => {
  return data.detection_results.map((detection, index) => ({
    id: `finding-${index}-${datasetId}`,
    title: `${detection.class_name}`,
    description: `${detection.class_name} detected at coordinates X:${detection.bbox[0]}, Y:${detection.bbox[1]}`,
    detectionIndex: index,
    datasetId: datasetId
  }));
};

const Index = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null);
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Create dataset with sample data
        const datasetId = uuidv4();
        const imagePath = getDefaultImagePath(sampleOutputJson);
        const parsedData = parseOutputJson(sampleOutputJson, imagePath);
        
        const newDataset: Dataset = {
          id: datasetId,
          name: `Sample - ${sampleOutputJson.filename}`,
          data: sampleOutputJson,
          parsedData: parsedData
        };
        
        setDatasets([newDataset]);
        setActiveDatasetId(datasetId);
        
        // Set the first finding as active if there are any
        const findings = generateFindings(parsedData, datasetId);
        if (findings.length > 0) {
          setActiveFindingId(findings[0].id);
        }
        
        setIsLoading(false);
        toast.success("Sample data loaded successfully");
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsLoading(false);
        toast.error("Failed to initialize data");
      }
    };
    
    initializeData();
  }, []);

  // Handle loading a JSON file
  const handleLoadFile = async (file: File) => {
    try {
      // Read the file content
      const text = await file.text();
      const jsonData = JSON.parse(text) as OutputJson;
      
      // Create a new dataset
      const datasetId = uuidv4();
      const imagePath = getDefaultImagePath(jsonData);
      const parsedData = parseOutputJson(jsonData, imagePath);
      
      const newDataset: Dataset = {
        id: datasetId,
        name: jsonData.filename || `Dataset ${datasets.length + 1}`,
        data: jsonData,
        parsedData: parsedData
      };
      
      // Add the new dataset to the list and select it
      setDatasets(prev => [...prev, newDataset]);
      setActiveDatasetId(datasetId);
      
      // Set the first finding as active if there are any
      const findings = generateFindings(parsedData, datasetId);
      if (findings.length > 0) {
        setActiveFindingId(findings[0].id);
      }
      
      toast.success(`Loaded dataset: ${newDataset.name}`);
    } catch (error) {
      console.error("Error loading JSON file:", error);
      toast.error("Invalid JSON file format");
    }
  };

  // Get the active dataset and its data
  const activeDataset = activeDatasetId 
    ? datasets.find(d => d.id === activeDatasetId) 
    : null;
  
  const activeData = activeDataset?.parsedData || { 
    image_path: "", 
    detection_results: [] 
  };
  
  // Generate findings for the active dataset
  const findings = activeDataset?.parsedData 
    ? generateFindings(activeDataset.parsedData, activeDataset.id) 
    : [];

  const handleSelectDataset = (datasetId: string) => {
    setActiveDatasetId(datasetId);
    
    // Update active finding for the new dataset
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset?.parsedData) {
      const datasetFindings = generateFindings(dataset.parsedData, datasetId);
      if (datasetFindings.length > 0) {
        setActiveFindingId(datasetFindings[0].id);
      } else {
        setActiveFindingId(null);
      }
    }
  };

  const handleSelectFinding = (findingId: string) => {
    setActiveFindingId(findingId);
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen w-full overflow-hidden bg-white">
      {/* Left panel - Findings */}
      <div className="flex flex-col h-full border-r">
        <FindingsPanel 
          findings={findings} 
          activeFindingId={activeFindingId} 
          onSelectFinding={handleSelectFinding} 
        />
        
        <div className="mt-auto border-t p-2">
          <DatasetSelector 
            datasets={datasets}
            activeDatasetId={activeDatasetId}
            onSelectDataset={handleSelectDataset}
            onLoadFile={handleLoadFile}
          />
        </div>
      </div>
      
      {/* Main content - Slide viewer */}
      <SlideViewer 
        imageUrl={activeData.image_path} 
        detections={activeData.detection_results}
        activeFindingId={activeFindingId}
        findings={findings}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-foreground font-medium">Loading data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
