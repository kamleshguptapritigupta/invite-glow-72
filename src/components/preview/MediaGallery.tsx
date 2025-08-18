import React, { useState } from 'react';
import { GreetingFormData, MediaItem } from '@/types/greeting';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';

interface Props {
  greetingData: GreetingFormData;
}

const MediaGallery: React.FC<Props> = ({ greetingData }) => {
  const { translate } = useLanguageTranslation();
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});

  const handleError = (id: string) => setMediaErrors(prev => ({ ...prev, [id]: true }));

  if (greetingData.media.length === 0) return null;

  return (
    <div className="gap-4 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {greetingData.media.map((mediaItem, index) => (
          <motion.div
            key={mediaItem.id}
            className={cn("rounded-lg shadow-md overflow-hidden bg-card/20 transition-all")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {mediaErrors[mediaItem.id] ? (
              <div className="flex items-center justify-center h-40 bg-destructive/10">
                <p className="text-destructive">{translate('Media failed to load')}</p>
              </div>
            ) : mediaItem.type === 'image' ? (
              <img src={mediaItem.url} alt="Greeting" className="w-full h-auto object-cover" onError={() => handleError(mediaItem.id)} />
            ) : (
              <video src={mediaItem.url} className="w-full h-auto object-cover" controls muted playsInline onError={() => handleError(mediaItem.id)} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;
