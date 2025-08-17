import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Move, Trash2, Settings, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableElementProps {
  id: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete?: (id: string) => void;
  isEditing: boolean;
  className?: string;
  elementType: 'text' | 'emoji' | 'media';
  size?: { width: number; height: number };
  onSizeChange?: (id: string, size: { width: number; height: number }) => void;
  onTextEdit?: (id: string, content: string) => void;
  textContent?: string;
}

const DraggableElement = ({
  id,
  children,
  position,
  onPositionChange,
  onDelete,
  isEditing,
  className,
  elementType,
  size,
  onSizeChange,
  onTextEdit,
  textContent
}: DraggableElementProps) => {
  const [showControls, setShowControls] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingContent, setEditingContent] = useState(textContent || '');
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    onPositionChange(id, { x: data.x, y: data.y });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (onSizeChange && size) {
      onSizeChange(id, {
        ...size,
        [dimension]: Math.max(50, Math.min(800, value))
      });
    }
  };

  const handleTextSave = () => {
    if (onTextEdit) {
      onTextEdit(id, editingContent);
    }
    setIsEditingText(false);
  };

  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      disabled={!isEditing}
      nodeRef={dragRef}
      bounds="parent"
      handle=".drag-handle"
    >
      <div
        ref={dragRef}
        className={cn(
          "absolute group",
          isEditing ? "cursor-move" : "cursor-default",
          className
        )}
        style={{
          width: size?.width || 'auto',
          height: size?.height || 'auto'
        }}
        onMouseEnter={() => isEditing && setShowControls(true)}
        onMouseLeave={() => isEditing && setShowControls(false)}
      >
        {/* Element Content */}
        <div 
          className={cn(
            "w-full h-full",
            isEditing && "border-2 border-dashed border-primary/30 hover:border-primary"
          )}
        >
          {children}
        </div>

        {/* Editing Controls */}
        {isEditing && showControls && (
          <div className="absolute -top-12 left-0 flex gap-1 z-50">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 drag-handle bg-primary/90 hover:bg-primary"
            >
              <Move className="h-3 w-3 text-white" />
            </Button>
            
            {elementType === 'text' && onTextEdit && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                onClick={() => setIsEditingText(true)}
              >
                <Type className="h-3 w-3 text-white" />
              </Button>
            )}
            
            {(elementType === 'media' && onSizeChange) && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                onClick={() => setShowControls(!showControls)}
              >
                <Settings className="h-3 w-3 text-white" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Size Controls */}
        {isEditing && showControls && elementType === 'media' && size && onSizeChange && (
          <Card className="absolute -bottom-24 left-0 z-50 w-48">
            <CardContent className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={size.width}
                    onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                    className="h-7 text-xs"
                    min="50"
                    max="800"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={size.height}
                    onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                    className="h-7 text-xs"
                    min="50"
                    max="600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Text Editing Modal */}
        {isEditingText && (
          <Card className="absolute top-0 left-0 z-50 w-64">
            <CardContent className="p-3">
              <Label className="text-sm">Edit Text</Label>
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full h-20 p-2 border rounded mt-1 text-sm resize-none"
                placeholder="Enter your text..."
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleTextSave}>
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditingText(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Draggable>
  );
};

export default DraggableElement;