import { useCallback, useState } from "react";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [onFileSelect]
  );

  const validateAndSelectFile = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    const validExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert("Invalid file type. Please upload a PDF, JPG, or PNG file.");
      return;
    }

    onFileSelect(file);
  };

  return (
    <Card className="w-full animate-slide-up shadow-lg transition-shadow hover:shadow-xl">
      <CardContent className="p-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-all duration-300",
            isDragging
              ? "scale-105 border-primary bg-accent shadow-lg"
              : "border-border bg-card hover:border-primary hover:bg-accent hover:scale-[1.02]",
            isProcessing && "pointer-events-none opacity-50"
          )}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn(
              "rounded-full bg-primary/10 p-4 transition-all duration-300",
              isDragging ? "scale-110 bg-primary/20" : "hover:scale-105"
            )}>
              <Upload className={cn(
                "h-8 w-8 text-primary transition-transform duration-300",
                isDragging && "animate-float"
              )} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground transition-colors">
                {isDragging ? "Drop your file here" : "Upload Document"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 transition-colors hover:bg-muted/80">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 transition-colors hover:bg-muted/80">
                <ImageIcon className="h-4 w-4" />
                <span>JPG, PNG</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
