
import { useState, useEffect } from "react";
import SlideViewer from "@/components/SlideViewer";
import FindingsPanel from "@/components/FindingsPanel";
import DatasetSelector from "@/components/DatasetSelector";
import { OutputData, Finding, OutputJson, Dataset } from "@/types";
import { toast } from "sonner";
import { loadJsonFile, parseOutputJson, getDefaultImagePath } from "@/services/dataService";
import { v4 as uuidv4 } from "uuid";

// const sampleOutputJson: OutputJson = {
//   "id": 19,
//   "patient_id": "7",
//   "wsi_video_url": "None",
//   "inference_results": {
//     "delayTime": 950,
//     "executionTime": 7223,
//     "id": "sync-e1323ad4-a299-4159-9342-1fa220a3c2b5-e1",
//     "output": {
//       "detection_results": [
//         [
//           121,
//           4,
//           163,
//           45,
//           "Circular_RBC"
//         ],[
//           520,
//           0,
//           563,
//           24,
//           "Circular_RBC"
//         ]
//       ]
//     },
//     "status": "COMPLETED",
//     "workerId": "vgfqxs1imv8aym"
//   },
//   "celery_status": "completed",
//   "filename": "7_20241209_024613.png",
//   "sample_type": "blood",
//   "date": "2024-12-09"
// };
// const sampleOutputJson: OutputJson = {
//   "id": 19,
//   "patient_id": "7",
//   "wsi_video_url": "None",
//   "inference_results": {
//     "delayTime": 950,
//     "executionTime": 7223,
//     "id": "sync-e1323ad4-a299-4159-9342-1fa220a3c2b5-e1",
//     "output": {
//       "detection_results": [
//         [
//           121,
//           4,
//           163,
//           45,
//           "Circular_RBC"
//         ],
//         [
//           396,
//           312,
//           433,
//           353,
//           "Circular_RBC"
//         ],
//         [
//           388,
//           90,
//           428,
//           130,
//           "Circular_RBC"
//         ],
//         [
//           334,
//           157,
//           373,
//           199,
//           "Circular_RBC"
//         ],
//         [
//           27,
//           148,
//           64,
//           190,
//           "Circular_RBC"
//         ],
//         [
//           89,
//           339,
//           131,
//           380,
//           "Circular_RBC"
//         ],
//         [
//           346,
//           222,
//           381,
//           265,
//           "Circular_RBC"
//         ],
//         [
//           455,
//           24,
//           491,
//           66,
//           "Circular_RBC"
//         ],
//         [
//           222,
//           437,
//           262,
//           475,
//           "Circular_RBC"
//         ],
//         [
//           126,
//           41,
//           163,
//           79,
//           "Circular_RBC"
//         ],
//         [
//           250,
//           152,
//           288,
//           189,
//           "Circular_RBC"
//         ],
//         [
//           177,
//           75,
//           214,
//           114,
//           "Circular_RBC"
//         ],
//         [
//           157,
//           446,
//           196,
//           484,
//           "Circular_RBC"
//         ],
//         [
//           12,
//           310,
//           56,
//           346,
//           "Circular_RBC"
//         ],
//         [
//           404,
//           195,
//           441,
//           237,
//           "Circular_RBC"
//         ],
//         [
//           464,
//           135,
//           499,
//           171,
//           "Circular_RBC"
//         ],
      
