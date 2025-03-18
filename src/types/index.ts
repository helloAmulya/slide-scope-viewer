
export interface DetectionResult {
  bbox: number[];
  score: number;
  class_id: number;
  class_name: string;
}

export interface OutputData {
  image_path: string;
  detection_results: DetectionResult[];
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  detectionIndex: number;
}
