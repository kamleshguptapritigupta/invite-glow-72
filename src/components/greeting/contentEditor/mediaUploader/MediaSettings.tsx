import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaItem } from "@/types/greeting";

interface MediaSettingsProps {
  item: MediaItem;
  index: number;
  updateMedia: (index: number, field: keyof MediaItem, value: any) => void;
}

const MediaSettings: React.FC<MediaSettingsProps> = ({ item, index, updateMedia }) => {
  return (
    <div className="space-y-3 p-3 rounded-md border border-pink-200">
      {/* Size Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Width (px)</Label>
          <Input
            type="number"
             min={50}  // optional lower bound
             max={500} // enforce max width
            value={item.position.width}
            onChange={(e) =>
              updateMedia(index, "position", { width: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Height (px)</Label>
          <Input
            type="number"
             min={40}  // optional lower bound
             max={400} // enforce max width
            value={item.position.height}
            onChange={(e) =>
              updateMedia(index, "position", { height: Number(e.target.value) })
            }
          />
        </div>
      </div>
<div className="grid grid-cols-2 gap-3">
      {/* Animation Select */}
      <div>
        <Label>Animation</Label>
        <Select
          value={item.animation || "fade"}
          onValueChange={(val) => updateMedia(index, "animation", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="zoom">Zoom</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div>
        <Label>Priority</Label>
        <Input
          type="number"
          value={item.priority}
          onChange={(e) => updateMedia(index, "priority", Number(e.target.value))}
        />
      </div>
      </div>
    </div>
  );
}; 

export default MediaSettings;
