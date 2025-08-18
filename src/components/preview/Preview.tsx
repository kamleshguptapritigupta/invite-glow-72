import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { cn } from '@/lib/utils';
import ShareActions from '@/components/share/ShareActions';
import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EmojisLayer from './EmojisLayer';
import EventHeader from './EventHeader';
import GreetingTexts from './GreetingTexts';
import EnhancedMediaGallery from './EnhancedMediaGallery';
import SenderSection from './SenderSection';

interface PreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  className?: string;
  showVisualEditor?: boolean;
  isCompact?: boolean;
}

const Preview = ({ greetingData, selectedEvent, className, showVisualEditor, isCompact = false }: PreviewProps) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();

  return (
    <BackgroundWrapper greetingData={greetingData} className={className}>
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

        <BorderContainer greetingData={greetingData} selectedEvent={selectedEvent}>
          <div className="space-y-8">
            <EventHeader greetingData={greetingData} selectedEvent={selectedEvent} />
            <GreetingTexts greetingData={greetingData} />
            <EnhancedMediaGallery greetingData={greetingData} />
            <SenderSection greetingData={greetingData} />
            <div className="flex flex-col items-center gap-4 m-4">
              <ShareActions greetingData={greetingData} greetingRef={greetingRef} selectedEvent={selectedEvent} />
            </div>
          </div>
        </BorderContainer>

        <EmojisLayer emojis={greetingData.emojis} />
      </div>
    </BackgroundWrapper>
  );
};

export default React.memo(Preview);
