import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Image, Video } from "lucide-react";
import { MediaItem } from "@/types/greeting";
import { cn } from '@/lib/utils';

interface MediaHeaderProps {
  media: MediaItem[];
  maxItems: number;
  addMedia: (type: "image" | "video") => void;
  usagePercentage: number;
}

const MediaHeader = ({ media, maxItems, addMedia, usagePercentage }: MediaHeaderProps) => {
  return (
    <div className="p-6">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <Image className="h-4 w-4 text-purple-500" />
            <Video className="h-3 w-3 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
          </div>
          <span className="text-sm font-medium truncate">Media Content</span>
          <Badge
            className={`shrink-0 ml-1 ${
              media.length === maxItems
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }`}
          >
            {media.length}/{maxItems}
          </Badge>
        </div>

        <div className="flex gap-2 justify-end xs:justify-normal">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => addMedia("image")}
                  disabled={media.length >= maxItems}
                  size="sm"
                  variant={
                    media.length >= maxItems ? "outline" : 
                    media.length === 0 ? "default" : "outline"
                  }
                  className={cn(
                          "gap-1 min-w-[100px] transition-all duration-300 font-medium animate",
                          media.length === 0 ? "h-8 w-8 p-0" : media.length >= maxItems ? "h-8 px-3 bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"
                        )}
                >
                  <Image className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {media.length > 0 ? "Add More Image" : "Add Image"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {media.length >= maxItems
                  ? "Maximum media limit reached"
                  : media.length > 0
                  ? "Add another image"
                  : "Add first image"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => addMedia("video")}
                  disabled={media.length >= maxItems}
                  size="sm"
                  variant={
                    media.length >= maxItems ? "outline" : 
                    media.length === 0 ? "default" : "outline"
                  }
                  className={cn(
                          "gap-1 min-w-[100px] transition-all duration-300 font-medium animate",
                          media.length === 0 ? "h-8 w-8 p-0" : media.length >= maxItems ? "h-8 px-3 bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"
                        )}
                >
                  <Video className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {media.length > 0 ? "Add More Video" : "Add Video"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {media.length >= maxItems
                  ? "Maximum media limit reached"
                  : media.length > 0
                  ? "Add another video"
                  : "Add first video"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mt-3">
        <Progress value={usagePercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>
            {media.length > 0
              ? `${media.length} item${media.length !== 1 ? "s" : ""} added`
              : "No media added yet"}
          </span>
          {media.length >= maxItems && (
            <span className="text-destructive">Limit reached</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaHeader;
