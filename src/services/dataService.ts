
import { OutputJson, OutputData, Dataset } from "@/types";

// Function to load JSON file from a URL
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
            class_id: index, // Using index as class_id for color mapping
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

// Get default image path for a dataset
export const getDefaultImagePath = (dataset: OutputJson): string => {
  // You could implement logic to determine image path based on dataset properties
  // For now using a placeholder
  return `/lovable-uploads/c18bce35-d835-4bae-bf53-a4118b246e61.png`;
};
