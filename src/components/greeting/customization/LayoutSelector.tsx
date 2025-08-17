import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { layoutStyles, animationStyles } from '@/data/eventTypes';

interface LayoutSelectorProps {
  layout: string;
  animationStyle: string;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
}

const LayoutSelector = ({ 
  layout, 
  animationStyle, 
  onLayoutChange, 
  onAnimationChange 
}: LayoutSelectorProps) => {
  const layoutDescriptions = {
    grid: 'Organized in a clean grid pattern',
    masonry: 'Pinterest-style staggered layout',
    carousel: 'Horizontal scrolling showcase',
    stack: 'Layered card design',
    collage: 'Artistic scattered arrangement'
  };

  return (
    <Card>
      <CardContent className="border border-orange-300 rounded-xl shadow-lg space-y-4 pt-6">
        <div>
          <Label htmlFor="layout">Photo Layout Design</Label>
          <Select value={layout} onValueChange={onLayoutChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose layout style" />
            </SelectTrigger>
            <SelectContent>
              {layoutStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div>
                    <div>{style.label}</div> 
                    {/* className="flex justify-start" */}
                    <div className="text-xs text-muted-foreground">
                      {layoutDescriptions[style.value as keyof typeof layoutDescriptions]}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="animation">Global Animation Style</Label>
          <Select value={animationStyle} onValueChange={onAnimationChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {animationStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutSelector;