import React, { useState, useCallback, useMemo } from 'react';
import { GreetingFormData, MediaItem } from '@/types/greeting'; 
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { Button } from '@/components/ui/button';
import { RefreshCw, Image, Video, AlertCircle, Heart, Star, Sparkles } from 'lucide-react';

interface Props {
  greetingData: GreetingFormData;
  isEditing?: boolean;
  onMediaChange?: (media: MediaItem[]) => void;
}

// Enhanced frame styles with better visual design
const frameStyles = {
  classic: 'border-8 border-white shadow-2xl rounded-lg',
  modern: 'border-2 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg',
  vintage: 'bg-amber-50 border-4 border-amber-200 shadow-xl rounded-sm relative before:absolute before:inset-2 before:border-2 before:border-amber-300',
  polaroid: 'bg-white p-6 pb-12 shadow-2xl transform rotate-2',
  film: 'border-6 border-gray-800 bg-black relative before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:bg-gray-800',
  elegant: 'border-4 border-gradient-to-r from-gold-400 to-gold-600 shadow-3xl rounded-2xl bg-gradient-to-b from-white to-gray-50',
  minimal: 'border border-gray-200 bg-white shadow-sm rounded-lg',
  artistic: 'bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-2xl rounded-3xl'
};

// Smooth animations
const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -5 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 5 }
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.7 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.7 }
  }
};

// Responsive layout styles
const layoutStyles = {
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  masonry: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]', // Masonry columns
  carousel: 'flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-hide',
  stack: 'flex flex-col gap-8 max-w-4xl mx-auto',
  collage: 'relative min-h-[600px] grid grid-cols-3 auto-rows-[200px] gap-2 [&>*:nth-child(2n)]:col-span-2 [&>*:nth-child(3n)]:row-span-2', 
  mosaic: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
  slideshow: 'relative w-full h-[500px] flex items-center justify-center overflow-hidden',
  polaroid: 'flex flex-wrap justify-center gap-8 [&>*]:bg-white [&>*]:shadow-xl [&>*]:p-2 [&>*]:rotate-1 hover:[&>*]:rotate-0 transition',
  magazine: 'grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto text-justify',
  gallery: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  timeline: 'flex flex-col gap-12 max-w-2xl mx-auto border-l-2 border-gray-300 pl-6',
  hexagon: 'grid grid-cols-3 gap-4 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]',
  circular: 'flex flex-wrap justify-center items-center gap-8 rounded-full',
  spiral: 'flex flex-col items-center justify-center gap-6 [transform:rotate(10deg)] [&>*:nth-child(even)]:translate-x-12',
  wave: 'flex flex-wrap justify-center items-center gap-8 [&>*:nth-child(odd)]:translate-y-4 [&>*:nth-child(even)]:-translate-y-4',

};

