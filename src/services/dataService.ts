
import { OutputJson, OutputData, Dataset } from "@/types";

export const loadJsonFile = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading JSON file:", error);
    throw error;
  }
};

// Parse the output.json format into the expected app format
export const parseOutputJson = (json: OutputJson, imagePath: string): OutputData => {
  const detectionResults = [];
  
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
            class_id: index, 
          });
        }
      }
    });
  }
  
  return {
    image_path: imagePath,
    detection_results: detectionResults
  };
};

export const getDefaultImagePath = (dataset: OutputJson): string => {

  return `/lovable-uploads/WSImage.png`;
};
