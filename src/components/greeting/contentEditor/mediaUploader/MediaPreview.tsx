import { Card } from "@/components/ui/card";
import { validateUrl, getEmbedCode } from "./mediaUtils";
import { MediaItem } from "@/types/greeting";

interface MediaPreviewProps {
  item: MediaItem;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ item }) => {
  if (!item.url) {
    return (
      <Card className="p-3 bg-gray-50 text-gray-400 text-sm">
        No {item.type} URL entered yet
      </Card>
    );
  }

  const valid = validateUrl(item.url);
  if (!valid) {
    return (
      <Card className="p-3 bg-red-50 text-red-500 text-sm">
        Invalid URL
      </Card>
    );
  }

  return (
    <div className="relative">
      {item.type === "image" ? (
        <img
          src={item.url}
          alt="Preview"
          className="rounded-md max-h-48 object-cover w-full"
        />
      ) : item.type === "video" && item.url.includes("youtube") ? (
        <div
          dangerouslySetInnerHTML={{ __html: getEmbedCode(item.url) }}
          className="w-full rounded-md max-h-48 object-cover  aspect-video"
        />
      ) : item.type === "video" ? (
        <video
          src={item.url}
          controls
          className="rounded-md max-h-48 object-cover w-full"
        />
      ) : null}
    </div>
  );
};

export default MediaPreview;
