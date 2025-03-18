
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dataset } from "@/types";
import { FileUp } from "lucide-react";

interface DatasetSelectorProps {
  datasets: Dataset[];
  activeDatasetId: string | null;
  onSelectDataset: (datasetId: string) => void;
  onLoadFile: (file: File) => Promise<void>;
}

const DatasetSelector = ({
  datasets,
  activeDatasetId,
  onSelectDataset,
  onLoadFile
}: DatasetSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    try {
      await onLoadFile(file);
    } finally {
      setIsLoading(false);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
      <Select
        value={activeDatasetId || undefined}
        onValueChange={onSelectDataset}
        disabled={isLoading}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select dataset" />
        </SelectTrigger>
        <SelectContent>
          {datasets.map(dataset => (
            <SelectItem key={dataset.id} value={dataset.id}>
              {dataset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon"
          disabled={isLoading}
          className="relative"
        >
          <FileUp size={18} />
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isLoading}
          />
        </Button>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetSelector;
