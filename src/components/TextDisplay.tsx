import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Sparkles } from "lucide-react";

interface TextDisplayProps {
  title: string;
  content: string;
  isLoading?: boolean;
  type?: "extracted" | "suggestions";
}

export function TextDisplay({ title, content, isLoading, type = "extracted" }: TextDisplayProps) {
  const Icon = type === "suggestions" ? Sparkles : FileText;
  
  return (
    <Card className="h-full animate-scale-in shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="rounded-md bg-primary/10 p-1.5">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[500px] w-full rounded-md border border-border bg-card p-4 transition-colors">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                  <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10" />
                </div>
                <p className="animate-pulse text-sm font-medium text-muted-foreground">
                  Processing...
                </p>
              </div>
            </div>
          ) : content ? (
            <div className="animate-fade-in whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {content}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-3 inline-block rounded-full bg-muted p-3">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {type === "suggestions" 
                    ? "Analysis results will appear here" 
                    : "Extracted text will appear here"}
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
