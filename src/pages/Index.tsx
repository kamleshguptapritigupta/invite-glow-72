import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GreetingFormData, EventType } from '@/types/greeting';
import { eventTypes, animationStyles } from '@/data/eventTypes';
import ShareActions from '@/components/share/ShareActions';
import SEOManager from '@/components/seo/SEOManager';
import { motion, AnimatePresence } from 'framer-motion';
import TypingText from '../components/reusableTypingText/TypingText'
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import LandingPage from '@/components/landingPage/LandingPage'
import Preview from '@/components/greeting/Preview';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [greetingData, setGreetingData] = useState<GreetingFormData | null>(null);
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const greetingRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.toString()) {
      // Extract greeting data from URL parameters with new structure
      const data: GreetingFormData = {
        eventType: params.get('eventType') || '',
        senderName: params.get('senderName') || '',
        receiverName: params.get('receiverName') || '',
        customEventName: params.get('customEventName') || '', // Add custom event name
        customEventEmoji: params.get('customEventEmoji') || '',
        texts: params.get('texts') ? JSON.parse(params.get('texts')!) : [],
        media: params.get('media') ? JSON.parse(params.get('media')!) : [],
        videoUrl: params.get('videoUrl') || '',
        videoPosition: params.get('videoPosition') ? JSON.parse(params.get('videoPosition')!) : { width: 400, height: 300 },
        animationStyle: params.get('animationStyle') || 'fade',
        
        layout: (params.get('layout') as any) || 'grid',
        theme: params.get('theme') || '',
        backgroundSettings: params.get('backgroundSettings') ? JSON.parse(params.get('backgroundSettings')!) : {
          color: '#ffffff',
          gradient: { enabled: false, colors: ['#ffffff', '#000000'], direction: 'to right' },
          animation: { enabled: false, type: 'stars', speed: 3, intensity: 50 },
          pattern: { enabled: false, type: 'dots', opacity: 20 }
        },
        emojis: params.get('emojis') ? JSON.parse(params.get('emojis')!) : [],
        borderSettings: params.get('borderSettings') ? JSON.parse(params.get('borderSettings')!) : {
          enabled: false,
          style: 'solid',
          width: 2,
          color: '#000000',
          radius: 0,
          animation: { enabled: false, type: 'none', speed: 3 },
          elements: [],
          decorativeElements: []
        }
      };
      
      setGreetingData(data);
      
      // Handle both predefined and custom events

      if (data.eventType === 'custom') {
        // Create custom event object with proper parameter handling
        const customEventName = params.get('customEventName') || data.customEventName || 'Custom Event';
        const customEventEmoji = params.get('customEventEmoji') || data.customEventEmoji || '🎉';
        setCurrentEvent({
          value: 'custom',
          emoji: customEventEmoji,
          label: customEventName,
          defaultMessage: data.texts[0]?.content || 'Wishing you a wonderful celebration!',
          theme: data.theme || '',
          category: 'custom'
        });
      } else {
        // Find predefined event type
        const event = eventTypes.find(e => e.value === data.eventType);
        setCurrentEvent(event || null);
      }
    }
  }, [location.search]);

  const shareWithSomeoneElse = () => {
    const params = new URLSearchParams();
    if (greetingData?.eventType) {
      params.append('eventType', greetingData.eventType);
    }
    if (greetingData?.senderName) {
      params.append('senderName', greetingData.senderName);
    }
    navigate(`/create?${params.toString()}`);
  };

  
  // Generate background classes based on settings
  const getBackgroundClasses = () => {
    if (!greetingData?.backgroundSettings) return 'bg-gradient-to-br from-primary/10 via-background to-secondary/20';
    
    const { backgroundSettings } = greetingData;
    let classes = '';
    
    if (backgroundSettings.animation.enabled) {
      switch (backgroundSettings.animation.type) {
        case 'stars': classes += 'bg-stars '; break;
        case 'sparkles': classes += 'bg-sparkles '; break;
        case 'particles': classes += 'bg-particles '; break;
        case 'hearts': classes += 'bg-falling-hearts '; break;
        case 'bubbles': classes += 'bg-floating-bubbles '; break;
        case 'dots': classes += 'bg-glowing-dots '; break;
        case 'rings': classes += 'bg-pulsing-rings '; break;
        case 'snow': classes += 'bg-snow '; break;
      }
    }
    
    return classes;
  };

  const getBackgroundStyle = () => {
    if (!greetingData?.backgroundSettings) return {};
    const { backgroundSettings } = greetingData;
    let style: React.CSSProperties = {};
    if (backgroundSettings.gradient.enabled) {
      const [color1, color2] = backgroundSettings.gradient.colors;
      style.background = `linear-gradient(${backgroundSettings.gradient.direction}, ${color1}, ${color2})`;
    } else {
      style.backgroundColor = backgroundSettings.color;
    }
    return style;
  };

  // Show greeting if data exists
  if (greetingData && greetingData.eventType) {

return (
      <>
        <SEOManager 
          title={`${currentEvent?.label || 'Greeting'} for ${greetingData.receiverName || 'You'}`}
          description={greetingData.texts[0]?.content || currentEvent?.defaultMessage || ''}
        />
        <Preview 
          greetingData={greetingData}
          selectedEvent={currentEvent}
          showVisualEditor={false}
        />
           
      </>
    );

  }

  // Show landing page if no greeting data
  return (
  <LandingPage />
  );




};

export default Index;