//         [
//           520,
//           0,
//           563,
//           24,
//           "Circular_RBC"
//         ]
//       ]
//     },
//     "status": "COMPLETED",
//     "workerId": "vgfqxs1imv8aym"
//   },
//   "celery_status": "completed",
//   "filename": "WSImage.png",
//   "sample_type": "blood",
//   "date": "2024-12-09"
// }
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
        ],
        [
          396,
          312,
          433,
          353,
          "Circular_RBC"
        ],
        [
          388,
          90,
          428,
          130,
          "Circular_RBC"
        ],
        [
          334,
          157,
          373,
          199,
          "Circular_RBC"
        ],
        [
          27,
          148,
          64,
          190,
          "Circular_RBC"
        ],
        [
          89,
          339,
          131,
          380,
          "Circular_RBC"
        ],
        [
          346,
          222,
          381,
          265,
          "Circular_RBC"
        ],
        [
          455,
          24,
          491,
          66,
          "Circular_RBC"
        ],
        [
          250,
          374,
          287,
          412,
          "Circular_RBC"
        ],
        [
          30,
          350,
          67,
          392,
          "Circular_RBC"
        ],
        [
          256,
          285,
          293,
          324,
          "Circular_RBC"
        ],
        [
          118,
          316,
          158,
          354,
          "Circular_RBC"
        ],
        [
          155,
          311,
          189,
          350,
          "Circular_RBC"
        ],
        [
          0,
          270,
          37,
          307,
          "Circular_RBC"
        ],
        [
          248,
          409,
          285,
          448,
          "Circular_RBC"
        ],
        [
          77,
          271,
          113,
          307,
          "Circular_RBC"
        ],
        [
          222,
          437,
          262,
          475,
          "Circular_RBC"
        ],
        [
          126,
          41,
          163,
          79,
          "Circular_RBC"
        ],
        [
          250,
          152,
          288,
          189,
          "Circular_RBC"
        ],
        [
          177,
          75,
          214,
          114,
          "Circular_RBC"
        ],
        [
          157,
          446,
          196,
          484,
          "Circular_RBC"
        ],
        [
          12,
          310,
          56,
          346,
          "Circular_RBC"
        ],
        [
          404,
          195,
          441,
          237,
          "Circular_RBC"
        ],
        [
          464,
          135,
          499,
          171,
          "Circular_RBC"
        ],
        [
          314,
          355,
          352,
          396,
          "Circular_RBC"
        ],
        [
          211,
          401,
          247,
          440,
          "Circular_RBC"
        ],
        [
          55,
          190,
          94,
          229,
          "Circular_RBC"
        ],
        [
          110,
          87,
          148,
          121,
          "Circular_RBC"
        ],
        [
          456,
          364,
          496,
          400,
          "Circular_RBC"
        ],
        [
          466,
          296,
          505,
          342,
          "Circular_RBC"
        ],
        [
          205,
          195,
          249,
          234,
          "Circular_RBC"
        ],
        [
          287,
          8,
          324,
          48,
          "Circular_RBC"
        ],
        [
          315,
          128,
          344,
          170,
          "Circular_RBC"
        ],
        [
          372,
          206,
          410,
          245,
          "Circular_RBC"
        ],
        [
          414,
          41,
          451,
          76,
          "Circular_RBC"
        ],
        [
          103,
          118,
          142,
          156,
          "Circular_RBC"
        ],
        [
          59,
          447,
          95,
          487,
          "Circular_RBC"
        ],
        [
          241,
          98,
          275,
          140,
          "Circular_RBC"
        ],
        [
          419,
          256,
          455,
          296,
          "Circular_RBC"
        ],
        [
          122,
          435,
          160,
          473,
          "Circular_RBC"
        ],
        [
          76,
          122,
          108,
          162,
          "Circular_RBC"
        ],
        [
          155,
          130,
          193,
          166,
          "Circular_RBC"
        ],
        [
          93,
          55,
          131,
          90,
          "Circular_RBC"
        ],
        [
          111,
          245,
          152,
          274,
          "Circular_RBC"
        ],
        [
          291,
          433,
          326,
          473,
          "Circular_RBC"
        ],
        [
          258,
          344,
          298,
          377,
          "Circular_RBC"
        ],
        [
          141,
          156,
          177,
          194,
          "Circular_RBC"
        ],
        [
          210,
          341,
          244,
          382,
          "Circular_RBC"
        ],
        [
          58,
          92,
          97,
          126,
          "Circular_RBC"
        ],
        [
          391,
          246,
          427,
          289,
          "Circular_RBC"
        ],
        [
          418,
          126,
          454,
          164,
          "Circular_RBC"
        ],
        [
          69,
          243,
          106,
          273,
          "Circular_RBC"
        ],
        [
          465,
          169,
          503,
          205,
          "Circular_RBC"
        ],
        [
          193,
          290,
          232,
          323,
          "Circular_RBC"
        ],
        [
          161,
          41,
          198,
          77,
          "Circular_RBC"
        ],
        [
          290,
          390,
          318,
          434,
          "Circular_RBC"
        ],
        [
          382,
          359,
          419,
          394,
          "Circular_RBC"
        ],
        [
          459,
          203,
          496,
          237,
          "Circular_RBC"
        ],
        [
          175,
          380,
          211,
          413,
          "Circular_RBC"
        ],
        [
          289,
          284,
          329,
          318,
          "Circular_RBC"
        ],
        [
          271,
          126,
          306,
          158,
          "Circular_RBC"
        ],
        [
          0,
          148,
          30,
          187,
          "Circular_RBC"
        ],
        [
          174,
          0,
          209,
          37,
          "Circular_RBC"
        ],
        [
          131,
          272,
          166,
          304,
          "Circular_RBC"
        ],
        [
          27,
          204,
          61,
          239,
          "Circular_RBC"
        ],
        [
          251,
          249,
          288,
          283,
          "Circular_RBC"
        ],
        [
          46,
          272,
          82,
          310,
          "Circular_RBC"
        ],
        [
          380,
          458,
          418,
          490,
          "Circular_RBC"
        ],
        [
          402,
          10,
          440,
          43,
          "Circular_RBC"
        ],
        [
          187,
          479,
          223,
          511,
          "Circular_RBC"
        ],
        [
          0,
          339,
          35,
          378,
          "Circular_RBC"
        ],
        [
          354,
          432,
          393,
          465,
          "Circular_RBC"
        ],
        [
          252,
          214,
          288,
          252,
          "Circular_RBC"
        ],
        [
          428,
          379,
          465,
          419,
          "Circular_RBC"
        ],
        [
          142,
          407,
          176,
          442,
          "Circular_RBC"
        ],
        [
          470,
          259,
          505,
          292,
          "Circular_RBC"
        ],
        [
          437,
          202,
          462,
          235,
          "Circular_RBC"
        ],
        [
          39,
          62,
          93,
          93,
          "Circular_RBC"
        ],
        [
          106,
          155,
          144,
          184,
          "Circular_RBC"
        ],
        [
          453,
          101,
          490,
          138,
          "Circular_RBC"
        ],
        [
          354,
          87,
          389,
          125,
          "Circular_RBC"
        ],
        [
          388,
          125,
          424,
          167,
          "Circular_RBC"
        ],
        [
          292,
          257,
          327,
          289,
          "Circular_RBC"
        ],
        [
          317,
          221,
          350,
          260,
          "Circular_RBC"
        ],
        [
          351,
          335,
          389,
          376,
          "Circular_RBC"
        ],
        [
          30,
          389,
          65,
          422,
          "Circular_RBC"
        ],
        [
          166,
          200,
          202,
          234,
          "Circular_RBC"
        ],
        [
          187,
          316,
          223,
          350,
          "Circular_RBC"
        ],
        [
          51,
          411,
          85,
          448,
          "Circular_RBC"
        ],
        [
          349,
          268,
          384,
          300,
          "Circular_RBC"
        ],
        [
          444,
          72,
          479,
          108,
          "Circular_RBC"
        ],
        [
          369,
          293,
          400,
          329,
          "Circular_RBC"
        ],
        [
          501,
          175,
          512,
          223,
          "Circular_RBC"
        ],
        [
          441,
          166,
          470,
          204,
          "Circular_RBC"
        ],
        [
          221,
          29,
          258,
          63,
          "Circular_RBC"
        ],
        [
          309,
          306,
          343,
          340,
          "Circular_RBC"
        ],
        [
          361,
          40,
          395,
          77,
          "Circular_RBC"
        ],
        [
          73,
          0,
          120,
          22,
          "Circular_RBC"
        ],
        [
          10,
          94,
          49,
          134,
          "Circular_RBC"
        ],
        [
          430,
          295,
          468,
          328,
          "Circular_RBC"
        ],
        [
          202,
          2,
          234,
          39,
          "Circular_RBC"
        ],
        [
          327,
          32,
          365,
          64,
          "Circular_RBC"
        ],
        [
          39,
          32,
          79,
          65,
          "Circular_RBC"
        ],
        [
          430,
          0,
          473,
          17,
          "Circular_RBC"
        ],
        [
          59,
          485,
          94,
          512,
          "Circular_RBC"
        ],
        [
          149,
          227,
          188,
          253,
          "Circular_RBC"
        ],
        [
          341,
          473,
          378,
          508,
          "Circular_RBC"
        ],
      
        [
          707,
          15,
          744,
          53,
          "Circular_RBC"
        ],
        [
          959,
          34,
          998,
          66,
          "Circular_RBC"
        ],
        [
          714,
          85,
          753,
          118,
          "Circular_RBC"
        ],
        [
          891,
          320,
          930,
          355,
          "Circular_RBC"
        ],
        [
          686,
          153,
          725,
          188,
          "Circular_RBC"
        ],
        [
          522,
          410,
          564,
          444,
          "Circular_RBC"
        ],
        [
          979,
          424,
          1016,
          462,
          "Circular_RBC"
        ],
        
        [
          925,
          374,
          958,
          409,
          "Circular_RBC"
        ],
        [
          967,
          0,
          1013,
          11,
          "Circular_RBC"
        ],
        [
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
  "filename": "WSImage.png",
  "sample_type": "blood",
  "date": "2024-12-09"
}

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
