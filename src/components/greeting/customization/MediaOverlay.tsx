import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Type, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdvancedTextEditor from '../contentEditor/textEditor/AdvancedTextEditor';
import { TextContent } from '@/types/greeting';

interface TextOverlay {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
}

interface MediaOverlayProps {
  mediaId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  textOverlays: TextOverlay[];
  onTextOverlaysChange: (mediaId: string, overlays: TextOverlay[]) => void;
  size: { width: number; height: number };
  isEditing: boolean;
}

const MediaOverlay = ({
  mediaId,
  mediaUrl,
  mediaType,
  textOverlays,
  onTextOverlaysChange,
  size,
  isEditing
}: MediaOverlayProps) => {
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);

  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      content: 'New Text',
      position: { x: 50, y: 50 },
      style: {
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#ffffff',
        textAlign: 'center'
      }
    };
    
    onTextOverlaysChange(mediaId, [...textOverlays, newOverlay]);
  };

  const updateTextOverlay = (overlayId: string, updates: Partial<TextOverlay>) => {
    const updatedOverlays = textOverlays.map(overlay =>
      overlay.id === overlayId ? { ...overlay, ...updates } : overlay
    );
    onTextOverlaysChange(mediaId, updatedOverlays);
  };

  const removeTextOverlay = (overlayId: string) => {
    const filteredOverlays = textOverlays.filter(overlay => overlay.id !== overlayId);
    onTextOverlaysChange(mediaId, filteredOverlays);
  };

  const handleTextChange = (texts: TextContent[]) => {
    if (selectedOverlay && texts.length > 0) {
      const textData = texts[0];
      updateTextOverlay(selectedOverlay, {
        content: textData.content,
        style: textData.style
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Media Content */}
      {mediaType === 'image' ? (
        <img
          src={mediaUrl}
          alt="Media content"
          className="w-full h-full object-cover rounded-lg"
          style={{ width: size.width, height: size.height }}
        />
      ) : (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover rounded-lg"
          controls
          muted
          style={{ width: size.width, height: size.height }}
        />
      )}

      {/* Text Overlays */}
      {textOverlays.map((overlay) => (
        <div
          key={overlay.id}
          className={cn(
            "absolute pointer-events-none select-none",
            isEditing && "pointer-events-auto cursor-move border border-dashed border-white/50"
          )}
          style={{
            left: `${overlay.position.x}%`,
            top: `${overlay.position.y}%`,
            ...overlay.style,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            maxWidth: '80%',
            zIndex: 10
          }}
          onClick={() => isEditing && setSelectedOverlay(overlay.id)}
        >
          {overlay.content}
          
          {/* Overlay Controls */}
          {isEditing && selectedOverlay === overlay.id && (
            <div className="absolute -top-8 -right-8 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0 bg-blue-500 hover:bg-blue-600"
                onClick={() => setShowTextEditor(true)}
              >
                <Type className="h-3 w-3 text-white" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-6 w-6 p-0"
                onClick={() => removeTextOverlay(overlay.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Add Text Button */}
      {isEditing && textOverlays.length < 2 && (
        <Button
          onClick={addTextOverlay}
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-primary/80 hover:bg-primary"
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}

      {/* Text Editor Modal */}
      {showTextEditor && selectedOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-[80vh] overflow-auto">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Edit Text Overlay</h3>
              
              <AdvancedTextEditor
                texts={[{
                  id: selectedOverlay,
                  content: textOverlays.find(o => o.id === selectedOverlay)?.content || '',
                  style: textOverlays.find(o => o.id === selectedOverlay)?.style || {
                    fontSize: '16px',
                    fontWeight: 'normal',
                    color: '#ffffff',
                    textAlign: 'center'
                  },
                  animation: 'fade'
                }]}
                onChange={handleTextChange}
              />
              
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setShowTextEditor(false)}>
                  Done
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowTextEditor(false);
                    setSelectedOverlay(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MediaOverlay;