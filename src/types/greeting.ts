import { BorderSettings } from '@/types/background';

export interface EventType {
  value: string;
  label: string;
  emoji: string;
  defaultMessage: string;
  theme: string;
  backgroundImage?: string;
  category: 'birthday' | 'religious' | 'national' | 'seasonal' | 'personal' | 'special' | 'custom';
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  position: {
    width: number;
    height: number;
  };
  animation: string;
  priority: number;
  fileType?: string; // Add this for better video handling

}

export interface TextContent {
  id: string;
  content: string;
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
  animation: string;
}

export interface GreetingFormData {
  eventType: string;
  customEventName?: string;
  customEventEmoji?: string;
  senderName: string;
  receiverName: string;
  texts: TextContent[];
  media: MediaItem[];
  videoUrl: string;
  videoPosition: {
    width: number;
    height: number;
  };
  animationStyle: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'stack' | 'collage' | 'mosaic' | 'slideshow' | 'polaroid' | 'magazine';
  theme: string;
  backgroundSettings: {
    color: string;
    gradient: {
      enabled: boolean;
      colors: [string, string];
      direction: string;
    };
    animation: {
      enabled: boolean;
      type: string;
      speed: number;
      intensity: number;
    };
    pattern: {
      enabled: boolean;
      type: string;
      opacity: number;
    };
  };
  emojis: {
    id: string;
    emoji: string;
    position: { x: number; y: number };
    size: number;
    animation: string;
  }[];
  borderSettings: BorderSettings;
}