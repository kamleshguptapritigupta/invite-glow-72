import { Separator } from '@/components/ui/separator';
import { BorderSettings } from '@/types/background';
import BackgroundCustomizer from './BackgroundCustomizer';
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