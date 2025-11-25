import { Card, CardContent } from "@/components/ui/card";
import { FileText, Link2, Hash, Type } from "lucide-react";

interface ContentStatsProps {
  text: string;
}

interface Stats {
  wordCount: number;
  linkCount: number;
  hashtagCount: number;
  characterCount: number;
  hashtags: string[];
  links: string[];
}

function analyzeContent(text: string): Stats {
  if (!text || text.trim() === "") {
    return {
      wordCount: 0,
      linkCount: 0,
      hashtagCount: 0,
      characterCount: 0,
      hashtags: [],
      links: []
    };
  }

  // Count words (split by whitespace and filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Count characters (excluding whitespace)
  const characterCount = text.replace(/\s/g, "").length;

  // Extract hashtags
  const hashtagRegex = /#[\w]+/g;
  const hashtags = text.match(hashtagRegex) || [];
  const hashtagCount = hashtags.length;

  // Extract links (http, https, www)
  const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  const links = text.match(linkRegex) || [];
  const linkCount = links.length;

  return {
    wordCount,
    linkCount,
    hashtagCount,
    characterCount,
    hashtags: [...new Set(hashtags)], // Remove duplicates
    links: [...new Set(links)] // Remove duplicates
  };
}

export function ContentStats({ text }: ContentStatsProps) {
  const stats = analyzeContent(text);

  const statItems = [
    {
      icon: Type,
      label: "Words",
      value: stats.wordCount,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: FileText,
      label: "Characters",
      value: stats.characterCount,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Hash,
      label: "Hashtags",
      value: stats.hashtagCount,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Link2,
      label: "Links",
      value: stats.linkCount,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div className="animate-slide-up space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${item.bgColor} p-2.5`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(stats.hashtags.length > 0 || stats.links.length > 0) && (
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="space-y-4">
              {stats.hashtags.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Hash className="h-4 w-4 text-purple-500" />
                    Hashtags Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {stats.links.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Link2 className="h-4 w-4 text-orange-500" />
                    Links Found
                  </h3>
                  <div className="space-y-1">
                    {stats.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.startsWith("http") ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm text-orange-600 hover:underline dark:text-orange-400"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}