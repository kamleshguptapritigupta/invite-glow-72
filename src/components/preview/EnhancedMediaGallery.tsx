import React, { useState, useCallback } from 'react';
import { GreetingFormData, MediaItem } from '@/types/greeting';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { Button } from '@/components/ui/button';
import { RefreshCw, Image, Video, AlertCircle } from 'lucide-react';

interface Props {
  greetingData: GreetingFormData;
  isEditing?: boolean;
  onMediaChange?: (media: MediaItem[]) => void;
}

const frameStyles = {
  classic: 'border-8 border-white shadow-2xl',
  modern: 'border-2 border-gradient-to-r from-primary to-secondary rounded-xl',
  vintage: 'border-12 border-amber-100 shadow-xl rounded-sm relative before:absolute before:inset-2 before:border before:border-amber-300',
  polaroid: 'bg-white p-4 pb-8 shadow-xl transform rotate-1',
  film: 'border-4 border-black relative before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:bg-black before:border-l-4 before:border-r-4 before:border-white',
  elegant: 'border-4 border-gold shadow-2xl rounded-lg bg-gradient-to-b from-white to-gray-50',
};

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.5 }
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 }
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { opacity: 0, scale: 0.3 }
  }
};

const layoutStyles = {
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  masonry: 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6',
  carousel: 'flex overflow-x-auto snap-x snap-mandatory space-x-6 pb-4',
  stack: 'flex flex-col space-y-8',
  collage: 'relative min-h-[500px]',
  mosaic: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
};

const EnhancedMediaGallery: React.FC<Props> = ({ greetingData, isEditing = false, onMediaChange }) => {
  const { translate } = useLanguageTranslation();
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  const handleError = useCallback((id: string) => {
    setMediaErrors(prev => ({ ...prev, [id]: true }));
  }, []);

  const handleRetry = useCallback((id: string, url: string) => {
    const currentRetries = retryCount[id] || 0;
    if (currentRetries < 3) {
      setRetryCount(prev => ({ ...prev, [id]: currentRetries + 1 }));
      setMediaErrors(prev => ({ ...prev, [id]: false }));
      
      // Force reload by adding timestamp
      if (onMediaChange) {
        const updatedMedia = greetingData.media.map(item =>
          item.id === id ? { ...item, url: `${url}?t=${Date.now()}` } : item
        );
        onMediaChange(updatedMedia);
      }
    }
  }, [retryCount, greetingData.media, onMediaChange]);

  const getLayoutClass = () => {
    return layoutStyles[greetingData.layout as keyof typeof layoutStyles] || layoutStyles.grid;
  };

  const getFrameStyle = (index: number) => {
    const frames = Object.keys(frameStyles);
    const frameKey = frames[index % frames.length] as keyof typeof frameStyles;
    return frameStyles[frameKey];
  };

  const getCollagePosition = (index: number) => {
    const positions = [
      { top: '10%', left: '10%', rotate: '5deg' },
      { top: '20%', left: '60%', rotate: '-3deg' },
      { top: '50%', left: '20%', rotate: '2deg' },
      { top: '40%', left: '70%', rotate: '-5deg' },
      { top: '70%', left: '40%', rotate: '4deg' },
      { top: '15%', left: '35%', rotate: '-2deg' },
    ];
    return positions[index % positions.length];
  };

  if (greetingData.media.length === 0) return null;

  return (
    <div className={cn("p-6", getLayoutClass())}>
      <AnimatePresence mode="wait">
        {greetingData.media.map((mediaItem, index) => {
          const isCollage = greetingData.layout === 'collage';
          const position = isCollage ? getCollagePosition(index) : {};
          const frameClass = getFrameStyle(index);
          const animation = animationVariants[mediaItem.animation as keyof typeof animationVariants] || animationVariants.fadeIn;

          return (
            <motion.div
              key={mediaItem.id}
              className={cn(
                "group overflow-hidden transition-all duration-300 hover:scale-105",
                frameClass,
                isCollage && "absolute max-w-xs"
              )}
              style={isCollage ? {
                ...position,
                width: mediaItem.position?.width || 300,
                height: mediaItem.position?.height || 200,
                transform: `rotate(${position.rotate}) translateZ(0)`,
                zIndex: mediaItem.priority || index
              } : {
                width: mediaItem.position?.width || 'auto',
                height: mediaItem.position?.height || 'auto'
              }}
              variants={animation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, zIndex: 50 }}
            >
              {mediaErrors[mediaItem.id] ? (
                <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
                  <p className="text-red-600 text-sm font-medium mb-2">
                    {translate('Media failed to load')}
                  </p>
                  <Button
                    onClick={() => handleRetry(mediaItem.id, mediaItem.url)}
                    disabled={(retryCount[mediaItem.id] || 0) >= 3}
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-red-300 hover:bg-red-50"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {(retryCount[mediaItem.id] || 0) >= 3 ? 'Max retries' : 'Retry'}
                  </Button>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg">
                  {mediaItem.type === 'image' ? (
                    <>
                      <motion.img
                        src={mediaItem.url}
                        alt={`Greeting media ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleError(mediaItem.id)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Image className="h-4 w-4 text-primary" />
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.video
                        src={mediaItem.url}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        playsInline
                        onError={() => handleError(mediaItem.id)}
                        whileHover={{ scale: 1.02 }}
                      />
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Video className="h-4 w-4 text-primary" />
                      </div>
                    </>
                  )}
                  
                  {/* Media overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Frame decorations for vintage style */}
                  {frameClass.includes('vintage') && (
                    <>
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-amber-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-amber-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-amber-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-amber-400" />
                    </>
                  )}
                  
                  {/* Polaroid label */}
                  {frameClass.includes('polaroid') && (
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <div className="text-xs text-gray-600 font-handwriting">
                        Memory #{index + 1}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedMediaGallery;