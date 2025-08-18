import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Move, RotateCw, ZoomIn, ZoomOut, Eye, EyeOff, Grid3X3 } from 'lucide-react';
import { GreetingFormData, EventType, MediaItem, TextContent } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { cn } from '@/lib/utils';
import ShareActions from '@/components/share/ShareActions';
import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EmojisLayer from './EmojisLayer';
import EventHeader from './EventHeader';
import GreetingTexts from './GreetingTexts';
import SenderSection from './SenderSection';
import DraggableMediaItem from './DraggableMediaItem';
import DraggableElement from '../greeting/layout/DraggableElement';

interface EnhancedPreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  onDataChange?: (data: GreetingFormData) => void;
  className?: string;
  showVisualEditor?: boolean;
  isEditing?: boolean;
}

const EnhancedPreview: React.FC<EnhancedPreviewProps> = ({
  greetingData,
  selectedEvent,
  onDataChange,
  className,
  showVisualEditor = false,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();
  
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(isEditing);
  const [isDragging, setIsDragging] = useState(false);

  // Get current event
  const currentEvent = selectedEvent || eventTypes.find(e => e.value === greetingData.eventType) || {
    value: 'custom',
    emoji: '🎉',
    label: 'Custom Event',
    defaultMessage: 'Celebration!',
    theme: 'card-custom',
    category: 'custom'
  };

  // Handle element position changes
  const handlePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;

    // Update emoji position
    const updatedEmojis = greetingData.emojis.map(emoji =>
      emoji.id === id ? { ...emoji, position } : emoji
    );

    // Update text position (if texts have positions)
    const updatedTexts = greetingData.texts.map(text =>
      text.id === id ? { ...text, position } : text
    );

    onDataChange({
      ...greetingData,
      emojis: updatedEmojis,
      texts: updatedTexts
    });
  }, [greetingData, onDataChange]);

  // Handle media position changes
  const handleMediaPositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;

    const updatedMedia = greetingData.media.map(media =>
      media.id === id ? { ...media, position: { ...media.position, ...position } } : media
    );

    onDataChange({
      ...greetingData,
      media: updatedMedia
    });
  }, [greetingData, onDataChange]);

  // Handle media size changes
  const handleMediaSizeChange = useCallback((id: string, size: { width: number; height: number }) => {
    if (!onDataChange) return;

    const updatedMedia = greetingData.media.map(media =>
      media.id === id ? { ...media, position: { ...media.position, ...size } } : media
    );

    onDataChange({
      ...greetingData,
      media: updatedMedia
    });
  }, [greetingData, onDataChange]);

  // Handle element deletion
  const handleDelete = useCallback((id: string) => {
    if (!onDataChange) return;

    const updatedEmojis = greetingData.emojis.filter(emoji => emoji.id !== id);
    const updatedTexts = greetingData.texts.filter(text => text.id !== id);
    const updatedMedia = greetingData.media.filter(media => media.id !== id);

    onDataChange({
      ...greetingData,
      emojis: updatedEmojis,
      texts: updatedTexts,
      media: updatedMedia
    });
  }, [greetingData, onDataChange]);

  // Handle text editing
  const handleTextEdit = useCallback((id: string, content: string) => {
    if (!onDataChange) return;

    const updatedTexts = greetingData.texts.map(text =>
      text.id === id ? { ...text, content } : text
    );

    onDataChange({
      ...greetingData,
      texts: updatedTexts
    });
  }, [greetingData, onDataChange]);

  // Handle text overlay changes
  const handleTextOverlayChange = useCallback((mediaId: string, overlays: any[]) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === mediaId ? { ...item, textOverlays: overlays } : item
    );
    
    onDataChange({
      ...greetingData,
      media: updatedMedia
    });
  }, [greetingData, onDataChange]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <BackgroundWrapper greetingData={greetingData} className={className}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Editor Controls */}
        {isEditing && (
          <div className="absolute top-4 left-4 z-50 flex flex-wrap gap-2 bg-background/90 backdrop-blur-sm p-3 rounded-xl border shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-8 px-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {translate('Back')}
            </Button>
            
            <div className="flex items-center gap-1 border-l pl-2 ml-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs px-2 min-w-[3rem] text-center font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetZoom} 
                className="h-8 px-2 text-xs"
                disabled={zoom === 1}
              >
                <RotateCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={cn("h-8 px-3", showGrid && "bg-primary/10 text-primary")}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </Button>
          </div>
        )}

        {/* Preview Container */}
        <div 
          ref={containerRef}
          className={cn(
            "relative w-full min-h-screen transition-transform duration-200 origin-top-left",
            showGrid && "bg-[linear-gradient(rgba(0,0,0,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.1)_1px,transparent_1px)] bg-[size:20px_20px]",
            isDragging && "cursor-grabbing"
          )}
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top left'
          }}
        >
          <div className="max-w-4xl mx-auto relative" ref={greetingRef}>
            <BorderContainer greetingData={greetingData} selectedEvent={selectedEvent}>
              <div className="space-y-8 relative">
                <EventHeader greetingData={greetingData} selectedEvent={selectedEvent} />
                
                {/* Draggable Text Messages */}
                <div className="relative min-h-[200px]">
                  {greetingData.texts.map((text, index) => (
                    <DraggableElement
                      key={text.id}
                      id={text.id}
                      position={text.position || { x: 50, y: 50 + index * 100 }}
                      onPositionChange={handlePositionChange}
                      onDelete={handleDelete}
                      onTextEdit={handleTextEdit}
                      textContent={text.content}
                      isEditing={isEditing}
                      elementType="text"
                      className="max-w-2xl"
                    >
                      <div
                        className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300"
                        style={{
                          fontSize: text.style?.fontSize || '16px',
                          fontWeight: text.style?.fontWeight || 'normal',
                          color: text.style?.color || 'inherit',
                          textAlign: text.style?.textAlign || 'center',
                          minHeight: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {text.content}
                      </div>
                    </DraggableElement>
                  ))}
                </div>

                {/* Draggable Media Items */}
                {greetingData.media.length > 0 && (
                  <div className="relative min-h-[400px]">
                    {greetingData.media.map((mediaItem, index) => (
                      <DraggableMediaItem
                        key={mediaItem.id}
                        mediaItem={mediaItem}
                        index={index}
                        isEditing={isEditing}
                        onPositionChange={handleMediaPositionChange}
                        onSizeChange={handleMediaSizeChange}
                        onDelete={handleDelete}
                        onTextOverlayChange={handleTextOverlayChange}
                      />
                    ))}
                  </div>
                )}

                <SenderSection greetingData={greetingData} />
                
                {showVisualEditor && (
                  <div className="flex flex-col items-center gap-4 m-4">
                    <ShareActions 
                      greetingData={greetingData} 
                      greetingRef={greetingRef} 
                      selectedEvent={selectedEvent} 
                    />
                  </div>
                )}
              </div>
            </BorderContainer>
          </div>

          {/* Draggable Background Emojis */}
          <AnimatePresence>
            {greetingData.emojis.map((emoji) => (
              <DraggableElement
                key={emoji.id}
                id={emoji.id}
                position={emoji.position}
                onPositionChange={handlePositionChange}
                onDelete={handleDelete}
                isEditing={isEditing}
                elementType="emoji"
                className="pointer-events-none z-0"
              >
                <motion.div
                  className="text-4xl md:text-6xl opacity-80 select-none pointer-events-none"
                  animate={isEditing ? {} : {
                    x: emoji.animation?.includes('float') ? [0, 20, 0] : 0,
                    y: emoji.animation?.includes('float') ? [0, -30, 0] : 0,
                    rotate: emoji.animation?.includes('spin') ? [0, 360] : 0
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ fontSize: `${emoji.size}px` }}
                >
                  {emoji.emoji}
                </motion.div>
              </DraggableElement>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default EnhancedPreview;