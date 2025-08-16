import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GreetingFormData, MediaItem, TextContent, EventType } from '@/types/greeting';
import { BorderSettings } from '@/types/background';
import { eventTypes, animationStyles } from '@/data/eventTypes';
import BasicDetailsForm from '@/components/greeting/form/BasicDetailsForm';
import ContentForm from '@/components/greeting/form/ContentForm';
import CustomizationForm from '@/components/greeting/form/CustomizationForm';
import ActionsForm from '@/components/greeting/form/ActionsForm';
import LanguageSelector from '@/components/language/LanguageSelector';
import ShareActions from '@/components/share/ShareActions';
import Preview from '@/components/greeting/Preview';
import SEOManager from '@/components/seo/SEOManager';
import BackButton from '@/components/ui/back-button';
import { Palette, Eye, Wand2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';


const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { translate } = useLanguageTranslation();
  
  const [formData, setFormData] = useState<GreetingFormData>({
    eventType: '',
    senderName: '',
    receiverName: '',
    texts: [],
    media: [],
    videoUrl: '',
    videoPosition: {width: 400, height: 300 },
    animationStyle: 'fade',
    layout: 'grid',
    theme: '',
    backgroundSettings: {
      color: '#ffffff',
      gradient: { enabled: false, colors: ['#ffffff', '#000000'], direction: 'to right' },
      animation: { enabled: false, type: 'stars', speed: 3, intensity: 50 },
      pattern: { enabled: false, type: 'dots', opacity: 20 }
    },
    emojis: [],
    borderSettings: {
      enabled: false,
      style: 'solid',
      width: 2,
      color: '#000000',
      radius: 0,
      animation: { enabled: false, type: 'none', speed: 3 },
      elements: [],
      decorativeElements: []
    }
  });

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [customEvent, setCustomEvent] = useState<EventType | null>(null);
  // Add to your existing state declarations
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewClick = () => {
  if (!formData.eventType) {
    toast({
      title: "Please select an event type",
      description: "Event type is required to preview the greeting.",
      variant: "destructive"
    });
    return;
  }
  setIsPreviewOpen(true);
};

  
useEffect(() => {
  if (formData.eventType) {
    // Check both predefined and custom events
    const event = [...eventTypes, ...(customEvent ? [customEvent] : [])]
      .find(e => e.value === formData.eventType);
    
    setSelectedEvent(event || null);
    
    if (event && formData.texts.length === 0) {
      setFormData(prev => ({ 
        ...prev, 
        texts: [{ 
          id: Date.now().toString(),
          content: event.defaultMessage,
          style: { 
            fontSize: '24px', 
            fontWeight: 'normal', 
            color: 'hsl(var(--foreground))', 
            textAlign: 'center' 
          },
          animation: 'fade'
        }]
      }));
    }
  }
}, [formData.eventType, customEvent]); // Add customEvent to dependencies

  const handleInputChange = (field: string, value: string) => {
  setFormData(prev => {
    const newData = { ...prev, [field]: value };
    
    // Special handling for eventType changes
    if (field === 'eventType') {
      // Find the event in either predefined or custom events
      const event = [...eventTypes, ...(customEvent ? [customEvent] : [])]
        .find(e => e.value === value);
      
      return { 
        ...newData,
        theme: event?.theme || ''
      };
    }
    
    return newData;
  });
};

  const handleMediaChange = (newMedia: MediaItem[]) => {
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const handleTextChange = (newTexts: TextContent[]) => {
    setFormData(prev => ({ ...prev, texts: newTexts }));
  };

  const generateShareableURL = () => {
    if (!formData.eventType) {
      toast({
        title: "Please select an event type",
        description: "Event type is required to generate a sharable link.",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams();
    // Add basic form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'texts' && Array.isArray(value)) {
        params.append('texts', JSON.stringify(value));
      } else if (key === 'media' && Array.isArray(value)) {
        params.append('media', JSON.stringify(value));
      } else if (key === 'emojis' && Array.isArray(value)) {
        params.append('emojis', JSON.stringify(value));
      } else if (key === 'backgroundSettings') {
        params.append('backgroundSettings', JSON.stringify(value));
      } else if (key === 'borderSettings') {
        params.append('borderSettings', JSON.stringify(value));
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

    // Add custom event details if it's a custom event
    if (formData.eventType === 'custom' && customEvent) {
      params.append('customEventName', customEvent.label);
      params.append('customEventEmoji', customEvent.emoji);
    }
    // Also handle if customEventName is directly in formData
    if (formData.customEventName) {
      params.append('customEventName', formData.customEventName);
    }
    if (formData.customEventEmoji) {
      params.append('customEventEmoji', formData.customEventEmoji);
    }

    const shareableURL = `${window.location.origin}/?${params.toString()}`;
    navigator.clipboard.writeText(shareableURL);
    
    toast({
      title: "Link copied!",
      description: "Sharable greeting URL has been copied to your clipboard.",
    });
  };

  const previewGreeting = () => {
    if (!formData.eventType) {
      toast({
        title: "Please select an event type",
        description: "Event type is required to preview the greeting.",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams();
    // Add basic form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'texts' && Array.isArray(value)) {
        params.append('texts', JSON.stringify(value));
      } else if (key === 'media' && Array.isArray(value)) {
        params.append('media', JSON.stringify(value));
      } else if (key === 'emojis' && Array.isArray(value)) {
        params.append('emojis', JSON.stringify(value));
      } else if (key === 'backgroundSettings') {
        params.append('backgroundSettings', JSON.stringify(value));
      } else if (key === 'borderSettings') {
        params.append('borderSettings', JSON.stringify(value));
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

    // Add custom event details if it's a custom event
    if (formData.eventType === 'custom' && customEvent) {
      params.append('customEventName', customEvent.label);
      params.append('customEventEmoji', customEvent.emoji);
    }
    // Also handle if customEventName is directly in formData
    if (formData.customEventName) {
      params.append('customEventName', formData.customEventName);
    }
    if (formData.customEventEmoji) {
      params.append('customEventEmoji', formData.customEventEmoji);
    }

    
    navigate(`/?${params.toString()}`);
    
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-2">
    
      
      {/* Back Button */}
      <div className="flex justify-between items-center w-full mt-4">
        <BackButton to="/" className="bg-background/80 backdrop-blur">
          Back to Home
        </BackButton>
        
        <LanguageSelector />
        
      </div>




      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l bg-clip-text text-transparent">
            ✨ {translate('Create Your Greeting')}
          </h1>
           <p className="text-lg md:text-xl text-muted-foreground font-medium animate-typing overflow-hidden  border-r-4 border-r-primary">
            {translate('Design a beautiful, personalized greeting to share with someone special')}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="animate-slide-in shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Customize Your Greeting
              </CardTitle>
            </CardHeader>


            <CardContent className="space-y-6">
              <BasicDetailsForm
                eventType={formData.eventType}
                senderName={formData.senderName}
                receiverName={formData.receiverName}
                customEvent={customEvent}
                onEventChange={(value) => {
                  handleInputChange('eventType', value);
                  const event = [...eventTypes, ...(customEvent ? [customEvent] : [])]
                    .find(e => e.value === value);
                  setSelectedEvent(event || null);
                }}
                onInputChange={handleInputChange}
                onCustomEventCreate={(newEvent) => {
                  setCustomEvent(newEvent);
                  handleInputChange('eventType', newEvent.value);
                  setSelectedEvent(newEvent);
                }}
              />

              <Separator />

              <ContentForm
                texts={formData.texts}
                media={formData.media}
                emojis={formData.emojis}
                onTextChange={handleTextChange}
                onMediaChange={handleMediaChange}
                onEmojiChange={(emojis) => setFormData(prev => ({ ...prev, emojis }))}
              />

              <Separator />

              <CustomizationForm
                backgroundSettings={formData.backgroundSettings}
                borderSettings={formData.borderSettings}
                layout={formData.layout}
                animationStyle={formData.animationStyle}
                onBackgroundChange={(settings) => setFormData(prev => ({ ...prev, backgroundSettings: settings }))}
                onBorderChange={(borderSettings) => setFormData(prev => ({ ...prev, borderSettings }))}
                onLayoutChange={(layout) => handleInputChange('layout', layout)}
                onAnimationChange={(animation) => handleInputChange('animationStyle', animation)}
              />

              <ActionsForm
                greetingData={formData}
                onGenerateLink={generateShareableURL}
              />
            </CardContent>
          </Card>

          
        {/* Live Preview Section */}
<Card 
  className={`px-2 animate-zoom-in shadow-xl ${selectedEvent?.theme || ''} 
              transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]`}
 
>
<CardHeader className="relative overflow-hidden group">
  {/* Animated background gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-violet-200 hover:bg-gradient-to-l text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

  {/* Sparkle particles */}
  {[...Array(5)].map((_, i) => (
    <div
      key={i}
      className="absolute text-xl opacity-0 group-hover:opacity-100 group-hover:animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.2}s`
      }}
    >
      ✨
    </div>
  ))}

  <CardTitle  onClick={handlePreviewClick} className="cursor-pointer flex items-center gap-2 relative z-10">
    {/* Animated eye icon */}
    <span className="inline-block group-hover:animate-bounce">    
     👀 Live Preview (Click to Expand)
    </span>
  </CardTitle>
</CardHeader>
  <CardContent>
    {formData.eventType ? (
      <Preview greetingData={formData} selectedEvent={selectedEvent} />
    ) : (
      <div className="text-center text-muted-foreground py-12">
        <div className="text-4xl mb-4">🎨</div>
        <p>Select an event type to see your greeting preview</p>
      </div>
    )}
  </CardContent>
</Card>

{isPreviewOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto">
      <Button 
        onClick={() => setIsPreviewOpen(false)}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur"
      >
        ✕
      </Button>
      <Preview greetingData={formData} selectedEvent={selectedEvent} />
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Create;