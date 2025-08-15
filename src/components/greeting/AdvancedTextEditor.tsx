
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Type, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { TextContent } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';
import { cn } from '@/lib/utils';

interface AdvancedTextEditorProps {
  texts: TextContent[];
  onChange: (texts: TextContent[]) => void;
}

const MAX_TEXT_LIMIT = 10;

const AdvancedTextEditor = ({ texts, onChange }: AdvancedTextEditorProps) => {
  const [activeTextIndex, setActiveTextIndex] = useState<number | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);

  useEffect(() => {
    if (texts.length === 1) {
      setActiveTextIndex(0);
    }
  }, [texts.length]);

  const addText = () => {
    if (texts.length >= MAX_TEXT_LIMIT) return;
    setIsAddingText(true);
    setTimeout(() => {
      const newText: TextContent = {
        id: Date.now().toString(),
        content: '',
        style: {
          fontSize: '18px',
          fontWeight: 'normal',
          color: 'hsl(var(--foreground))',
          textAlign: 'center'
        },
        animation: 'fade'
      };
      onChange([...texts, newText]);
      setActiveTextIndex(texts.length);
      setIsAddingText(false);
    }, 150);
  };

  const removeText = (index: number) => {
    const newTexts = texts.filter((_, i) => i !== index);
    onChange(newTexts);
    if (activeTextIndex === index) setActiveTextIndex(null);
  };

  const updateText = (index: number, field: keyof TextContent, value: any) => {
    const newTexts = [...texts];
    if (field === 'style') {
      newTexts[index] = {
        ...newTexts[index],
        [field]: { ...newTexts[index][field], ...value }
      };
    } else {
      newTexts[index] = { ...newTexts[index], [field]: value };
    }
    onChange(newTexts);
  };

  const moveText = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === texts.length - 1)
    ) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newTexts = [...texts];
    [newTexts[index], newTexts[newIndex]] = [newTexts[newIndex], newTexts[index]];
    onChange(newTexts);
    setActiveTextIndex(newIndex);
  };

  // Combined options from both versions
  const fontSizes = [
    { value: '12px', label: 'Small (12px)' },
    { value: '14px', label: 'Regular (14px)' },
    { value: '16px', label: 'Medium (16px)' },
    { value: '18px', label: 'Large (18px)' },
    { value: '20px', label: 'X-Large (20px)' },
    { value: '24px', label: 'XX-Large (24px)' },
    { value: '28px', label: 'XX-Large (28px)' },
    { value: '32px', label: 'XXX-Large (32px)' },
    { value: '36px', label: 'XXX-Large (36px)' },
    { value: '48px', label: 'Huge (48px)' }
  ];

  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '100', label: 'Thin (100)' },
    { value: '200', label: 'Extra Light (200)' },
    { value: '300', label: 'Light (300)' },
    { value: '400', label: 'Regular (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'Semi Bold (600)' },
    { value: '700', label: 'Bold (700)' },
    { value: '800', label: 'Extra Bold (800)' },
    { value: '900', label: 'Black (900)' }
  ];

  const colors = [
    { value: 'hsl(var(--foreground))', label: 'Default' },
    { value: 'hsl(var(--primary))', label: 'Primary' },
    { value: 'hsl(var(--secondary))', label: 'Secondary' },
    { value: 'hsl(var(--muted-foreground))', label: 'Muted' },
    { value: 'hsl(0 0% 100%)', label: 'White' },
    { value: 'hsl(0 0% 0%)', label: 'Black' },
    { value: 'hsl(0 70% 50%)', label: 'Red' },
    { value: 'hsl(120 60% 40%)', label: 'Green' },
    { value: 'hsl(220 90% 50%)', label: 'Blue' },
    { value: 'hsl(45 90% 50%)', label: 'Yellow' }
  ];

  const textAligns = ['left', 'center', 'right'] as const;

  return (
    <Card className="border border-yellow-300 shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Text Content 
              <span className={cn(
                "ml-2 px-2 py-1 rounded-full text-xs",
                texts.length === MAX_TEXT_LIMIT ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              )}>
                {texts.length}/{MAX_TEXT_LIMIT}
              </span>
            </span>
          </CardTitle>
          <Button
            onClick={addText}
            disabled={texts.length >= MAX_TEXT_LIMIT}
            size="sm"
            variant='outline'
            className={cn(
              "transition-all duration-300",
              texts.length === 0 ? "gap-2" : "gap-1",
              isAddingText && "animate-pulse"
            )}
          >
            <Plus className={cn(
              "h-3 w-3 transition-transform",
              isAddingText && "rotate-90"
            )} />
            {texts.length === 0 ? (
              <span>Add First Text</span>
            ) : texts.length >= MAX_TEXT_LIMIT ? (
              <span className="text-destructive">Limit Reached</span>
            ) : (
              <span>Add More Text</span>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {texts.length === 0 && (
          <div className="text-center py-8 rounded-lg bg-muted/30 animate-in fade-in">
            <div className="flex flex-col items-center justify-center">
              <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground mb-3">No text content added yet</p>
              <Button onClick={addText} variant="outline" size="sm" className="bg-primary/10 text-primary gap-2">
                <Sparkles className="h-3 w-3" />
                Start Adding Text
              </Button>
            </div>
          </div>
        )}

        {texts.map((text, index) => (
          <div key={text.id} className="relative transition-all duration-300 animate-in fade-in">
            <Card className={cn(
              "border overflow-hidden transition-all",
              activeTextIndex === index ? "border-primary/50 shadow-sm" : "border-transparent hover:border-border"
            )}>
              <CardHeader className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium flex items-center gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs">
                      {index + 1}
                    </span>
                    Text Block
                  </Label>
                  <div className="flex gap-1">
                    <Button onClick={() => moveText(index, 'up')} size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={index === 0}>
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button onClick={() => moveText(index, 'down')} size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={index === texts.length - 1}>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button onClick={() => setActiveTextIndex(activeTextIndex === index ? null : index)} size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      {activeTextIndex === index ? 'Hide' : 'Edit'}
                    </Button>
                    <Button onClick={() => removeText(index)} size="sm" variant="ghost" className="h-6 px-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                <Textarea
                  value={text.content}
                  onChange={(e) => updateText(index, 'content', e.target.value)}
                  placeholder="Enter your message here..."
                  rows={2}
                  className="text-sm min-h-[80px]"
                />

                {activeTextIndex === index && (
                  <div className="space-y-3 border-t pt-3 animate-in fade-in">
                    {/* Preview section from Version 1 */}
                    {text.content && (
                      <div className="p-3 border rounded">
                        <Label className="text-xs text-muted-foreground">Preview:</Label>
                        <div
                          style={{
                            fontSize: text.style.fontSize,
                            fontWeight: text.style.fontWeight,
                            color: text.style.color,
                            textAlign: text.style.textAlign
                          }}
                          className="mt-1"
                        >
                          {text.content}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">Font Size</Label>
                        <Select
                          value={text.style.fontSize}
                          onValueChange={(value) => updateText(index, 'style', { fontSize: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontSizes.map((size) => (
                              <SelectItem key={size.value} value={size.value} className="text-xs">
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Font Weight</Label>
                        <Select
                          value={text.style.fontWeight}
                          onValueChange={(value) => updateText(index, 'style', { fontWeight: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select weight" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontWeights.map((weight) => (
                              <SelectItem key={weight.value} value={weight.value} className="text-xs">
                                {weight.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={text.style.color}
                            onChange={(e) => updateText(index, 'style', { color: e.target.value })}
                            className="h-8 w-8 p-0 border-none"
                          />
                          <Select
                            value={text.style.color}
                            onValueChange={(value) => updateText(index, 'style', { color: value })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {colors.map((color) => (
                                <SelectItem key={color.value} value={color.value} className="text-xs">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded border" 
                                      style={{ backgroundColor: color.value }}
                                    />
                                    {color.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Text Align</Label>
                        <Select
                          value={text.style.textAlign}
                          onValueChange={(value) => updateText(index, 'style', { textAlign: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select alignment" />
                          </SelectTrigger>
                          <SelectContent>
                            {textAligns.map((align) => (
                              <SelectItem key={align} value={align} className="text-xs">
                                {align.charAt(0).toUpperCase() + align.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Animation</Label>
                      <Select
                        value={text.animation}
                        onValueChange={(value) => updateText(index, 'animation', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select animation" />
                        </SelectTrigger>
                        <SelectContent>
                          {animationStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value} className="text-xs">
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdvancedTextEditor;