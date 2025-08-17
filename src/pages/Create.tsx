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
import BasicDetailsForm from '@/components/greeting/contentEditor/BasicDetailsForm';
import ContentForm from '@/components/greeting/contentEditor/ContentForm';
import CustomizationForm from '@/components/greeting/customization/CustomizationForm';
import ActionsForm from '@/components/greeting/form/ActionsForm';
import LanguageSelector from '@/components/language/LanguageSelector';
import ShareActions from '@/components/share/ShareActions';
import Preview from '@/components/preview/Preview';
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
  // Track whether user manually edited texts (prevents auto-overwrite)
  const [textsEdited, setTextsEdited] = useState(false);
  // Remember the previous event default message we injected
  const prevDefaultRef = useRef<string | null>(null);
    
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
  if (!formData.eventType) return;

  // Find event (predefined or custom)
  const event = [...eventTypes, ...(customEvent ? [customEvent] : [])]
    .find(e => e.value === formData.eventType);

  setSelectedEvent(event || null);

  const eventDefault = event?.defaultMessage || '';

  // Current first text content (if any)
  const currentFirstText = formData.texts?.[0]?.content;

  // Decide whether to replace:
  // - no text present OR
  // - user hasn't edited texts at all (textsEdited === false) OR
  // - current text equals previously injected default (safe to replace)
  const shouldReplace =
    !currentFirstText ||
    !textsEdited ||
    currentFirstText === prevDefaultRef.current;

  if (event && shouldReplace) {
    setFormData(prev => ({
      ...prev,
      texts: [{
        id: Date.now().toString(),
        content: eventDefault,
        style: {
          fontSize: '24px',
          fontWeight: 'normal',
          color: 'hsl(var(--foreground))',
          textAlign: 'center'
        },
        animation: 'fade'
      }]
    }));

    // we programmatically set the texts => treat as NOT user-edited
    setTextsEdited(false);
  }

  // update prev default for next comparison
  prevDefaultRef.current = eventDefault;
}, [formData.eventType, customEvent]); // keep deps unchanged


  const handleInputChange = (field: string, value: string) => {
  setFormData(prev => {
    const newData = { ...prev, [field]: value };
    
    // Special handling for eventType changes
   if (field === 'eventType') {
  // Find the event in either predefined or custom events
  const event = [...eventTypes, ...(customEvent ? [customEvent] : [])].find(e => e.value === value);

  // If user selected a predefined event (not 'custom'), remove custom name/emoji from formData
  // and inject default message only if texts are empty
  return {
    ...newData,
    theme: event?.theme || '',
    ...(value !== 'custom' ? { customEventName: '', customEventEmoji: '' } : {}),
    texts: (prev.texts && prev.texts.length > 0) ? prev.texts : (event ? [{
      id: Date.now().toString(),
      content: event?.defaultMessage || '',
      style: {
        fontSize: '24px',
        fontWeight: 'normal',
        color: 'hsl(var(--foreground))',
        textAlign: 'center'
      },
      animation: 'fade'
    }] : prev.texts)
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
  // Mark that user edited texts (so we don't later overwrite their custom content)
  setTextsEdited(true);
};


//   const generateShareableURL = () => {
//     if (!formData.eventType) {
//       toast({
//         title: "Please select an event type",
//         description: "Event type is required to generate a sharable link.",
//         variant: "destructive"
//       });
//       return;
//     }

//     const params = new URLSearchParams();
//     // Add basic form data
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === 'texts' && Array.isArray(value)) {
//         params.append('texts', JSON.stringify(value));
//       } else if (key === 'media' && Array.isArray(value)) {
//         params.append('media', JSON.stringify(value));
//       } else if (key === 'emojis' && Array.isArray(value)) {
//         params.append('emojis', JSON.stringify(value));
//       } else if (key === 'backgroundSettings') {
//         params.append('backgroundSettings', JSON.stringify(value));
//       } else if (key === 'borderSettings') {
//         params.append('borderSettings', JSON.stringify(value));
//       } else if (key === 'videoPosition') {
//         params.append('videoPosition', JSON.stringify(value));
//       } else if (value && typeof value === 'string') {
//         params.append(key, value);
//       }
//     });

//     // Ensure custom event details get appended regardless of eventType value:
// if (customEvent) {
//   params.set('customEventName', customEvent.label);
//   params.set('customEventEmoji', customEvent.emoji);
// }
// // fallbacks — if user filled name/emoji directly into formData fields
// if (formData.customEventName) {
//   params.set('customEventName', formData.customEventName);
// }
// if (formData.customEventEmoji) {
//   params.set('customEventEmoji', formData.customEventEmoji);
// }

//     const shareableURL = `${window.location.origin}/?${params.toString()}`;
//     navigator.clipboard.writeText(shareableURL);
    
//     toast({
//       title: "Link copied!",
//       description: "Sharable greeting URL has been copied to your clipboard.",
//     });
//   };

  
//   const previewGreeting = () => {
//     if (!formData.eventType) {
//       toast({
//         title: "Please select an event type",
//         description: "Event type is required to preview the greeting.",
//         variant: "destructive"
//       });
//       return;
//     }

//     const params = new URLSearchParams();
//     // Add basic form data
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === 'texts' && Array.isArray(value)) {
//         params.append('texts', JSON.stringify(value));
//       } else if (key === 'media' && Array.isArray(value)) {
//         params.append('media', JSON.stringify(value));
//       } else if (key === 'emojis' && Array.isArray(value)) {
//         params.append('emojis', JSON.stringify(value));
//       } else if (key === 'backgroundSettings') {
//         params.append('backgroundSettings', JSON.stringify(value));
//       } else if (key === 'borderSettings') {
//         params.append('borderSettings', JSON.stringify(value));
//       } else if (key === 'videoPosition') {
//         params.append('videoPosition', JSON.stringify(value));
//       } else if (value && typeof value === 'string') {
//         params.append(key, value);
//       }
//     });

//     // Ensure custom event details get appended regardless of eventType value:
// if (customEvent) {
//   params.set('customEventName', customEvent.label);
//   params.set('customEventEmoji', customEvent.emoji);
// }
// // fallbacks — if user filled name/emoji directly into formData fields
// if (formData.customEventName) {
//   params.set('customEventName', formData.customEventName);
// }
// if (formData.customEventEmoji) {
//   params.set('customEventEmoji', formData.customEventEmoji);
// }


    
//     navigate(`/?${params.toString()}`);
    
//   };


// Put this function in Create.tsx (replace old generateShareableURL implementation)
const buildPayloadForSharing = () => {
  // Construct a payload snapshot that definitely contains the latest customEvent info
  const payload = {
    ...formData,
    ...(customEvent ? {
      customEventName: customEvent.label,
      customEventEmoji: customEvent.emoji
    } : {}),
    // Also ensure any fields that might be undefined are standardised
    texts: formData.texts || [],
    media: formData.media || [],
    emojis: formData.emojis || []
  };

  return payload;
};

const generateShareableURL = () => {
  if (!formData.eventType && !formData.customEventName && !customEvent) {
    toast({
      title: "Please select or create an event",
      description: "Event type is required to generate a sharable link.",
      variant: "destructive"
    });
    return;
  }

  const payload = buildPayloadForSharing();
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v) || typeof v === 'object') {
      params.set(k, JSON.stringify(v));
    } else {
      params.set(k, String(v));
    }
  });

  // Explicitly ensure customEvent fields are present
  if (customEvent) {
    params.set('customEventName', customEvent.label);
    params.set('customEventEmoji', customEvent.emoji);
  } else if (formData.customEventName) {
    params.set('customEventName', formData.customEventName);
    if (formData.customEventEmoji) params.set('customEventEmoji', formData.customEventEmoji);
  }

  const shareableURL = `${window.location.origin}/?${params.toString()}`;
  navigator.clipboard.writeText(shareableURL);

  toast({
    title: "Link copied!",
    description: "Sharable greeting URL has been copied to your clipboard.",
  });
};

// Put this function in Create.tsx (replace old previewGreeting implementation)
const previewGreeting = () => {
  if (!formData.eventType && !formData.customEventName && !customEvent) {
    toast({
      title: "Please select or create an event",
      description: "Event type is required to preview the greeting.",
      variant: "destructive"
    });
    return;
  }

  const payload = buildPayloadForSharing();
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v) || typeof v === 'object') {
      params.set(k, JSON.stringify(v));
    } else {
      params.set(k, String(v));
    }
  });

  // add customEvent data explicitly
  if (customEvent) {
    params.set('customEventName', customEvent.label);
    params.set('customEventEmoji', customEvent.emoji);
  } else if (formData.customEventName) {
    params.set('customEventName', formData.customEventName);
    if (formData.customEventEmoji) params.set('customEventEmoji', formData.customEventEmoji);
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
  // keep customEvent in-memory for live preview/editor
  setCustomEvent(newEvent);

  // Build a typed default text (ensure it matches TextContent)
  const injectedText: TextContent = {
    id: Date.now().toString(),
    content: newEvent.defaultMessage || '',
    style: {
      fontSize: '24px',
      // keep the same allowed values as your TextContent style typing:
      fontWeight: 'normal',
      color: 'hsl(var(--foreground))',
      textAlign: 'center' as 'center' // explicit literal so TS keeps union type
    },
    animation: 'fade'
  };

  // Atomic update: set eventType, custom fields, theme and texts in one call
  setFormData(prev => {
    const shouldInjectDefaultText =
      !prev.texts || prev.texts.length === 0 || !textsEdited || prev.texts[0]?.content === prevDefaultRef.current;

    return {
      ...prev,
      eventType: 'custom',
      customEventName: newEvent.label,
      customEventEmoji: newEvent.emoji,
      theme: newEvent.theme || prev.theme,
      texts: shouldInjectDefaultText ? [injectedText] : prev.texts
    };
  });

  // mark last-injected default (so subsequent switches can detect it)
  prevDefaultRef.current = newEvent.defaultMessage || '';

  // We programmatically injected text => mark as NOT user-edited
  setTextsEdited(false);

  // update selectedEvent so Preview shows the custom event immediately
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
                selectedEvent={selectedEvent}

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