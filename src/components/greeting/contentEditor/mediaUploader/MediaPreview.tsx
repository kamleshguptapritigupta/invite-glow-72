// src/components/preview/MediaPreview.tsx
import React from "react";
import { MediaItem } from "@/types/greeting";
import { validateUrl, getEmbedCode } from "./mediaUtils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MediaPreviewProps {
  item: MediaItem;
  // width/height override (in px). If omitted, use item.position values.
  width?: number | string;
  height?: number | string;
  frameClass?: string; // optional frame className to be applied on wrapper
  animation?: "fade" | "zoom" | "slide" | "bounce" | "none"; // animation type
}

const MAX_WIDTH = 500;
const MAX_HEIGHT = 400;

const numericToPx = (v: number | string | undefined, max?: number) => {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${max ? Math.min(v, max) : v}px`;
  const num = parseInt(v, 10);
  if (!isNaN(num) && max) return `${Math.min(num, max)}px`;
  return v;
};

// Animation variants
const animationVariants: Record<string, any> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
  },
  zoom: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  },
  slide: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  },
  bounce: {
    initial: { y: -30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 10 },
    },
  },
  none: { initial: {}, animate: {} },
};

const MediaPreview: React.FC<MediaPreviewProps> = ({
  item,
  width,
  height,
  frameClass,
  animation = "fade",
}) => {
  const w = numericToPx(width ?? item.position?.width, MAX_WIDTH);
  const h = numericToPx(height ?? item.position?.height, MAX_HEIGHT);

  const Wrapper = motion.div;

  // if no url yet, show small placeholder card but sized properly
  if (!item.url) {
    return (
      <Wrapper
        initial="initial"
        animate="animate"
        variants={animationVariants[animation]}
        style={{
          width: w ?? "100%",
          height: h ?? "auto",
          maxWidth: `${MAX_WIDTH}px`,
          maxHeight: `${MAX_HEIGHT}px`,
        }}
        className={`${frameClass ?? ""} rounded-md overflow-hidden`}
      >
        <Card className="p-3 bg-gray-50 text-gray-400 text-sm w-full h-full flex items-center justify-center">
          No {item.type} URL entered yet
        </Card>
      </Wrapper>
    );
  }

  const valid = validateUrl(item.url);
  if (!valid) {
    return (
      <Wrapper
        initial="initial"
        animate="animate"
        variants={animationVariants[animation]}
        style={{
          width: w ?? "100%",
          height: h ?? "auto",
          maxWidth: `${MAX_WIDTH}px`,
          maxHeight: `${MAX_HEIGHT}px`,
        }}
        className={`${frameClass ?? ""} rounded-md overflow-hidden`}
      >
        <Card className="p-3 bg-red-50 text-red-500 text-sm w-full h-full flex items-center justify-center">
          Invalid URL
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      initial="initial"
      animate="animate"
      variants={animationVariants[animation]}
      style={{
        width: w ?? "100%",
        height: h ?? "auto",
        maxWidth: `${MAX_WIDTH}px`,
        maxHeight: `${MAX_HEIGHT}px`,
      }}
      className={`${frameClass ?? ""} rounded-md overflow-hidden`}
    >
      {item.type === "image" && (
        <img
          src={item.url}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => {
            /* let parent handle errors */
          }}
        />
      )}

      {item.type === "video" && item.url.includes("youtube") && (
        <div
          dangerouslySetInnerHTML={{ __html: getEmbedCode(item.url) }}
          className="w-full h-full"
          style={{ minHeight: h ?? undefined }}
        />
      )}

      {item.type === "video" && !item.url.includes("youtube") && (
        <video
          src={item.url}
          controls
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />
      )}
    </Wrapper>
  );
};

export default MediaPreview;
