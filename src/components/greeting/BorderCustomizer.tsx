import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Frame, Plus, Trash2, Square } from 'lucide-react';
import { BorderSettings, BorderElement } from '@/types/background';
import { cn } from '@/lib/utils';

interface BorderCustomizerProps {
  settings: BorderSettings;
  onChange: (settings: BorderSettings) => void;
}

const normalizeColorValue = (color: string) => {
  if (color.startsWith('hsl(var(')) {
    const varName = color.match(/var\(([^)]+)\)/)?.[1];
    if (varName) {
      const computedValue = getComputedStyle(document.documentElement)
        .getPropertyValue(varName.trim());
      return computedValue || '#ffffff';
    }
    return '#ffffff';
  }
  return color;
};

const BorderCustomizer = ({ settings, onChange }: BorderCustomizerProps) => {
  const [internalSettings, setInternalSettings] = useState<BorderSettings>({
    ...settings,
    decorativeElements: Array.isArray(settings.decorativeElements) 
      ? settings.decorativeElements 
      : [],
    color: normalizeColorValue(settings.color || '#000000')
  });

  // Sync with parent settings
  useEffect(() => {
    setInternalSettings({
      ...settings,
      decorativeElements: Array.isArray(settings.decorativeElements) 
        ? settings.decorativeElements 
        : [],
      color: normalizeColorValue(settings.color || '#000000')
    });
  }, [settings]);

  const updateSettings = (field: keyof BorderSettings, value: any) => {
    const newSettings = {
      ...internalSettings,
      [field]: value
    };
    setInternalSettings(newSettings);
    onChange(newSettings);
  };

  const addBorderElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (internalSettings.decorativeElements.length >= 5) return;
    
    const newElement: BorderElement = {
      id: Date.now().toString(),
      type: 'emoji',
      content: '⭐',
      position: Math.random() * 100,
      size: 24,
      animation: 'float'
    };
    
    const newElements = [...internalSettings.decorativeElements, newElement];
    updateSettings('decorativeElements', newElements);
  };

  const removeBorderElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newElements = internalSettings.decorativeElements.filter(el => el.id !== id);
    updateSettings('decorativeElements', newElements);
  };

  const updateBorderElement = (id: string, field: keyof BorderElement, value: any) => {
    const updatedElements = internalSettings.decorativeElements.map(el =>
      el.id === id ? { ...el, [field]: value } : el
    );
    updateSettings('decorativeElements', updatedElements);
  };

  console.log('Current border elements:', internalSettings.decorativeElements);

  return (
    <Card className="border border-gray-300 rounded-xl shadow-lg">
      <CardHeader >
         <div className="flex items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Frame className="h-4 w-4 text-purple-500" />
          Border Customization
        </CardTitle>
        <Switch
            checked={internalSettings.enabled}
            onCheckedChange={(enabled) => updateSettings('enabled', enabled)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">

        {internalSettings.enabled && (
          <>
            <div className="space-y-3">
              <Label>Border Style</Label>
              <Select
                value={internalSettings.style}
                onValueChange={(style) => updateSettings('style', style)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Border Width ({internalSettings.width}px)</Label>
              <Slider
                value={[internalSettings.width]}
                onValueChange={([width]) => updateSettings('width', width)}
                min={1}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <Label>Border Color</Label>
              <Input
                type="color"
                value={internalSettings.color}
                onChange={(e) => updateSettings('color', e.target.value)}
                className="w-full h-10"
              />
            </div>

            <div className="space-y-3">
    <div className="flex items-center justify-between">
  <Label className="flex items-center gap-2">
    <Square className="h-4 w-4 text-primary" />
    <span className="text-sm font-medium">
      Border Elements
      <span className={cn(
        "ml-2 px-2 py-1 rounded-full text-xs",
        internalSettings.decorativeElements.length === 5 
          ? "bg-destructive/10 text-destructive" 
          : "bg-primary/10 text-primary"
      )}>
        {internalSettings.decorativeElements.length}/5
      </span>
    </span>
  </Label>

  <Button
    onClick={addBorderElement}
    disabled={internalSettings.decorativeElements.length >= 5}
    size="sm"
    variant="outline"
    className={cn(
      "transition-all duration-300",
      internalSettings.decorativeElements.length === 0 
        ? "h-8 w-8 p-0"  // Makes it a circular icon button when empty
        : "h-8 px-3"     // Regular size when has text
    )}
  >
    {internalSettings.decorativeElements.length === 0 ? (
      <Plus className="h-4 w-4" />
    ) : internalSettings.decorativeElements.length >= 5 ? (
      <span className="text-destructive">Limit Reached</span>
    ) : (
      <span className="flex items-center gap-1">
        <Plus className="h-3 w-3" />
        Add More
      </span>
    )}
  </Button>
</div>
              
              {internalSettings.decorativeElements.map((element) => (
                <div 
                  key={element.id} 
                  className="border rounded p-3 space-y-2 hover:bg-gray-50 transition-colors"
                  onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                >
                  <div className="flex items-center justify-between">
                    <Select
                      value={element.type}
                      onValueChange={(type) => updateBorderElement(element.id, 'type', type)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emoji">Emoji</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => removeBorderElement(element.id, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Input
                    value={element.content}
                    onChange={(e) => updateBorderElement(element.id, 'content', e.target.value)}
                    placeholder={element.type === 'emoji' ? 'Enter emoji' : 'Enter image URL'}
                    className="text-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BorderCustomizer;