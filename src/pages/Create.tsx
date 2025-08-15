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
import CustomEventSelector from '@/components/greeting/CustomEventSelector';
import AdvancedMediaUploader from '@/components/greeting/AdvancedMediaUploader';
import AdvancedTextEditor from '@/components/greeting/AdvancedTextEditor';
import LayoutSelector from '@/components/greeting/LayoutSelector';
import BackgroundCustomizer from '@/components/greeting/BackgroundCustomizer';
import EmojiSelector from '@/components/greeting/EmojiSelector';
import BorderCustomizer from '@/components/greeting/BorderCustomizer';
import LanguageSelector from '@/components/language/LanguageSelector';
import ShareActions from '@/components/share/ShareActions';
import Preview from '@/components/greeting/Preview';
import SEOManager from '@/components/seo/SEOManager';
import BackButton from '@/components/ui/back-button';
import { Palette, Eye, Wand2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';


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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showVisualEditor, setShowVisualEditor] = useState(false);
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
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

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
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

    
    navigate(`/?${formData.toString()}`);
    
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

              {/* Custom Event Selector */}
              <CustomEventSelector
                selectedEvent={formData.eventType}
                customEvent={customEvent}
                onEventChange={(value) => {
                  handleInputChange('eventType', value);
                  // Also update selectedEvent state
                  const event = [...eventTypes, ...(customEvent ? [customEvent] : [])]
                    .find(e => e.value === value);
                  setSelectedEvent(event || null);
                }}
                onCustomEventCreate={(newEvent) => {
                   setCustomEvent(newEvent);
                  // Update formData with custom event details
                  // setFormData(prev => ({
                  //   ...prev,
                  //   eventType: newEvent.value,
                  //   customEventName: newEvent.label,
                  //   customEventEmoji: newEvent.emoji,
                  //   theme: newEvent.theme || ''
                  // }));
                  
                   handleInputChange('eventType', newEvent.value);
                  setSelectedEvent(newEvent);
                }}
              />

              <Separator />

              {/* Names */}
              <div className="grid md:grid-cols-2 gap-4 p-6 border border-green-300 rounded-xl shadow-lg">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Your Name (optional)</Label>
                  <Input
                    id="senderName"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Receiver's Name (optional)</Label>
                  <Input
                    id="receiverName"
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    placeholder="Recipient's name"
                  />
                </div>
              </div>

              <Separator />

              {/* Advanced Text Editor (up to 10 texts) */}
              <AdvancedTextEditor
                texts={formData.texts}
                onChange={handleTextChange}
              />

              <Separator />

              {/* Advanced Media Uploader (up to 20 images/videos) */}
              <AdvancedMediaUploader
                media={formData.media}
                onChange={handleMediaChange}
              />

              <Separator />

              {/* Emoji Decorator */}
              <EmojiSelector
                emojis={formData.emojis}
                onChange={(emojis) => setFormData(prev => ({ ...prev, emojis }))}
              />

        

              <Separator />

              {/* Background Customizer */}
              <BackgroundCustomizer
                settings={formData.backgroundSettings}
                onChange={(settings) => setFormData(prev => ({ ...prev, backgroundSettings: settings }))}
              />

              <Separator />

              {/* Border Customizer */}
              <BorderCustomizer
                settings={formData.borderSettings}
                onChange={(borderSettings) => setFormData(prev => ({ ...prev, borderSettings }))}
              />

              <Separator />

              {/* Layout & Animation Selector */}
              <LayoutSelector
                layout={formData.layout}
                animationStyle={formData.animationStyle}
                onLayoutChange={(layout) => handleInputChange('layout', layout)}
                onAnimationChange={(animation) => handleInputChange('animationStyle', animation)}
              />

              <Separator />
          
              <div className="flex flex-col items-center gap-4 pt-8">
                  <ShareActions greetingData={formData} />
                      
                    <Button
                      size="lg"
                      onClick={generateShareableURL}
                      className="relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l"
                    >
                      <span className="relative z-10 flex items-center">
                        <span className="mr-3 text-2xl group-hover:animate-spin">✨</span>
                        <span>Generate Share Link</span>
                      </span>
                      {/* Button shine effect */}
                        <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
                        
                        {/* Border elements */}
                        <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg 
                                        group-hover:rounded-none transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
                        
                        {/* Lightning border animation */}
                        <span className="absolute inset-0 border-2 border-transparent 
                                        group-hover:border-[length:400%_400%] group-hover:bg-[length:400%_400%]
                                        group-hover:animate-lightning-rounding" />
                      </Button>
              </div>
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