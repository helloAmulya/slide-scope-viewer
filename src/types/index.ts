
export interface DetectionResult {
  bbox: number[];
  score?: number;
  class_id?: number;
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
  datasetId?: string; // Added to identify which dataset a finding belongs to
}

export interface OutputJson {
  id: number;
  patient_id: string;
  wsi_video_url: string;
  inference_results: {
    delayTime: number;
    executionTime: number;
    id: string;
    output: {
      detection_results: (number | string)[][];
    };
    status: string;
    workerId: string;
  };
  celery_status: string;
  filename: string;
  sample_type: string;
  date: string;
}

// New type for managing multiple datasets
export interface Dataset {
  id: string;
  name: string;
  data: OutputJson;
  parsedData?: OutputData;
}
