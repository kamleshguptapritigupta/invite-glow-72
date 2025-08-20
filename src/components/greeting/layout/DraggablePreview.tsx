import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Move, RotateCw, ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react';
import { GreetingFormData, EventType, MediaItem, TextContent } from '@/types/greeting';
import { eventTypes } from '@/types/eventTypes';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { cn } from '@/lib/utils';
import DraggableElement from './DraggableElement';
import MediaLayoutRenderer from '../layout/MediaLayoutRenderer';

interface DraggablePreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  onDataChange?: (data: GreetingFormData) => void;
  className?: string;
  isEditing?: boolean;
}

const DraggablePreview = ({
  greetingData,
  selectedEvent,
  onDataChange,
  className,
  isEditing = true
}: DraggablePreviewProps) => {
  const navigate = useNavigate();
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

    // Update text position (if texts have positions in the future)
    const updatedTexts = greetingData.texts.map(text =>
      text.id === id ? { ...text, position } : text
    );

    onDataChange({
      ...greetingData,
      emojis: updatedEmojis,
      texts: updatedTexts
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

  // Handle media changes
  const handleMediaChange = useCallback((updatedMedia: MediaItem[]) => {
    if (!onDataChange) return;
    onDataChange({ ...greetingData, media: updatedMedia });
  }, [greetingData, onDataChange]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  // Background style
  const backgroundStyle = {
    backgroundColor: greetingData.backgroundSettings?.gradient.enabled 
      ? undefined 
      : greetingData.backgroundSettings?.color,
    background: greetingData.backgroundSettings?.gradient.enabled 
      ? `linear-gradient(${greetingData.backgroundSettings.gradient.direction}, ${greetingData.backgroundSettings.gradient.colors[0]}, ${greetingData.backgroundSettings.gradient.colors[1]})` 
      : undefined
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Editor Controls */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-50 flex flex-wrap gap-2 bg-background/80 backdrop-blur p-2 rounded-lg border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {translate('Back')}
          </Button>
          
          <div className="flex items-center gap-1 border-l pl-2 ml-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetZoom} className="h-8 px-2 text-xs">
              Reset
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="h-8"
          >
            {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Preview Container */}
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full min-h-screen transition-transform duration-200",
          showGrid && "bg-grid-sm bg-grid-slate-200/20",
          isDragging && "cursor-grabbing"
        )}
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          ...backgroundStyle
        }}
      >
        

        {/* Main Content Area */}
        <div className="relative p-8 md:p-16">
          <motion.div
            className={cn(
              "max-w-4xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden",
              currentEvent?.theme || 'card-custom'
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent className="p-8 md:p-12 relative">
              {/* Event Header */}
              <div className="text-center mb-8">
                <motion.div 
                  className="text-6xl md:text-8xl mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {currentEvent.emoji}
                </motion.div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentEvent.label}
                </h1>
                
                {greetingData.receiverName && (
                  <p className="text-xl md:text-2xl font-bold text-primary mb-6">
                    {greetingData.receiverName}
                  </p>
                )}
              </div>

              {/* Draggable Text Messages */}
              <div className="relative mb-8">
                {greetingData.texts.map((text, index) => (
              <DraggableElement
                key={text.id}
                id={text.id}
                position={{ x: 50, y: 50 + index * 100 }}
                onPositionChange={handlePositionChange}
                onDelete={handleDelete}
                onTextEdit={handleTextEdit}
                textContent={text.content}
                isEditing={isEditing}
                elementType="text"
                className="max-w-2xl"
              >
                    <div
                      className="bg-card/80 backdrop-blur p-6 rounded-lg shadow-lg border border-border/20"
                      style={{
                        fontSize: text.style.fontSize,
                        fontWeight: text.style.fontWeight,
                        color: text.style.color,
                        textAlign: text.style.textAlign,
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

              {/* Media Gallery with Enhanced Layouts */}
              {greetingData.media.length > 0 && (
                <div className="mb-8">
                  <MediaLayoutRenderer
                    media={greetingData.media}
                    layout={greetingData.layout}
                    isEditing={isEditing}
                    onMediaChange={handleMediaChange}
                    className="relative"
                  />
                </div>
              )}
            </CardContent>
          </motion.div>
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
                  x: emoji.animation.includes('float') ? [0, 20, 0] : 0,
                  y: emoji.animation.includes('float') ? [0, -30, 0] : 0,
                  rotate: emoji.animation.includes('spin') ? [0, 360] : 0
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ fontSize: `${emoji.size}rem` }}
              >
                {emoji.emoji}
              </motion.div>
            </DraggableElement>
          ))}
        </AnimatePresence>

        {/* Sender Name */}
        {greetingData.senderName && (
          <div className="absolute bottom-8 right-8 text-right">
            <p className="text-lg text-muted-foreground">
              {translate('From')}: <span className="font-semibold text-foreground">{greetingData.senderName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggablePreview;