import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { GreetingFormData, EventType, MediaItem, TextOverlay } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import ShareActions from '@/components/share/ShareActions';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from 'framer-motion';
import DraggableElement from './DraggableElement';
import MediaOverlay from './MediaOverlay';
import BorderAnimations from './BorderAnimations';

interface EnhancedPreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  className?: string;
  showVisualEditor?: boolean;
  isCompact?: boolean;
  onDataChange?: (data: GreetingFormData) => void;
}

const EnhancedPreview = ({
  greetingData, 
  selectedEvent, 
  className, 
  showVisualEditor,
  isCompact = false,
  onDataChange
}: EnhancedPreviewProps) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { translate } = useLanguageTranslation();
  const [videoError, setVideoError] = useState(false);
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const prefersReducedMotion = useReducedMotion();
  const [isEditMode, setIsEditMode] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (greetingRef.current) {
        const rect = greetingRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMediaError = (id: string) => {
    setMediaErrors(prev => ({ ...prev, [id]: true }));
  };

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

  // Memoized background style calculation
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
      category: 'custom' as const
    };
  }, [selectedEvent, greetingData.eventType, translate]);

  // Enhanced media layout handling with new layouts
  const mediaLayoutClasses = useMemo(() => {
    const baseClasses = 'gap-4 p-4';
    switch (greetingData.layout) {
      case 'grid': return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
      case 'masonry': return `columns-1 sm:columns-2 lg:columns-3 break-inside-avoid ${baseClasses}`;
      case 'carousel': return `flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 ${baseClasses}`;
      case 'stack': return `grid grid-cols-1 ${baseClasses}`;
      case 'collage': return `relative min-h-[400px] ${baseClasses}`;
      case 'mosaic': return `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 ${baseClasses}`;
      case 'slideshow': return `relative overflow-hidden h-96 ${baseClasses}`;
      case 'polaroid': return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${baseClasses}`;
      case 'magazine': return `grid grid-cols-12 gap-4 ${baseClasses}`;
      case 'gallery': return `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${baseClasses}`;
      case 'timeline': return `flex flex-col space-y-6 ${baseClasses}`;
      case 'hexagon': return `flex flex-wrap justify-center items-center gap-4 ${baseClasses}`;
      case 'circular': return `relative min-h-[500px] ${baseClasses}`;
      case 'spiral': return `relative min-h-[600px] ${baseClasses}`;
      case 'wave': return `flex flex-wrap ${baseClasses}`;
      default: return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
    }
  }, [greetingData.layout]);

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

  // Calculate media item styles based on layout with new layouts
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

    if (greetingData.layout === 'polaroid') {
      return {
        ...baseStyles,
        width: '100%',
        height: 'auto',
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (Math.random() * 6 - 3)}deg)`
      };
    }

    if (greetingData.layout === 'hexagon') {
      const angle = (index * 60) % 360;
      const radius = 150;
      return {
        ...baseStyles,
        width: '120px',
        height: '120px',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
      };
    }

    if (greetingData.layout === 'circular') {
      const angle = (index * (360 / greetingData.media.length));
      const radius = 180;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      return {
        ...baseStyles,
        position: 'absolute' as const,
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: '150px',
        height: '150px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        overflow: 'hidden'
      };
    }

    if (greetingData.layout === 'spiral') {
      const angle = index * 40;
      const radius = 20 + index * 15;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      return {
        ...baseStyles,
        position: 'absolute' as const,
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: `${120 + index * 10}px`,
        height: `${120 + index * 10}px`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '12px'
      };
    }

    if (greetingData.layout === 'wave') {
      const waveOffset = Math.sin(index * 0.5) * 30;
      return {
        ...baseStyles,
        width: '200px',
        height: '150px',
        transform: `translateY(${waveOffset}px)`,
        margin: '10px'
      };
    }

    if (greetingData.layout === 'timeline') {
      return {
        ...baseStyles,
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        marginLeft: index % 2 === 0 ? '0' : 'auto',
        marginRight: index % 2 === 0 ? 'auto' : '0'
      };
    }

    if (greetingData.layout === 'magazine') {
      const columnSpans = [4, 6, 8, 5, 7];
      return {
        ...baseStyles,
        gridColumn: `span ${columnSpans[index % columnSpans.length]}`,
        width: '100%',
        height: 'auto'
      };
    }

    if (greetingData.layout === 'gallery') {
      return {
        ...baseStyles,
        width: '100%',
        height: '200px',
        objectFit: 'cover' as const
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

  // Handle element updates from draggable components
  const handleElementPositionChange = (id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;

    // Update emoji position
    const updatedEmojis = greetingData.emojis.map(emoji =>
      emoji.id === id ? { ...emoji, position } : emoji
    );

    // Update text position (if applicable)
    // For now, focusing on emojis, but can extend to texts

    onDataChange({
      ...greetingData,
      emojis: updatedEmojis
    });
  };

  const handleElementDelete = (id: string) => {
    if (!onDataChange) return;

    const updatedEmojis = greetingData.emojis.filter(emoji => emoji.id !== id);
    onDataChange({
      ...greetingData,
      emojis: updatedEmojis
    });
  };

  const handleMediaSizeChange = (id: string, size: { width: number; height: number }) => {
    if (!onDataChange) return;

    const updatedMedia = greetingData.media.map(media =>
      media.id === id ? { ...media, position: size } : media
    );

    onDataChange({
      ...greetingData,
      media: updatedMedia
    });
  };

  const handleMediaTextOverlaysChange = (mediaId: string, overlays: TextOverlay[]) => {
    if (!onDataChange) return;

    const updatedMedia = greetingData.media.map(media =>
      media.id === mediaId ? { ...media, textOverlays: overlays } : media
    );

    onDataChange({
      ...greetingData,
      media: updatedMedia
    });
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
          <BorderAnimations borderSettings={greetingData.borderSettings} containerSize={containerSize} />
          
          <div className={`p-6 h-full overflow-auto space-y-6 ${
            prefersReducedMotion ? '' :
            greetingData.animationStyle === 'fade' ? 'animate-fade-in' : 
            greetingData.animationStyle === 'slide' ? 'animate-slide-in' :
            greetingData.animationStyle === 'zoom' ? 'animate-zoom-in' :
            'animate-bounce-in'
          }`}>
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
      {/* Edit Mode Toggle */}
      {showVisualEditor && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-background/90 backdrop-blur rounded-lg p-3 shadow-lg">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="sm"
            aria-label={translate('Back to editor')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {translate('Back to Editor')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="edit-mode" className="text-sm">
              {translate('Edit Mode')}
            </Label>
            <Switch
              id="edit-mode"
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
            />
            <Edit3 className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Background Elements - Emojis with Drag Support */}
      <AnimatePresence>
        {greetingData.emojis.map((emoji) => (
          <DraggableElement
            key={emoji.id}
            id={emoji.id}
            position={{ x: (emoji.position.x / 100) * containerSize.width, y: (emoji.position.y / 100) * containerSize.height }}
            onPositionChange={(id, pos) => handleElementPositionChange(id, { 
              x: (pos.x / containerSize.width) * 100, 
              y: (pos.y / containerSize.height) * 100 
            })}
            onDelete={handleElementDelete}
            isEditing={isEditMode}
            elementType="emoji"
            className="z-10"
          >
            <motion.div
              className="text-4xl pointer-events-none select-none"
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
                fontSize: `${Math.min(emoji.size, 3)}rem`,
              }}
              aria-hidden="true"
            >
              {emoji.emoji}
            </motion.div>
          </DraggableElement>
        ))}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative" ref={greetingRef}>
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
          <BorderAnimations borderSettings={greetingData.borderSettings} containerSize={containerSize} />
          
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

              {/* Text Messages with Drag Support */}
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
                          color: text.style.color,
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

              {/* Enhanced Media Gallery with New Layouts */}
              {greetingData.media.length > 0 && (
                <div className={mediaLayoutClasses}>
                  <AnimatePresence>
                    {greetingData.media
                      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                      .map((mediaItem, index) => {
                        const itemStyle = getMediaItemStyles(mediaItem, index);
                        
                        if (greetingData.layout === 'slideshow') {
                          return (
                            <motion.div
                              key={`${mediaItem.id}-${index}`}
                              className={`absolute inset-0 ${
                                index === 0 ? 'opacity-100' : 'opacity-0'
                              } transition-opacity duration-1000`}
                              style={itemStyle}
                              animate={{
                                opacity: [0, 1, 1, 0],
                              }}
                              transition={{
                                duration: 4,
                                delay: index * 4,
                                repeat: Infinity
                              }}
                            >
                              <MediaOverlay
                                mediaId={mediaItem.id}
                                mediaUrl={mediaItem.url}
                                mediaType={mediaItem.type}
                                textOverlays={mediaItem.textOverlays || []}
                                onTextOverlaysChange={handleMediaTextOverlaysChange}
                                size={mediaItem.position}
                                isEditing={isEditMode}
                              />
                            </motion.div>
                          );
                        }

                        return (
                          <DraggableElement
                            key={mediaItem.id}
                            id={mediaItem.id}
                            position={{ x: 0, y: 0 }}
                            onPositionChange={() => {}}
                            size={mediaItem.position}
                            onSizeChange={handleMediaSizeChange}
                            isEditing={isEditMode}
                            elementType="media"
                            className={cn(
                              `rounded-lg shadow-md overflow-hidden bg-card/20 transition-all duration-300`,
                              greetingData.layout === 'collage' ? 'absolute' : '',
                              greetingData.layout === 'carousel' ? 'snap-center flex-shrink-0' : ''
                            )}
                          >
                            <motion.div
                              style={itemStyle}
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
                              ) : (
                                <MediaOverlay
                                  mediaId={mediaItem.id}
                                  mediaUrl={mediaItem.url}
                                  mediaType={mediaItem.type}
                                  textOverlays={mediaItem.textOverlays || []}
                                  onTextOverlaysChange={handleMediaTextOverlaysChange}
                                  size={mediaItem.position}
                                  isEditing={isEditMode}
                                />
                              )}
                            </motion.div>
                          </DraggableElement>
                        );
                      })}
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
              </div>
            </div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
};

const MemoizedEnhancedPreview = React.memo(EnhancedPreview);
export default MemoizedEnhancedPreview;