const EnhancedMediaGallery: React.FC<Props> = ({ greetingData, isEditing = false, onMediaChange }) => {
  const { translate } = useLanguageTranslation();
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const [loadedMedia, setLoadedMedia] = useState<Set<string>>(new Set());

  const handleError = useCallback((id: string) => {
    setMediaErrors(prev => ({ ...prev, [id]: true }));
  }, []);

  const handleLoad = useCallback((id: string) => {
    setLoadedMedia(prev => new Set(prev).add(id));
  }, []);

  const handleRetry = useCallback((id: string, url: string) => {
    const currentRetries = retryCount[id] || 0;
    if (currentRetries < 3) {
      setRetryCount(prev => ({ ...prev, [id]: currentRetries + 1 }));
      setMediaErrors(prev => ({ ...prev, [id]: false }));
      
      if (onMediaChange) {
        const updatedMedia = greetingData.media.map(item =>
          item.id === id ? { ...item, url: `${url}?t=${Date.now()}` } : item
        );
        onMediaChange(updatedMedia);
      }
    }
  }, [retryCount, greetingData.media, onMediaChange]);

  // Get layout class based on media count and selected layout
  const getLayoutClass = useMemo(() => {
    const { media, layout } = greetingData;
    
    if (media.length === 1) {
      return 'flex justify-center items-center'; // Single media centered
    }
    
    if (media.length <= 3 && !layout) {
      return 'flex flex-col sm:flex-row gap-6 justify-center items-center'; // Small count, no layout selected
    }
    
    return layoutStyles[layout as keyof typeof layoutStyles] || layoutStyles.grid;
  }, [greetingData.media.length, greetingData.layout]);

  const getFrameStyle = (index: number) => {
    const frames = Object.keys(frameStyles);
    const frameKey = frames[index % frames.length] as keyof typeof frameStyles;
    return frameStyles[frameKey];
  };

  const getCollagePosition = (index: number, total: number) => {
    const basePositions = [
      { top: '10%', left: '10%', rotate: '5deg', scale: 0.9 },
      { top: '15%', left: '60%', rotate: '-3deg', scale: 1.1 },
      { top: '50%', left: '20%', rotate: '2deg', scale: 0.95 },
      { top: '40%', left: '70%', rotate: '-5deg', scale: 1.05 },
      { top: '70%', left: '40%', rotate: '4deg', scale: 0.92 },
      { top: '20%', left: '35%', rotate: '-2deg', scale: 1.08 },
    ];
    
    return basePositions[index % basePositions.length];
  };

  const { media } = greetingData;
  const hasDesign = greetingData.layout && greetingData.layout !== 'grid';

  if (isEditing && media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <Image className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {translate('No media added yet')}
        </h3>
        <p className="text-gray-500 text-sm">
          {translate('Add some images or videos to make your greeting special')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 lg:p-8 transition-all duration-500",
      getLayoutClass,
      hasDesign && "bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-inner"
    )}>
      <AnimatePresence mode="popLayout">
        {media.map((mediaItem, index) => {
          const isCollage = greetingData.layout === 'collage';
          const collagePosition = isCollage ? getCollagePosition(index, media.length) : null;
          const frameClass = getFrameStyle(index);
          const animation = animationVariants[mediaItem.animation as keyof typeof animationVariants] || animationVariants.fadeIn;
          const isLoaded = loadedMedia.has(mediaItem.id);

          return (
            <motion.div
              key={mediaItem.id}
              className={cn(
                "group overflow-hidden transition-all duration-500 hover:scale-105",
                frameClass,
                isCollage && "absolute cursor-pointer",
                media.length === 1 && "max-w-2xl mx-auto", // Center single media
                !hasDesign && "shadow-lg hover:shadow-2xl" // Enhanced shadow when no design
              )}
              style={isCollage && collagePosition ? {
                top: collagePosition.top,
                left: collagePosition.left,
                width: mediaItem.position?.width || 280,
                height: mediaItem.position?.height || 220,
                transform: `rotate(${collagePosition.rotate}) scale(${collagePosition.scale})`,
                zIndex: mediaItem.priority || index
              } : {
                width: mediaItem.position?.width || 'auto',
                height: mediaItem.position?.height || 'auto'
              }}
              variants={animation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ 
                scale: isCollage ? 1.15 : 1.05, 
                zIndex: 50,
                rotate: isCollage ? '0deg' : '0deg'
              }}
              layout
            >
              {mediaErrors[mediaItem.id] ? (
                <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-6">
                  <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
                  <p className="text-red-600 text-sm font-medium mb-3 text-center">
                    {translate('Failed to load media')}
                  </p>
                  <Button
                    onClick={() => handleRetry(mediaItem.id, mediaItem.url)}
                    disabled={(retryCount[mediaItem.id] || 0) >= 3}
                    size="sm"
                    variant="outline"
                    className="h-8 px-4 text-xs border-red-300 hover:bg-red-50 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    {(retryCount[mediaItem.id] || 0) >= 3 ? 'Max retries' : 'Try again'}
                  </Button>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg">
                  {/* Loading skeleton */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
                  )}

                  {mediaItem.type === 'image' ? (
                    <>
                      <motion.img
                        src={mediaItem.url}
                        alt={`Greeting media ${index + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        style={{ opacity: isLoaded ? 1 : 0 }}
                        onError={() => handleError(mediaItem.id)}
                        onLoad={() => handleLoad(mediaItem.id)}
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <Image className="h-4 w-4 text-blue-600" />
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
                        onLoadedData={() => handleLoad(mediaItem.id)}
                        style={{ opacity: isLoaded ? 1 : 0 }}
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <Video className="h-4 w-4 text-red-600" />
                      </div>
                    </>
                  )}
                  
                  {/* Enhanced overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Decorative elements based on frame style */}
                  {frameClass.includes('vintage') && (
                    <div className="absolute inset-0 border-2 border-amber-300/50 rounded-lg" />
                  )}
                  
                  {frameClass.includes('elegant') && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-gold-200/20 to-gold-400/10 rounded-3xl" />
                  )}
                  
                  {/* Polaroid label with better styling */}
                  {frameClass.includes('polaroid') && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-sm text-gray-700 font-handwriting bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center border border-gray-200">
                        📸 Memory #{index + 1}
                      </div>
                    </div>
                  )}

                  {/* Favorite indicator */}
                  {mediaItem.priority && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-1">
                      <Heart className="h-3 w-3 text-red-500 fill-current" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Layout indicator badge */}
      {hasDesign && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200">
          {greetingData.layout} layout
        </div>
      )}
    </div>
  );
};

export default EnhancedMediaGallery;