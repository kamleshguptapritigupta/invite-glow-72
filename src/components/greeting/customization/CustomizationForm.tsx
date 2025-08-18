import { Separator } from '@/components/ui/separator';
import { BorderSettings } from '@/types/background';
import BackgroundCustomizer from './BackgroundCustomizer/BackgroundCustomizer';
import BorderCustomizer from './BorderCustomizer/BorderCustomizer';
import LayoutSelector from './LayoutSelector';

interface CustomizationFormProps {
  backgroundSettings: any;
  borderSettings: BorderSettings;
  layout: string;
  animationStyle: string;
  onBackgroundChange: (settings: any) => void;
  onBorderChange: (settings: BorderSettings) => void;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
}

const CustomizationForm = ({
  backgroundSettings,
  borderSettings,
  layout,
  animationStyle,
  onBackgroundChange,
  onBorderChange,
  onLayoutChange,
  onAnimationChange
}: CustomizationFormProps) => {
  return (
    <>
      {/* Background Customizer */}
      <BackgroundCustomizer
        settings={backgroundSettings}
        onChange={onBackgroundChange}
      />

      <Separator />

      {/* Border Customizer */}
      <BorderCustomizer
        settings={borderSettings}
        onChange={onBorderChange} 
      />

      <Separator />

      {/* Layout & Animation Selector */}
      <LayoutSelector
        layout={layout}
        animationStyle={animationStyle}
        onLayoutChange={onLayoutChange}
        onAnimationChange={onAnimationChange}
      />
    </>
  );
};

export default CustomizationForm;


export interface BorderSettingsExtended {
  // keep original field names for compatibility but add new fields
  enabled: boolean;
  styleEnabled?: boolean;
  elementsEnabled?: boolean;
  style: string;
  width: number;

  // original color is kept for backward compatibility; primaryColor mirrors it
  color?: string; // original field (may be used by other files)
  primaryColor?: string; // new preferred name — use color if not supplied
  secondaryColor?: string;
  gradientMode?: boolean;
  gradientValue?: string;

  radius?: number;
  decorativeElements: BorderElementExtended[];
  elementGlobal?: ElementGlobalSettings;
}

export interface BorderElementExtended {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  position: number;
  size: number;
  animation: 'float' | 'rotate-cw' | 'rotate-ccw' | 'blink' | 'pop' | 'travel';
  rotateSpeed?: number;
  travelSpeed?: number;
}

export interface ElementGlobalSettings {
  rotateDirection?: 'clockwise' | 'anticlockwise' | 'both';
  travelEnabled?: boolean;
  travelSpeed?: number;
}