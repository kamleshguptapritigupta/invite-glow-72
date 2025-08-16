import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventType } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import CustomEventSelector from '../CustomEventSelector';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { Users, Calendar, Sparkles } from 'lucide-react';

interface EnhancedBasicDetailsFormProps {
  eventType: string;
  senderName: string;
  receiverName: string;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: string) => void;
  onCustomEventCreate: (event: EventType) => void;
}

const EnhancedBasicDetailsForm = ({
  eventType,
  senderName,
  receiverName,
  customEvent,
  onEventChange,
  onInputChange,
  onCustomEventCreate
}: EnhancedBasicDetailsFormProps) => {
  const { translate } = useLanguageTranslation();

  // Group events by category for better organization
  const groupedEvents = eventTypes.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, EventType[]>);

  const categoryLabels = {
    birthday: '🎂 Birthday',
    religious: '🕯️ Religious',
    national: '🏛️ National',
    seasonal: '🌾 Seasonal',
    special: '✨ Special Days',
    personal: '💝 Personal'
  };

  const handleCustomEventCreation = (newEvent: EventType) => {
    // Store custom event data in form data
    onInputChange('customEventName', newEvent.label);
    onInputChange('customEventEmoji', newEvent.emoji);
    onCustomEventCreate(newEvent);
  };

  return (
    <Card className="border border-blue-300 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          {translate('Basic Details')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Type Selection */}
        <div className="space-y-3">
          <Label htmlFor="event-type" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {translate('Event Type')} *
          </Label>
          <div className="grid gap-3">
            <Select value={eventType} onValueChange={onEventChange}>
              <SelectTrigger>
                <SelectValue placeholder={translate('Choose an event type')} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(groupedEvents).map(([category, events]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b">
                      {categoryLabels[category as keyof typeof categoryLabels] || category}
                    </div>
                    {events.map((event) => (
                      <SelectItem key={event.value} value={event.value} className="pl-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.emoji}</span>
                          <span>{event.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            
            {/* Custom Event Creator */}
            <CustomEventSelector onCustomEventCreate={handleCustomEventCreation} />
            
            {/* Show custom event details if selected */}
            {eventType === 'custom' && customEvent && (
              <div className="p-3 bg-primary/5 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{customEvent.emoji}</span>
                  <span className="font-medium">{customEvent.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {translate('Custom')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {customEvent.defaultMessage}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sender Name */}
        <div className="space-y-2">
          <Label htmlFor="sender-name" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {translate('Your Name')}
          </Label>
          <Input
            id="sender-name"
            value={senderName}
            onChange={(e) => onInputChange('senderName', e.target.value)}
            placeholder={translate('Enter your name')}
            className="w-full"
          />
        </div>

        {/* Receiver Name */}
        <div className="space-y-2">
          <Label htmlFor="receiver-name" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {translate('Recipient Name')} *
          </Label>
          <Input
            id="receiver-name"
            value={receiverName}
            onChange={(e) => onInputChange('receiverName', e.target.value)}
            placeholder={translate('Who is this greeting for?')}
            className="w-full"
            required
          />
        </div>

        {/* Event Preview */}
        {eventType && (
          <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              {translate('Preview')}:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {eventType === 'custom' && customEvent ? customEvent.emoji : 
                 eventTypes.find(e => e.value === eventType)?.emoji || '🎉'}
              </span>
              <div>
                <div className="font-medium">
                  {eventType === 'custom' && customEvent ? customEvent.label :
                   eventTypes.find(e => e.value === eventType)?.label || 'Event'}
                </div>
                {receiverName && (
                  <div className="text-sm text-primary font-medium">
                    {translate('For')} {receiverName}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedBasicDetailsForm;