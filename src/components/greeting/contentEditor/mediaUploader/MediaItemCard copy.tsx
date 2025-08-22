// src/components/media/MediaItemCard.tsx
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import MediaPreview from "./MediaPreview";
import MediaSettings from "./MediaSettings";
import { MediaItem } from "@/types/greeting";
import { frameStyles as globalFrameStyles } from "@/components/preview/MediaFrames";

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
  // optional prop to pass chosen frame style key (string)
  frameStyleKey?: string;
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
  frameStyleKey,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  // compute frame class from key if provided
  const frameClass = useMemo(() => {
    if (frameStyleKey && globalFrameStyles[frameStyleKey]) {
      return globalFrameStyles[frameStyleKey].className;
    }
    return "";
  }, [frameStyleKey]);

  return (
    <Card
      id={`media-item-${index}`}
      className={`p-3 relative transition-all border ${active ? "border-pink-500 shadow-md" : "border-pink-200 hover:border-pink-300"} ${isDragging && dragIndex === index ? "opacity-50" : ""}`}
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragEnd={handleDragEnd}
    >
      {/* Toolbar */}
      <div className="absolute bg-white/90 right-3 flex gap-0 sm:gap-1 z-10 rounded-xl shadow-xl">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2"
                onClick={() => moveMediaPriority(index, "up")}
                disabled={item.priority === 1}
                aria-label="Move up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Move Up</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2" onClick={() => moveMediaPriority(index, "down")} aria-label="Move down">
                <ArrowDown className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Move Down</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2" onClick={() => setShowSettings((s) => !s)} aria-label="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 text-red-500" onClick={() => removeMedia(index)} aria-label="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
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

      <div className="mt-3 flex justify-center">
        {/* Pass explicit width/height and frameClass to MediaPreview */}
        <MediaPreview
          item={item}
          width={item.position?.width}
          height={item.position?.height}
          frameClass={frameClass}
        />
      </div>

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
