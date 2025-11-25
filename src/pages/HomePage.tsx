import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { TextDisplay } from "@/components/TextDisplay";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { extractTextFromImage, extractTextFromPDF, analyzeSocialMediaContent } from "@/services/llmService";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setExtractedText("");
    setSuggestions("");
    setIsExtracting(true);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          const base64Content = base64Data.split(",")[1];

          let text = "";
          
          if (file.type === "application/pdf") {
            text = await extractTextFromPDF(base64Content);
          } else if (file.type.startsWith("image/")) {
            text = await extractTextFromImage(base64Content, file.type);
          }

          setExtractedText(text);
          
          toast({
            title: "Success",
            description: "Text extracted successfully!",
          });
        } catch (error) {
          console.error("Extraction error:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to extract text",
            variant: "destructive",
          });
        } finally {
          setIsExtracting(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        });
        setIsExtracting(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading error:", error);
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim()) {
      toast({
        title: "No Text",
        description: "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setSuggestions("");

    try {
      const analysis = await analyzeSocialMediaContent(extractedText);
      setSuggestions(analysis);
      
      toast({
        title: "Success",
        description: "Analysis complete!",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedText("");
    setSuggestions("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="mb-3 text-4xl font-bold">
            <span className="gradient-text">Social Media Content Analyzer</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your document and get AI-powered suggestions to boost engagement ✨
          </p>
        </div>

        <div className="mb-6">
          <FileUpload 
            onFileSelect={handleFileSelect} 
            isProcessing={isExtracting} 
          />
        </div>

        {selectedFile && (
          <div className="mb-6 animate-slide-up">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="animate-scale-in rounded-md bg-primary/10 p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || isExtracting || !extractedText}
                  className="gap-2 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Content
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isAnalyzing || isExtracting}
                  className="gap-2 transition-all duration-300 hover:scale-105"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <TextDisplay
            title="Extracted Text"
            content={extractedText}
            isLoading={isExtracting}
            type="extracted"
          />
          <TextDisplay
            title="Improvement Suggestions"
            content={suggestions}
            isLoading={isAnalyzing}
            type="suggestions"
          />
        </div>
      </div>
    </div>
  );
}
