import { Separator } from '@/components/ui/separator';
import { TextContent, MediaItem } from '@/types/greeting';
import AdvancedTextEditor from './textEditor/AdvancedTextEditor';
import AdvancedMediaUploader from './mediaUploader/AdvancedMediaUploader';
import EmojiSelector from './EmojiSelector';

interface ContentFormProps {
  texts: TextContent[];
  media: MediaItem[];
  emojis: { id: string; emoji: string; position: { x: number; y: number }; size: number; animation: string; }[];
  onTextChange: (texts: TextContent[]) => void;
  onMediaChange: (media: MediaItem[]) => void;
  onEmojiChange: (emojis: any[]) => void;
}

const ContentForm = ({
  texts,
  media,
  emojis,
  onTextChange,
  onMediaChange,
  onEmojiChange
}: ContentFormProps) => {
  return (
    <>
      {/* Advanced Text Editor */}
      <AdvancedTextEditor
        texts={texts}
        onChange={onTextChange}
      />

      <Separator />

      {/* Advanced Media Uploader */}
      <AdvancedMediaUploader
        media={media}
        onChange={onMediaChange}
      />

      <Separator />

      {/* Emoji Decorator */}
      <EmojiSelector
        emojis={emojis}
        onChange={onEmojiChange}
      />
    </>
  );
};

export default ContentForm;