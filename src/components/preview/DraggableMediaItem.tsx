import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Resizable } from 'react-resizable';
import { MediaItem } from '@/types/greeting';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Move, Trash2, Settings, Type, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DraggableMediaItemProps {
  mediaItem: MediaItem;
  index: number;
  isEditing: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onDelete: (id: string) => void;
  onTextOverlayChange?: (id: string, overlays: any[]) => void;
}

const DraggableMediaItem: React.FC<DraggableMediaItemProps> = ({
  mediaItem,
  index,
  isEditing,
  onPositionChange,
  onSizeChange,
  onDelete,
  onTextOverlayChange
}) => {
  const [showControls, setShowControls] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textOverlays, setTextOverlays] = useState(mediaItem.textOverlays || []);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    onPositionChange(mediaItem.id, { x: data.x, y: data.y });
  };

  const handleResize = (e: any, { size }: { size: { width: number; height: number } }) => {
    onSizeChange(mediaItem.id, size);
  };

  const addTextOverlay = () => {
    const newOverlay = {
      id: Date.now().toString(),
      content: 'New Text',
      position: { x: 10, y: 10 },
      style: {
        fontSize: '16px',
        color: '#ffffff',
        fontWeight: 'normal',
        textAlign: 'center' as const,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '8px 12px',
        borderRadius: '4px'
      }
    };
    const updated = [...textOverlays, newOverlay];
    setTextOverlays(updated);
    if (onTextOverlayChange) {
      onTextOverlayChange(mediaItem.id, updated);
    }
  };

  const updateTextOverlay = (overlayId: string, field: string, value: any) => {
    const updated = textOverlays.map(overlay =>
      overlay.id === overlayId 
        ? field === 'style' 
          ? { ...overlay, style: { ...overlay.style, ...value } }
          : { ...overlay, [field]: value }
        : overlay
    );
    setTextOverlays(updated);
    if (onTextOverlayChange) {
      onTextOverlayChange(mediaItem.id, updated);
    }
  };

  const removeTextOverlay = (overlayId: string) => {
    const updated = textOverlays.filter(overlay => overlay.id !== overlayId);
    setTextOverlays(updated);
    if (onTextOverlayChange) {
      onTextOverlayChange(mediaItem.id, updated);
    }
  };

  const MediaContent = (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {mediaItem.type === 'image' ? (
        <img
          src={mediaItem.url}
          alt={`Media ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <video
          src={mediaItem.url}
          className="w-full h-full object-cover"
          controls
          muted
          playsInline
          draggable={false}
        />
      )}
      
      {/* Text Overlays */}
      {textOverlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute pointer-events-none"
          style={{
            left: `${overlay.position.x}%`,
            top: `${overlay.position.y}%`,
            ...overlay.style
          }}
        >
          {overlay.content}
        </div>
      ))}
    </div>
  );

  if (!isEditing) {
    return (
      <motion.div
        className="overflow-hidden rounded-lg shadow-lg"
        style={{
          width: mediaItem.position?.width || 300,
          height: mediaItem.position?.height || 200
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {MediaContent}
      </motion.div>
    );
  }

  return (
    <Draggable
      position={{ x: mediaItem.position?.x || 0, y: mediaItem.position?.y || 0 }}
      onDrag={handleDrag}
      disabled={!isEditing}
      nodeRef={dragRef}
      bounds="parent"
      handle=".drag-handle"
    >
      <div ref={dragRef} className="absolute">
        <Resizable
          width={mediaItem.position?.width || 300}
          height={mediaItem.position?.height || 200}
          onResize={handleResize}
          minConstraints={[100, 100]}
          maxConstraints={[800, 600]}
          resizeHandles={['se']}
        >
          <div
            className={cn(
              "group relative border-2 border-dashed border-transparent hover:border-primary transition-all",
              showControls && "border-primary"
            )}
            style={{
              width: mediaItem.position?.width || 300,
              height: mediaItem.position?.height || 200
            }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {MediaContent}
            
            {/* Controls */}
            {showControls && (
              <div className="absolute -top-12 left-0 flex gap-1 z-50">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 drag-handle bg-primary/90 hover:bg-primary cursor-move"
                >
                  <Move className="h-3 w-3 text-white" />
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                  onClick={() => setShowTextEditor(true)}
                >
                  <Type className="h-3 w-3 text-white" />
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                  onClick={() => onDelete(mediaItem.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {/* Resize handle indicator */}
            {showControls && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary/20 border-2 border-primary rounded-tl-lg cursor-se-resize">
                <Maximize2 className="h-2 w-2 text-primary" />
              </div>
            )}
          </div>
        </Resizable>
        
        {/* Text Editor Modal */}
        {showTextEditor && (
          <Card className="absolute top-0 left-0 z-50 w-80 max-h-96 overflow-y-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Text Overlays</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addTextOverlay}>
                    <Type className="h-3 w-3 mr-1" />
                    Add Text
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTextEditor(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {textOverlays.map((overlay, idx) => (
                  <Card key={overlay.id} className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Text {idx + 1}</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTextOverlay(overlay.id)}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Textarea
                        value={overlay.content}
                        onChange={(e) => updateTextOverlay(overlay.id, 'content', e.target.value)}
                        className="h-16 text-xs resize-none"
                        placeholder="Enter text..."
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">X Position (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overlay.position.x}
                            onChange={(e) => updateTextOverlay(overlay.id, 'position', { x: parseInt(e.target.value) || 0 })}
                            className="h-6 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y Position (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overlay.position.y}
                            onChange={(e) => updateTextOverlay(overlay.id, 'position', { y: parseInt(e.target.value) || 0 })}
                            className="h-6 text-xs"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Font Size</Label>
                          <Input
                            value={overlay.style.fontSize}
                            onChange={(e) => updateTextOverlay(overlay.id, 'style', { fontSize: e.target.value })}
                            className="h-6 text-xs"
                            placeholder="16px"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <Input
                            type="color"
                            value={overlay.style.color}
                            onChange={(e) => updateTextOverlay(overlay.id, 'style', { color: e.target.value })}
                            className="h-6 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Draggable>
  );
};

export default DraggableMediaItem;