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
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';
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
        // Create custom event object
        setCurrentEvent({
          value: 'custom',
          emoji: params.get('customEventEmoji') || '🎉',// Default emoji or you could pass this as a param
          label: data.customEventName || 'Custom Event',
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
//     return (
//       // Move the ref to this outer container that wraps ALL greeting content
//     <div ref={greetingRef} className={`min-h-screen p-4 ${getBackgroundClasses()}`} style={getBackgroundStyle()} data-greeting-container>
//       {/* <div className={`min-h-screen p-4 ${getBackgroundClasses()}`}> */}

//         {/* Background Video */}
//         {greetingData.videoUrl && (
//           <video
//             className="fixed inset-0 w-full h-full object-cover -z-10"
//             autoPlay
//             loop
//             muted
//             style={{
//               width: `${greetingData.videoPosition.width}px`,
//               height: `${greetingData.videoPosition.height}px`,
//               transform: 'translate(-50%, -50%)'
//             }}
//           >
//             <source src={greetingData.videoUrl} type="video/mp4" />
//           </video>
//         )}

//         <div className="max-w-4xl mx-auto relative">
//           {/* Emojis */}
//           {greetingData.emojis.map((emoji) => (
//             <div
//               key={emoji.id}
//               className={`absolute text-${emoji.size}xl animate-${emoji.animation}`}
//               style={{
//                 left: `${emoji.position.x}%`,
//                 top: `${emoji.position.y}%`,
//                 fontSize: `${emoji.size}rem`
//               }}
//             >
//               {emoji.emoji}
//             </div>
//           ))}

//           <Card 
//             className={`shadow-2xl ${currentEvent?.theme || ''} animate-fade-in relative overflow-hidden`}
//             style={{
//               ...(greetingData.borderSettings?.enabled ? {
//                 borderWidth: `${greetingData.borderSettings.width}px`,
//                 borderStyle: greetingData.borderSettings.style,
//                 borderColor: greetingData.borderSettings.color,
//                 borderRadius: `${greetingData.borderSettings.radius}px`
//               } : {})
//             }}
//           >
//             <CardContent className="p-8 md:p-12">
//               <div className={`space-y-8 ${greetingData.animationStyle === 'fade' ? 'animate-fade-in' : 
//                                             greetingData.animationStyle === 'slide' ? 'animate-slide-in' :
//                                             greetingData.animationStyle === 'zoom' ? 'animate-zoom-in' :
//                                             greetingData.animationStyle === 'flip' ? 'animate-flip-in' :
//                                             greetingData.animationStyle === 'rotate' ? 'animate-rotate-in' :
//                                             greetingData.animationStyle === 'shake' ? 'animate-shake' :
//                                             greetingData.animationStyle === 'swing' ? 'animate-swing' :
//                                              greetingData.animationStyle === 'tada' ? 'animate-tada' :
//                                              'animate-bounce-in'}`}>
                
//                 {/* Event Header */}
//                 <div className="text-center">
//                   <div className="text-8xl md:text-9xl mb-6 animate-bounce-in">{currentEvent?.emoji}</div>
//                   <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                     {currentEvent?.label}
//                   </h1>
//                   {greetingData.receiverName && (
//                     <p className="text-2xl md:text-3xl text-muted-foreground mb-2">{translate('For')}</p>
//                   )}
//                   {greetingData.receiverName && (
//                     <p className="text-3xl md:text-4xl font-bold text-primary">{greetingData.receiverName}</p>
//                   )}
//                 </div>

//  {/* Text Messages */}
//  <div className="space-y-6 max-w-3xl mx-auto">
//                 {greetingData.texts.map((text) => (
//                   <div
//                     key={text.id}
//                     className={`bg-card/60 backdrop-blur p-6 rounded-xl shadow-lg animate-${text.animation}`}
//                     style={{
//                       fontSize: text.style.fontSize,
//                       fontWeight: text.style.fontWeight,
//                       color: text.style.color,
//                       textAlign: text.style.textAlign
//                     }}
//                   >
//                     {text.content}
//                   </div>
//                 ))}
//               </div>


//                 {/* Media Gallery */}
//                 {greetingData.media.length > 0 && (
//                   <div className={`${
//                     greetingData.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
//                     greetingData.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6' :
//                     greetingData.layout === 'carousel' ? 'flex overflow-x-auto space-x-6' :
//                     greetingData.layout === 'stack' ? 'grid grid-cols-1 gap-6' :
//                     'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//                   } max-w-4xl mx-auto`}>
//                     {greetingData.media
//                       .sort((a, b) => a.priority - b.priority)
//                       .map((mediaItem) => (
//                         <div
//                           key={mediaItem.id}
//                           className={`animate-${mediaItem.animation} rounded-xl shadow-lg overflow-hidden`}
//                           style={{
//                             width: `${mediaItem.position.width}px`,
//                             height: `${mediaItem.position.height}px`,
//                             position: greetingData.layout === 'collage' ? 'absolute' : 'relative',
//                           }}
//                         >
//                           {mediaItem.type === 'image' ? (
//                             <img
//                               src={mediaItem.url}
//                               alt={`Greeting image`}
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = 'none';
//                               }}
//                             />
//                           ) : (
//                             <video
//                               src={mediaItem.url}
//                               className="w-full h-full object-cover"
//                               controls
//                               muted
//                             />
//                           )}
//                         </div>
//                       ))}
//                   </div>
//                 )}

//                 {/* Sender */}
//                 {greetingData.senderName && (
//                   <div className="text-center pt-8 border-t border-border/50">
//                     <p className="text-lg text-muted-foreground mb-2">{translate('With love from')}</p>
//                     <p className="text-2xl md:text-3xl font-bold text-primary">{greetingData.senderName}</p>
//                   </div>
//                 )}

//                 {/* Share Actions */}
//                 <div className="flex flex-col items-center gap-4 pt-8 no-capture">
//                   <ShareActions greetingData={greetingData} greetingRef={greetingRef} />
//                   {/* <ShareActions greetingData={greetingData} /> */}
            

// <Button
//   onClick={shareWithSomeoneElse}
//   size="sm"
//   className="p-5 relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l"
// >
//   <span className="relative z-10 flex items-center">
//     <span className="mr-3 text-2xl group-hover:animate-spin">✨</span>
//     <span>Customize and share with others</span>
//   </span>
  
//   {/* Button shine effect */}
//   <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
  
//   {/* Border elements */}
//   <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg 
//                   group-hover:rounded-none transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
  
//   {/* Lightning border animation */}
//   <span className="absolute inset-0 border-2 border-transparent 
//                   group-hover:border-[length:400%_400%] group-hover:bg-[length:400%_400%]
//                   group-hover:animate-lightning-rounding" />
// </Button>

//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );

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
