import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EventType } from '@/types/greeting';
import CustomEventSelector from './CustomEventSelector';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';

interface BasicDetailsFormProps {
  eventType: string;
  senderName: string;
  receiverName: string;
  customEvent: EventType | null;
  onEventChange: (eventType: string) => void;
  onInputChange: (field: string, value: string) => void;
  onCustomEventCreate: (event: EventType) => void;
}

const BasicDetailsForm = ({
  eventType,
  senderName,
  receiverName,
  customEvent,
  onEventChange,
  onInputChange,
  onCustomEventCreate
}: BasicDetailsFormProps) => {
  const { translate } = useLanguageTranslation();

  return (
    <>
      {/* Custom Event Selector */}
      <CustomEventSelector
        selectedEvent={eventType}
        customEvent={customEvent}
        onEventChange={onEventChange}
        onCustomEventCreate={onCustomEventCreate}
      />

      <Separator />

      {/* Names */}
      <div className="grid md:grid-cols-2 gap-4 p-6 border border-green-300 rounded-xl shadow-lg">
        <div className="space-y-2">
          <Label htmlFor="senderName">{translate('Your Name')} ({translate('optional')})</Label>
          <Input
            id="senderName"
            value={senderName}
            onChange={(e) => onInputChange('senderName', e.target.value)}
            placeholder={translate('Your name')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receiverName">{translate('Receiver\'s Name')} ({translate('optional')})</Label>
          <Input
            id="receiverName"
            value={receiverName}
            onChange={(e) => onInputChange('receiverName', e.target.value)}
            placeholder={translate('Recipient\'s name')}
          />
        </div>
      </div>
    </>
  );
};

export default BasicDetailsForm;