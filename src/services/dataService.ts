
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

// Function to load a JSON file from the public folder
export const loadJsonFromPublic = async (filename: string): Promise<any> => {
  try {
    // Ensure the path starts with a slash
    const publicPath = filename.startsWith('/') ? filename : `/${filename}`;
    const response = await fetch(publicPath);
    if (!response.ok) {
      throw new Error(`Failed to load JSON from public folder: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading JSON file "${filename}" from public folder:`, error);
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
  // If the dataset includes a filename that looks like an image path, use that
  if (dataset.filename && 
     (dataset.filename.endsWith('.png') || 
      dataset.filename.endsWith('.jpg') || 
      dataset.filename.endsWith('.jpeg') || 
      dataset.filename.endsWith('.webp'))) {
    // Check if it's in public folder
    return `/public/${dataset.filename}`;
  }
  
  // Default fallback
  return `/lovable-uploads/c18bce35-d835-4bae-bf53-a4118b246e61.png`;
};

// Load the default output.json from public folder
export const loadDefaultOutputJson = async (): Promise<OutputJson | null> => {
  try {
    return await loadJsonFromPublic('output.json');
  } catch (error) {
    console.error("Failed to load default output.json:", error);
    return null;
  }
};
