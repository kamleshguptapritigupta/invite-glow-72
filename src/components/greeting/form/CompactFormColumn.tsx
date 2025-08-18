import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { GreetingFormData, EventType } from '@/types/greeting';
import { Palette, Type, Image, Sparkles, Settings, Share } from 'lucide-react';
import BasicDetailsForm from '../contentEditor/BasicDetailsForm';
import ContentForm from '../contentEditor/ContentForm';
import AdvancedMediaUploader from '../contentEditor/mediaUploader/AdvancedMediaUploader';
import EmojiSelector from '../contentEditor/EmojiSelector';
import BackgroundCustomizer from '../customization/BackgroundCustomizer/BackgroundCustomizer';
import BorderCustomizer from '../customization/BorderCustomizer/BorderCustomizer';
import CustomizationForm from '../customization/CustomizationForm';
import ActionsForm from './ActionsForm';

interface CompactFormColumnProps {
  formData: GreetingFormData;
  selectedEvent: EventType | null;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: any) => void;
  onTextChange: (texts: any[]) => void;
  onMediaChange: (media: any[]) => void;
  onEmojiChange: (emojis: any[]) => void;
  onBackgroundChange: (settings: any) => void;
  onBorderChange: (settings: any) => void;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
  onCustomEventCreate: (event: EventType) => void;
  onGenerateLink: () => void;
}

const CompactFormColumn: React.FC<CompactFormColumnProps> = ({
  formData,
  selectedEvent,
  customEvent,
  onEventChange,
  onInputChange,
  onTextChange,
  onMediaChange,
  onEmojiChange,
  onBackgroundChange,
  onBorderChange,
  onLayoutChange,
  onAnimationChange,
  onCustomEventCreate,
  onGenerateLink
}) => {
  const getTabBadgeCount = (tab: string) => {
    switch (tab) {
      case 'content':
        return formData.texts.length;
      case 'media':
        return formData.media.length;
      case 'emojis':
        return formData.emojis.length;
      default:
        return 0;
    }
  };

  return (
    <Card className="w-full border-2 border-primary/20 shadow-xl bg-gradient-to-br from-background to-secondary/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Design Your Greeting
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            <TabsTrigger value="basics" className="flex flex-col items-center gap-1 py-2">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Basics</span>
            </TabsTrigger>
            
            <TabsTrigger value="content" className="flex flex-col items-center gap-1 py-2">
              <Type className="h-4 w-4" />
              <span className="text-xs">Content</span>
              {getTabBadgeCount('content') > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {getTabBadgeCount('content')}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="media" className="flex flex-col items-center gap-1 py-2">
              <Image className="h-4 w-4" />
              <span className="text-xs">Media</span>
              {getTabBadgeCount('media') > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {getTabBadgeCount('media')}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="emojis" className="flex flex-col items-center gap-1 py-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs">Emojis</span>
              {getTabBadgeCount('emojis') > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {getTabBadgeCount('emojis')}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="design" className="flex flex-col items-center gap-1 py-2">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Design</span>
            </TabsTrigger>
            
            <TabsTrigger value="share" className="flex flex-col items-center gap-1 py-2">
              <Share className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basics" className="space-y-4 mt-0">
              <BasicDetailsForm
                eventType={formData.eventType}
                receiverName={formData.receiverName}
                senderName={formData.senderName}
                customEvent={customEvent}
                onEventChange={onEventChange}
                onInputChange={onInputChange}
                onCustomEventCreate={onCustomEventCreate}
              />
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-0">
              <ContentForm
                texts={formData.texts}
                media={formData.media}
                emojis={formData.emojis}
                onTextChange={onTextChange}
                onMediaChange={onMediaChange}
                onEmojiChange={onEmojiChange}
              />
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-0">
              <AdvancedMediaUploader
                media={formData.media}
                onChange={onMediaChange}
                maxItems={20}
              />
            </TabsContent>

            <TabsContent value="emojis" className="space-y-4 mt-0">
              <EmojiSelector
                emojis={formData.emojis}
                onChange={onEmojiChange}
              />
            </TabsContent>

            <TabsContent value="design" className="space-y-4 mt-0">
              <div className="space-y-6">
                <BackgroundCustomizer
                  settings={formData.backgroundSettings}
                  onChange={onBackgroundChange}
                />
                
                <BorderCustomizer
                  settings={formData.borderSettings}
                  onChange={onBorderChange}
                />
                
                <CustomizationForm
                  backgroundSettings={formData.backgroundSettings}
                  borderSettings={formData.borderSettings}
                  layout={formData.layout}
                  animationStyle={formData.animationStyle}
                  onBackgroundChange={onBackgroundChange}
                  onBorderChange={onBorderChange}
                  onLayoutChange={onLayoutChange}
                  onAnimationChange={onAnimationChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="share" className="space-y-4 mt-0">
              <ActionsForm
                greetingData={formData}
                selectedEvent={selectedEvent}
                onGenerateLink={onGenerateLink}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompactFormColumn;