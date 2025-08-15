import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { GreetingFormData, EventType, MediaItem } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import ShareActions from '@/components/share/ShareActions';
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from 'framer-motion';

interface PreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  className?: string;
  showVisualEditor?: boolean;
  isCompact?: boolean;
}

const PreviewComponent = ({
  greetingData, 
  selectedEvent, 
  className, 
  showVisualEditor,
  isCompact = false
}: PreviewProps) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { translate } = useLanguageTranslation();
  const [videoError, setVideoError] = useState(false);
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const prefersReducedMotion = useReducedMotion();

  // Auto-play video when component mounts and is in view
  useEffect(() => {
    if (inView && videoRef.current && greetingData.videoUrl && !videoError) {
      const playPromise = videoRef.current.play();
      
      playPromise.catch(error => {
        console.log('Video autoplay prevented:', error);
        setVideoError(true);
      });
    }
  }, [greetingData.videoUrl, inView, videoError]);

  const handleMediaError = (id: string) => {
    setMediaErrors(prev => ({ ...prev, [id]: true }));
  };

  // Memoized background style calculation with accessibility checks
  const backgroundStyle = useMemo(() => {
    if (!greetingData?.backgroundSettings) return {};
    
    const style: React.CSSProperties = {};
    const { backgroundSettings } = greetingData;
    
    if (backgroundSettings.gradient.enabled) {
      const [color1, color2] = backgroundSettings.gradient.colors;
      style.background = `linear-gradient(${backgroundSettings.gradient.direction}, ${color1}, ${color2})`;
    } else {
      style.backgroundColor = backgroundSettings.color;
    }

    if (backgroundSettings.pattern.enabled) {
      style.backgroundImage = getPatternCSS(backgroundSettings.pattern.type);
      style.opacity = backgroundSettings.pattern.opacity / 100;
    }

    if (backgroundSettings.animation.enabled && !prefersReducedMotion) {
      style.animationDuration = `${5 / backgroundSettings.animation.speed}s`;
    }

    return style;
  }, [greetingData?.backgroundSettings, prefersReducedMotion]);

  // Memoized border style calculation
  const borderStyle = useMemo(() => {
    if (!greetingData?.borderSettings?.enabled) return {};
    
    const { borderSettings } = greetingData;
    return {
      borderWidth: `${borderSettings.width}px`,
      borderStyle: borderSettings.style,
      borderColor: borderSettings.color,
      borderRadius: `${borderSettings.radius}px`,
      overflow: 'hidden'
    };
  }, [greetingData?.borderSettings]);

  // Memoized event data with fallback
  const currentEvent = useMemo(() => {
    if (selectedEvent) return selectedEvent;
    const predefinedEvent = eventTypes.find(e => e.value === greetingData.eventType);
    return predefinedEvent || {
      value: 'fallback',
      emoji: '🎉',
      label: translate('Celebration'),
      defaultMessage: translate('Wishing you a wonderful celebration!'),
      theme: '',
      category: 'custom'
    };
  }, [selectedEvent, greetingData.eventType, translate]);

  // Enhanced media layout handling
  const mediaLayoutClasses = useMemo(() => {
    const baseClasses = 'gap-4 p-4';
    switch (greetingData.layout) {
      case 'grid': return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
      case 'masonry': return `masonry-grid ${baseClasses}`;
      case 'carousel': return `flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 ${baseClasses}`;
      case 'stack': return `grid grid-cols-1 ${baseClasses}`;
      case 'collage': return `relative min-h-[400px] ${baseClasses}`;
      default: return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
    }
  }, [greetingData.layout]);

  // CSS pattern generator
  const getPatternCSS = (type: string) => {
    switch (type) {
      case 'dots': return 'radial-gradient(circle, currentColor 1px, transparent 1px)';
      case 'lines': return 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 10px)';
      case 'squares': return 'repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 10px)';
      case 'zigzag': return 'repeating-linear-gradient(135deg, currentColor 0 10px, transparent 10px 20px)';
      default: return '';
    }
  };

  // Animation variants with reduced motion support
  const textAnimationVariants: Variants = prefersReducedMotion ? {
    fade: { opacity: 1 },
    slide: { x: 0, opacity: 1 },
    bounce: { y: 0, opacity: 1 }
  } : {
    fade: { opacity: [0, 1], transition: { duration: 0.5 } },
    slide: { x: [-100, 0], opacity: [0, 1], transition: { duration: 0.5 } },
    bounce: { 
      y: [50, 0], 
      opacity: [0, 1], 
      transition: { type: 'spring', bounce: 0.4, duration: 0.5 } 
    }
  };

  // Calculate media item styles based on layout
  const getMediaItemStyles = (mediaItem: MediaItem, index: number) => {
    const baseStyles = {
      aspectRatio: greetingData.layout === 'collage' ? 'auto' : '16/9'
    };

    if (greetingData.layout === 'collage') {
      return {
        ...baseStyles,
        position: 'absolute' as const,
        width: `${Math.min(mediaItem.position?.width || 300, 300)}px`,
        height: `${Math.min(mediaItem.position?.height || 200, 200)}px`,
        zIndex: mediaItem.priority || index
      };
    }

    return {
      ...baseStyles,
      width: '100%',
      height: 'auto',
      maxWidth: greetingData.layout === 'carousel' ? '250px' : '100%',
      minHeight: greetingData.layout === 'carousel' ? '150px' : 'auto'
    };
  };

  // Get contrast color for text based on background
  const getTextColor = (bgColor: string) => {
    // Simple contrast calculation - replace with a proper library in production
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  if (isCompact) {
    return (
      <div 
        ref={ref}
        className={`w-full h-96 border rounded-lg overflow-hidden relative bg-gradient-to-br from-background to-secondary/20 ${className}`}
        style={backgroundStyle}
        role="region"
        aria-label={translate('Compact greeting card preview')}
      >
        {/* Background Video with error fallback */}
        {greetingData.videoUrl && !videoError ? (
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            aria-label={translate('Background video')}
            onError={() => setVideoError(true)}
            style={{
              width: `${greetingData.videoPosition.width}px`,
              height: `${greetingData.videoPosition.height}px`,
              objectFit: 'cover'
            }}
          >
            <source 
              src={greetingData.videoUrl} 
              type={`video/${greetingData.videoUrl.endsWith('.webm') ? 'webm' : 'mp4'}`} 
            />
          </video>
        ) : (
          <div 
            className="absolute inset-0 bg-secondary/20 flex items-center justify-center"
            aria-hidden={!videoError}
          >
            <p className="text-muted-foreground">{translate('Video unavailable')}</p>
          </div>
        )}

        {/* Background Elements */}
        <AnimatePresence>
          {greetingData.emojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              className="absolute pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 0.8 } : { 
                opacity: 0.8,
                x: emoji.animation.includes('float') ? [0, 20, 0] : 0,
                y: emoji.animation.includes('float') ? [0, -30, 0] : 0,
                rotate: emoji.animation.includes('spin') ? [0, 360] : 0
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${emoji.position.x}%`,
                top: `${emoji.position.y}%`,
                fontSize: `${Math.min(emoji.size, 3)}rem`,
              }}
              aria-hidden="true"
            >
              {emoji.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        <div 
          className={`absolute inset-4 shadow-lg ${currentEvent?.theme || ''} rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm`}
          style={borderStyle}
          aria-live="polite"
        >
          <div className={`p-6 h-full overflow-auto space-y-6 ${
            prefersReducedMotion ? '' :
            greetingData.animationStyle === 'fade' ? 'animate-fade-in' : 
            greetingData.animationStyle === 'slide' ? 'animate-slide-in' :
            greetingData.animationStyle === 'zoom' ? 'animate-zoom-in' :
            'animate-bounce-in'
          }`}>
            {/* Compact view content */}
            <div className="text-center">
              <div className="text-4xl mb-4" aria-hidden="true">
                {currentEvent.emoji}
              </div>
              <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {currentEvent.label}
              </h2>
              {greetingData.receiverName && (
                <p className="text-lg font-bold text-primary">
                  <span className="sr-only">{translate('For')}</span>
                  {greetingData.receiverName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={cn(
        "min-h-screen p-4 w-full relative overflow-hidden",
        greetingData.backgroundSettings?.animation.enabled && !prefersReducedMotion ? 
          `bg-animation-${greetingData.backgroundSettings.animation.type}` : '',
        className
      )}
      style={backgroundStyle}
      role="main"
      aria-label={translate('Interactive greeting card')}
    >
      {/* Background Video with enhanced error handling */}
      {greetingData.videoUrl && !videoError ? (
        <div className="fixed inset-0 overflow-hidden -z-10">
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
            aria-label={translate('Background video')}
            onError={() => setVideoError(true)}
            onLoadedData={() => {
              videoRef.current?.play().catch(error => {
                console.error('Video playback failed:', error);
                setVideoError(true);
              });
            }}
            style={{
              width: `${greetingData.videoPosition.width}px`,
              height: `${greetingData.videoPosition.height}px`,
              objectFit: 'cover'
            }}
          >
            <source 
              src={greetingData.videoUrl} 
              type={`video/${greetingData.videoUrl.endsWith('.webm') ? 'webm' : 'mp4'}`} 
            />
            {translate('Your browser does not support HTML5 video.')}
          </video>
        </div>
      ) : (
        <div 
          className="fixed inset-0 -z-10 bg-secondary/20 flex items-center justify-center"
          aria-hidden={!videoError}
        >
          <p className="text-lg text-muted-foreground">
            {translate('Background video unavailable')}
          </p>
        </div>
      )}

      {/* Background Elements - Emojis */}
      <AnimatePresence>
        {greetingData.emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            className="absolute pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 0.8 } : { 
              opacity: 0.8,
              x: emoji.animation.includes('float') ? [0, 20, 0] : 0,
              y: emoji.animation.includes('float') ? [0, -30, 0] : 0,
              rotate: emoji.animation.includes('spin') ? [0, 360] : 0
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${emoji.position.x}%`,
              top: `${emoji.position.y}%`,
              fontSize: `${Math.min(emoji.size, 3)}rem`,
            }}
            aria-hidden="true"
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative" ref={greetingRef}>
        {showVisualEditor && (
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="absolute -top-12 left-0 z-50"
            aria-label={translate('Back to editor')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {translate('Back to Editor')}
          </Button>
        )}

        <motion.div
          className={cn(
            "shadow-2xl relative overflow-hidden",
            currentEvent?.theme || ''
          )}
          style={borderStyle}
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          aria-live="polite"
        >
          <CardContent className="p-6 md:p-10">
            <div className="space-y-8">
              {/* Event Header */}
              <div className="text-center">
                <motion.div 
                  className="text-4xl md:text-6xl mb-4"
                  animate={prefersReducedMotion ? {} : { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity 
                  }}
                  aria-hidden="true"
                >
                  {currentEvent.emoji}
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentEvent.label}
                </h1>
                {greetingData.receiverName && (
                  <>
                    <p className="text-lg text-muted-foreground mb-1 sr-only">
                      {translate('For')}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      {greetingData.receiverName}
                    </p>
                  </>
                )}
              </div>

              {/* Text Messages */}
              {greetingData.texts.length > 0 && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <AnimatePresence>
                    {greetingData.texts.map((text) => (
                      <motion.div
                        key={text.id}
                        className={`bg-card/60 backdrop-blur p-4 rounded-lg shadow-lg`}
                        style={{
                          fontSize: text.style.fontSize,
                          fontWeight: text.style.fontWeight,
                          color: text.style.color || getTextColor(backgroundStyle.backgroundColor?.toString() || '#ffffff'),
                          textAlign: text.style.textAlign,
                          lineHeight: 'normal'
                        }}
                        variants={textAnimationVariants}
                        animate={text.animation}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        aria-live="polite"
                      >
                        {text.content}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Media Gallery */}
              {greetingData.media.length > 0 && (
                <div className={mediaLayoutClasses}>
                  <AnimatePresence>
                    {greetingData.media
                      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                      .map((mediaItem, index) => (
                        <motion.div
                          key={mediaItem.id}
                          className={cn(
                            `rounded-lg shadow-md overflow-hidden bg-card/20 transition-all duration-300`,
                            greetingData.layout === 'collage' ? 'absolute' : '',
                            greetingData.layout === 'carousel' ? 'snap-center flex-shrink-0' : ''
                          )}
                          style={getMediaItemStyles(mediaItem, index)}
                          layout={!prefersReducedMotion}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          role="group"
                          aria-label={`${translate('Media item')} ${index + 1}`}
                        >
                          {mediaErrors[mediaItem.id] ? (
                            <div 
                              className="w-full h-full flex items-center justify-center bg-destructive/10"
                              aria-label={translate('Media failed to load')}
                            >
                              <p className="text-destructive text-sm">
                                {translate('Media failed to load')}
                              </p>
                            </div>
                          ) : mediaItem.type === 'image' ? (
                            <img
                              src={mediaItem.url}
                              alt={`${translate('Greeting image')} ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              draggable={false}
                              onError={() => handleMediaError(mediaItem.id)}
                            />
                          ) : (
                            <video
                              src={mediaItem.url}
                              className="w-full h-full object-cover"
                              controls
                              muted
                              playsInline
                              draggable={false}
                              aria-label={`${translate('Greeting video')} ${index + 1}`}
                              onError={() => handleMediaError(mediaItem.id)}
                            />
                          )}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Sender */}
              {greetingData.senderName && (
                <motion.div 
                  className="text-center pt-6 border-t border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    {translate('With love from')}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {greetingData.senderName}
                  </p>
                </motion.div>
              )}

              {/* Share Actions */}
           <div 
                className="flex flex-col items-center gap-4 m-4" 
                role="group" 
                aria-label={translate('Sharing options')}
              >
                   <ShareActions greetingData={greetingData} greetingRef={greetingRef} />
              <Button
                size="lg"
                className="
                  w-full sm:w-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5
                  text-sm sm:text-base md:text-lg
                  relative overflow-hidden group animate-zoom-in shadow-2xl 
                  hover:shadow-primary/30 transition-all duration-500 
                  bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l
                  rounded-lg
                "
              >
                {/* Inner content */}
                <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
                  <span className="mr-2 sm:mr-3 text-lg sm:text-xl md:text-2xl group-hover:animate-spin">
                    ✨
                  </span>
                  <span className="text-center">Customize and share with others</span>
                </span>

                {/* Shine effect */}
                <span className="
                  absolute top-0 left-1/2 w-16 sm:w-20 h-full 
                  bg-white/30 -skew-x-12 transform -translate-x-1/2 
                  opacity-0 group-hover:opacity-100 group-hover:animate-shine 
                  transition-opacity duration-700
                " />

                {/* Border morph */}
                <span className="
                  absolute inset-0 border-2 border-transparent 
                  group-hover:border-white/30 rounded-lg 
                  group-hover:rounded-none 
                  transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]
                " />

                {/* Lightning border animation */}
                <span className="
                  absolute inset-0 border-2 border-transparent 
                  group-hover:border-[length:400%_400%] 
                  group-hover:bg-[length:400%_400%]
                  group-hover:animate-lightning-rounding
                " />
              </Button>
            </div>
            </div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
};

const MemoizedPreview = React.memo(PreviewComponent);
export default MemoizedPreview;