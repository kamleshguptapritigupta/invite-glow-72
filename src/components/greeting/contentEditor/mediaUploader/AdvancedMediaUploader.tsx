import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem } from "@/types/greeting";
import { motion, AnimatePresence } from "framer-motion";
import MediaHeader from "./MediaHeader";
import EmptyMediaState from "./EmptyMediaState";
import MediaList from "./MediaList";

interface AdvancedMediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxItems?: number;
}

const MAX_ITEMS = 20;

const AdvancedMediaUploader = ({
  media,
  onChange,
  maxItems = MAX_ITEMS,
}: AdvancedMediaUploaderProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeMediaIndex !== null && activeMediaIndex >= media.length) {
      setActiveMediaIndex(null);
    }
  }, [media.length, activeMediaIndex]);

  // --- Media Handlers ---
  const addMedia = (type: "image" | "video") => {
    if (media.length >= maxItems) return;

    const newMedia: MediaItem = {
      id: Date.now().toString(),
      url: "",
      type,
      position: { width: 300, height: 200 },
      animation: "fade",
      priority: media.length + 1,
    };

    const updatedMedia = [...media, newMedia];
    onChange(updatedMedia);
    setActiveMediaIndex(updatedMedia.length - 1);

    setTimeout(() => {
      document
        .getElementById(`media-item-${updatedMedia.length - 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
    if (activeMediaIndex === index) {
      setActiveMediaIndex(null);
    } else if (activeMediaIndex !== null && activeMediaIndex > index) {
      setActiveMediaIndex(activeMediaIndex - 1);
    }
  };

  const updateMedia = (index: number, field: keyof MediaItem, value: any) => {
    const newMedia = [...media];
    if (field === "position") {
      newMedia[index] = {
        ...newMedia[index],
        position: { ...newMedia[index].position, ...value },
      };
    } else {
      newMedia[index] = { ...newMedia[index], [field]: value };
    }
    onChange(newMedia);
  };

  const moveMediaPriority = (index: number, direction: "up" | "down") => {
    const newMedia = [...media];
    const currentPriority = newMedia[index].priority;
    const targetPriority =
      direction === "up" ? currentPriority - 1 : currentPriority + 1;
    const targetIndex = newMedia.findIndex(
      (m) => m.priority === targetPriority
    );
    if (targetIndex !== -1) {
      newMedia[index].priority = targetPriority;
      newMedia[targetIndex].priority = currentPriority;
      newMedia.sort((a, b) => a.priority - b.priority);
      onChange(newMedia);
    }
  };

  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newMedia = [...media];
    const draggedItem = newMedia[dragIndex];
    newMedia.splice(dragIndex, 1);
    newMedia.splice(index, 0, draggedItem);

    newMedia.forEach((item, idx) => (item.priority = idx + 1));
    onChange(newMedia);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const usagePercentage = Math.round((media.length / maxItems) * 100);

  return (
    <Card className="border border-pink-300 shadow-lg">
      <MediaHeader
        media={media}
        maxItems={maxItems}
        addMedia={addMedia}
        usagePercentage={usagePercentage}
      />
      <CardContent className="space-y-3">
        {media.length === 0 ? (
          <EmptyMediaState addMedia={addMedia} />
        ) : (
          <MediaList
            media={media}
            activeMediaIndex={activeMediaIndex}
            setActiveMediaIndex={setActiveMediaIndex}
            removeMedia={removeMedia}
            updateMedia={updateMedia}
            moveMediaPriority={moveMediaPriority}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            dragIndex={dragIndex}
            isDragging={isDragging}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedMediaUploader;
