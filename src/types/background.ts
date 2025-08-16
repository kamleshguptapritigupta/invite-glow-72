export interface BackgroundSettings {
  enabled?: boolean;
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
}

export interface EmojiItem {
  id: string;
  emoji: string;
  position: { x: number; y: number };
  size: number;
  animation: string;
}

export interface BorderSettings {
  enabled: boolean;
  style: string;
  width: number;
  color: string;
  radius: number;
  animation: { enabled: boolean; type: string; speed: number };
  elements: any[];
  decorativeElements: BorderElement[];
}

export interface BorderElement {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  position: number;
  size: number;
  animation: string;
}