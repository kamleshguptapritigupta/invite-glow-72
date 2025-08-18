import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import MediaPreview from "./MediaPreview";
import MediaSettings from "./MediaSettings";
import { MediaItem } from "@/types/greeting";

interface MediaItemCardProps {
  item: MediaItem;
  index: number;
  media: MediaItem[];
  active: boolean;
  setActive: (index: number | null) => void;
  updateMedia: (index: number, field: keyof MediaItem, value: any) => void;
  removeMedia: (index: number) => void;
  moveMediaPriority: (index: number, direction: "up" | "down") => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  isDragging: boolean;
  dragIndex: number | null;
}

const MediaItemCard: React.FC<MediaItemCardProps> = ({
  item,
  index,
  active,
  media,
  setActive,
  updateMedia,
  removeMedia,
  moveMediaPriority,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  isDragging,
  dragIndex,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Card
      id={`media-item-${index}`}
      className={`p-3 relative transition-all border ${
        active ? "border-pink-500 shadow-md" : "border-pink-200 hover:border-pink-300"
      } ${isDragging && dragIndex === index ? "opacity-50" : ""}`}
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragEnd={handleDragEnd}
    >
      {/* Toolbar */}
      <div className="absolute bg-white/90 right-3 flex gap-1 z-10 rounded-xl shadow-xl">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => moveMediaPriority(index, "up")}
                disabled={item.priority === 1}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move Up</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => moveMediaPriority(index, "down")}
                disabled={false} // no hard block, sorted in parent
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move Down</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-red-500"
                onClick={() => removeMedia(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* URL Input */}
      <Input
        type="url"
        placeholder={`Enter ${item.type} URL`}
        value={item.url}
        onChange={(e) => updateMedia(index, "url", e.target.value)}
        onFocus={() => setActive(index)}
        className="text-sm break-all overflow-hidden text-ellipsis whitespace-nowrap"
      />
<br/>
      {/* Preview */}
      <MediaPreview item={item} />

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-3">
          <MediaSettings item={item} index={index} updateMedia={updateMedia} />
        </div>
      )}
    </Card>
  );
};

export default MediaItemCard;
