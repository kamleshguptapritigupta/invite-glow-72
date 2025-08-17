import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Palette, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BackgroundSettings } from '@/types/background';

interface BackgroundCustomizerProps {
  settings: BackgroundSettings;
  onChange: (settings: BackgroundSettings) => void;
}

const BackgroundCustomizer = ({ settings, onChange }: BackgroundCustomizerProps) => {
  const [isExpanded, setIsExpanded] = useState(settings.enabled);

  const updateSettings = (field: keyof BackgroundSettings, value: any) => {
    if (typeof settings[field] === 'object' && settings[field] !== null) {
      onChange({ ...settings, [field]: { ...settings[field] as object, ...value } });
    } else {
      onChange({ ...settings, [field]: value });
    }
  };

  const animationTypes = [
    { value: 'stars', label: '✨ Twinkling Stars' },
    { value: 'sparkles', label: '🌟 Floating Sparkles' },
    { value: 'particles', label: '🔵 Particle Rain' },
    { value: 'bubbles', label: '🫧 Rising Bubbles' },
    { value: 'snow', label: '❄️ Falling Snow' },
    { value: 'hearts', label: '💕 Floating Hearts' },
    { value: 'confetti', label: '🎊 Confetti Drop' },
    { value: 'fireworks', label: '🎆 Fireworks' }
  ];

  const gradientDirections = [
    { value: 'to right', label: 'Left to Right' },
    { value: 'to left', label: 'Right to Left' },
    { value: 'to bottom', label: 'Top to Bottom' },
    { value: 'to top', label: 'Bottom to Top' },
    { value: 'to bottom right', label: 'Diagonal ↘' },
    { value: 'to bottom left', label: 'Diagonal ↙' },
    { value: 'to top right', label: 'Diagonal ↗' },
    { value: 'to top left', label: 'Diagonal ↖' }
  ];

  const patternTypes = [
    { value: 'dots', label: 'Polka Dots' },
    { value: 'grid', label: 'Grid Lines' },
    { value: 'diagonal', label: 'Diagonal Lines' },
    { value: 'waves', label: 'Wave Pattern' },
    { value: 'hexagon', label: 'Hexagon' },
    { value: 'circles', label: 'Circles' }
  ];

  const toggleEnabled = (enabled: boolean) => {
    updateSettings('enabled', enabled);
    setIsExpanded(enabled);
  };

  return (
    <Card className="border border-orange-300 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4 text-purple-500" />
            Background Customization
          </CardTitle>
          <Switch
            checked={settings.enabled}
            onCheckedChange={toggleEnabled}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 space-y-6">
          {/* Basic Color */}
          <div className="space-y-3">
            <Label>Base Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.color}
                onChange={(e) => updateSettings('color', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <Input
                value={settings.color}
                onChange={(e) => updateSettings('color', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          {/* Gradient Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Gradient Background</Label>
              <Switch
                checked={settings.gradient.enabled}
                onCheckedChange={(enabled) => updateSettings('gradient', { enabled })}
              />
            </div>
            
            {settings.gradient.enabled && (
              <div className="space-y-3 ml-4 pl-4 border-l-2 border-purple-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.gradient.colors[0]}
                        onChange={(e) => updateSettings('gradient', { 
                          colors: [e.target.value, settings.gradient.colors[1]] 
                        })}
                        className="w-10 h-10 rounded-lg"
                      />
                      <Input
                        value={settings.gradient.colors[0]}
                        onChange={(e) => updateSettings('gradient', { 
                          colors: [e.target.value, settings.gradient.colors[1]] 
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.gradient.colors[1]}
                        onChange={(e) => updateSettings('gradient', { 
                          colors: [settings.gradient.colors[0], e.target.value] 
                        })}
                        className="w-10 h-10 rounded-lg"
                      />
                      <Input
                        value={settings.gradient.colors[1]}
                        onChange={(e) => updateSettings('gradient', { 
                          colors: [settings.gradient.colors[0], e.target.value] 
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Direction</Label>
                  <Select
                    value={settings.gradient.direction}
                    onValueChange={(direction) => updateSettings('gradient', { direction })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientDirections.map((dir) => (
                        <SelectItem key={dir.value} value={dir.value}>
                          {dir.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Animation Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Background Animation
              </Label>
              <Switch
                checked={settings.animation.enabled}
                onCheckedChange={(enabled) => updateSettings('animation', { enabled })}
              />
            </div>
            
            {settings.animation.enabled && (
              <div className="space-y-3 ml-4 pl-4 border-l-2 border-purple-100">
                <div>
                  <Label className="text-xs">Animation Type</Label>
                  <Select
                    value={settings.animation.type}
                    onValueChange={(type) => updateSettings('animation', { type })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationTypes.map((anim) => (
                        <SelectItem key={anim.value} value={anim.value}>
                          {anim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs">Speed ({settings.animation.speed}s)</Label>
                  <Slider
                    value={[settings.animation.speed]}
                    onValueChange={([speed]) => updateSettings('animation', { speed })}
                    min={0.5}
                    max={10}
                    step={0.5}
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Intensity ({settings.animation.intensity}%)</Label>
                  <Slider
                    value={[settings.animation.intensity]}
                    onValueChange={([intensity]) => updateSettings('animation', { intensity })}
                    min={10}
                    max={200}
                    step={10}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pattern Overlay */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Pattern Overlay</Label>
              <Switch
                checked={settings.pattern.enabled}
                onCheckedChange={(enabled) => updateSettings('pattern', { enabled })}
              />
            </div>
            
            {settings.pattern.enabled && (
              <div className="space-y-3 ml-4 pl-4 border-l-2 border-purple-100">
                <div>
                  <Label className="text-xs">Pattern Type</Label>
                  <Select
                    value={settings.pattern.type}
                    onValueChange={(type) => updateSettings('pattern', { type })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {patternTypes.map((pattern) => (
                        <SelectItem key={pattern.value} value={pattern.value}>
                          {pattern.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs">Opacity ({settings.pattern.opacity}%)</Label>
                  <Slider
                    value={[settings.pattern.opacity]}
                    onValueChange={([opacity]) => updateSettings('pattern', { opacity })}
                    min={5}
                    max={80}
                    step={5}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Background Preview</Label>
            <div 
              className="w-full h-24 rounded-lg border-2 border-dashed border-border relative overflow-hidden"
              style={{
                background: settings.gradient.enabled 
                  ? `linear-gradient(${settings.gradient.direction}, ${settings.gradient.colors[0]}, ${settings.gradient.colors[1]})`
                  : settings.color
              }}
            >
              {(settings.animation.enabled || settings.pattern.enabled) && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/90 bg-black/10">
                  {settings.animation.enabled && (
                    <span>{animationTypes.find(a => a.value === settings.animation.type)?.label}</span>
                  )}
                  {settings.animation.enabled && settings.pattern.enabled && ' + '}
                  {settings.pattern.enabled && (
                    <span>{patternTypes.find(p => p.value === settings.pattern.type)?.label}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BackgroundCustomizer;