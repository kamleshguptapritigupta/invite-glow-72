import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Image, Video, Upload, ChevronUp, ChevronDown, Settings, X } from 'lucide-react';
import { MediaItem } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedMediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxItems?: number;
}

const MAX_ITEMS = 20;

const AdvancedMediaUploader = ({ 
  media, 
  onChange, 
  maxItems = MAX_ITEMS 
}: AdvancedMediaUploaderProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeMediaIndex !== null && activeMediaIndex >= media.length) {
      setActiveMediaIndex(null);
    }
  }, [media.length, activeMediaIndex]);

 // Updated addMedia function
const addMedia = (type: 'image' | 'video') => {
  if (media.length >= maxItems) return;

  const newMedia: MediaItem = {
    id: Date.now().toString(),
    url: '',
    type,
    position: { width: 300, height: 200 },
    animation: 'fade',
    priority: media.length + 1
  };

  const updatedMedia = [...media, newMedia];
  onChange(updatedMedia);
  setActiveMediaIndex(updatedMedia.length - 1);

  // Scroll to the new item after a small delay
  setTimeout(() => {
    const element = document.getElementById(`media-item-${updatedMedia.length - 1}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
};

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
    if (activeMediaIndex === index) {
      setActiveMediaIndex(null);
    } else if (activeMediaIndex !== null && activeMediaIndex > index) {
      setActiveMediaIndex(activeMediaIndex - 1);
    }
  };

  const updateMedia = (index: number, field: keyof MediaItem, value: any) => {
    const newMedia = [...media];
    if (field === 'position') {
      newMedia[index] = {
        ...newMedia[index],
        position: { ...newMedia[index].position, ...value }
      };
    } else {
      newMedia[index] = { ...newMedia[index], [field]: value };
    }
    onChange(newMedia);
  };

  const moveMediaPriority = (index: number, direction: 'up' | 'down') => {
    if (index < 0 || index >= media.length) return;
    
    const newMedia = [...media];
    const currentPriority = newMedia[index].priority;
    const targetPriority = direction === 'up' ? currentPriority - 1 : currentPriority + 1;
    
    const targetIndex = newMedia.findIndex(m => m.priority === targetPriority);
    if (targetIndex !== -1) {
      newMedia[index].priority = targetPriority;
      newMedia[targetIndex].priority = currentPriority;
      newMedia.sort((a, b) => a.priority - b.priority);
      onChange(newMedia);
    }
  };

  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    const newMedia = [...media];
    const draggedItem = newMedia[dragIndex];
    newMedia.splice(dragIndex, 1);
    newMedia.splice(index, 0, draggedItem);
    
    newMedia.forEach((item, idx) => {
      item.priority = idx + 1;
    });
    
    onChange(newMedia);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const validateUrl = (url: string, type: 'image' | 'video' | 'audio') => {
    if (!url) return { valid: false, message: 'URL is required' };
    
    try {
      new URL(url);
    } catch {
      return { valid: false, message: 'Invalid URL format' };
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];

    const mediaPlatforms = {
      image: [
        'facebook.com', 'fb.com', 'instagram.com', 'twitter.com', 'x.com',
        'tiktok.com', 'pinterest.com', 'reddit.com', 'tumblr.com',
        'drive.google.com', 'dropbox.com', 'onedrive.live.com', 'box.com',
        'flickr.com', 'imgur.com', '500px.com', 'unsplash.com',
        'tinder.com', 'bumble.com', 'hinge.com'
      ],
      video: [
        'facebook.com', 'fb.com', 'instagram.com', 'twitter.com', 'x.com',
        'tiktok.com', 'vimeo.com', 'dailymotion.com', 'twitch.tv',
        'drive.google.com', 'dropbox.com', 'onedrive.live.com',
        'streamable.com', 'gfycat.com', 'coub.com'
      ],
      audio: [
        'spotify.com', 'youtube.com', 'youtu.be', 'soundcloud.com',
        'apple.com/music', 'deezer.com', 'tidal.com', 'jiosaavn.com',
        'gaana.com', 'wynk.in',
        'anchor.fm', 'podcasts.google.com', 'breaker.audio',
        'drive.google.com', 'dropbox.com', 'onedrive.live.com'
      ]
    };

    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    
    if (type === 'image' && imageExtensions.includes(extension)) {
      return { valid: true, message: '' };
    }
    
    if (type === 'video' && videoExtensions.includes(extension)) {
      return { valid: true, message: '' };
    }

    if (type === 'audio' && audioExtensions.includes(extension)) {
      return { valid: true, message: '' };
    }

    const domain = new URL(url).hostname.replace('www.', '');

    if (type === 'image' && mediaPlatforms.image.some(d => domain.includes(d))) {
      return { 
        valid: false, 
        message: 'Use direct image URL or embed code',
        embeddable: true
      };
    }
    
    if (type === 'video' && mediaPlatforms.video.some(d => domain.includes(d))) {
      return { 
        valid: false, 
        message: 'Use embed code for this platform',
        embeddable: true
      };
    }

    if (type === 'audio' && mediaPlatforms.audio.some(d => domain.includes(d))) {
      return { 
        valid: false, 
        message: 'Use direct audio file or embed code',
        embeddable: true
      };
    }

    return { 
      valid: false, 
      message: `Not a valid ${type} URL or supported platform` 
    };
  };

  const getEmbedCode = (url: string, type: 'image' | 'video' | 'audio') => {
    const domain = new URL(url).hostname.replace('www.', '');

    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      const videoId = url.includes('youtube.com') 
        ? new URL(url).searchParams.get('v')
        : url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (domain.includes('instagram.com')) {
      const postId = url.split('/p/')[1]?.split('/')[0];
      return postId ? `https://www.instagram.com/p/${postId}/embed` : null;
    }

    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      const tweetId = url.split('/status/')[1]?.split('?')[0];
      return tweetId ? `https://twitframe.com/show?url=${encodeURIComponent(url)}` : null;
    }

    if (domain.includes('facebook.com') || domain.includes('fb.com')) {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}`;
    }

    if (domain.includes('tiktok.com')) {
      const videoId = url.split('/video/')[1]?.split('?')[0];
      return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
    }

    if (domain.includes('spotify.com')) {
      const trackId = url.split('track/')[1]?.split('?')[0];
      return trackId ? `https://open.spotify.com/embed/track/${trackId}` : null;
    }

    if (domain.includes('soundcloud.com')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
    }

    if (domain.includes('drive.google.com')) {
      if (url.includes('/file/d/')) {
        const fileId = url.split('/file/d/')[1]?.split('/')[0];
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
      }
      return null;
    }

    return null;
  };

  const renderMediaPreview = (item: MediaItem, index: number) => {
    const urlValidation = validateUrl(item.url, item.type);
    
    if (item.type === 'image') {
      const embedUrl = getEmbedCode(item.url, 'image');
      
      if (embedUrl) {
        return (
          <div className="relative w-full h-24">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      return (
        <img
          src={item.url}
          alt={`Preview ${index + 1}`}
          className={`w-full h-24 object-contain rounded ${
            !urlValidation.valid ? 'opacity-50' : ''
          }`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'text-center py-4 text-muted-foreground text-xs';
            errorMsg.textContent = urlValidation.message || 'Failed to load image';
            e.currentTarget.parentNode?.appendChild(errorMsg);
          }}
        />
      );
    } 
    else if (item.type === 'video') {
      const embedUrl = getEmbedCode(item.url, 'video');
      
      if (embedUrl) {
        return (
          <div className="relative w-full h-24">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      return (
        <video
          src={item.url}
          className={`w-full h-24 object-contain rounded ${
            !urlValidation.valid ? 'opacity-50' : ''
          }`}
          controls
          muted
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'text-center py-4 text-muted-foreground text-xs';
            errorMsg.textContent = urlValidation.message || 'Failed to load video';
            e.currentTarget.parentNode?.appendChild(errorMsg);
          }}
        />
      );
    }
  };

  const usagePercentage = Math.round((media.length / maxItems) * 100);

  return (
    <Card className="border border-pink-300 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <Image className="h-4 w-4" />
              <Video className="h-3 w-3 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
            </div>
            <span className="text-sm font-medium truncate">Media Content</span>
            <Badge 
              className={`shrink-0 ml-1 ${
                media.length === maxItems 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-primary/10 text-primary"
              }`}
            >
              {media.length}/{maxItems}
            </Badge>
          </div>
          
          <div className="flex gap-2 justify-end xs:justify-normal">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => addMedia('image')}
                    disabled={media.length >= maxItems}
                    size="sm"
                    variant='outline'
                    className={`gap-1 min-w-[100px]`}
                  >
                    <Image className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {media.length > 0 ? 'Add More' : 'Add Image'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {media.length >= maxItems 
                    ? 'Maximum media limit reached' 
                    : (media.length > 0 ? 'Add another image' : 'Add first image')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => addMedia('video')}
                    disabled={media.length >= maxItems}
                    size="sm"
                    variant='outline'
                    className={`gap-1 min-w-[100px]`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {media.length > 0 ? 'Add More' : 'Add Video'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {media.length >= maxItems 
                    ? 'Maximum media limit reached' 
                    : (media.length > 0 ? 'Add another video' : 'Add first video')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-3">
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>
              {media.length > 0 ? 
                `${media.length} item${media.length !== 1 ? 's' : ''} added` : 
                'No media added yet'}
            </span>
            {media.length >= maxItems && (
              <span className="text-destructive">Limit reached</span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {media.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 rounded-lg border border-dashed border-border/50 bg-muted/20"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">No media content added yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1 mb-3">
              Add images or videos to get started
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => addMedia('image')} 
                variant="outline"
                size="sm"
                className="gap-1 bg-primary/10 text-primary"
              >
                <Image className="h-3.5 w-3.5 " />
                Add Image
              </Button>
              <Button 
                onClick={() => addMedia('video')} 
                variant="outline" 
                size="sm"
                className="gap-1 bg-primary/10 text-primary"
              >
                <Video className="h-3.5 w-3.5" />
                Add Video
              </Button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {media.map((item, index) => {
              const urlValidation = validateUrl(item.url, item.type);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: dragIndex === index ? 1.02 : 1,
                    boxShadow: dragIndex === index ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                >
                  <Card 
                    className={`border transition-all ${
                      activeMediaIndex === index ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'
                    } ${
                      dragIndex === index ? 'bg-primary/5' : ''
                    }`}
                  >
                    <CardHeader className="pb-2 pt-3 px-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div 
                            className={`p-1 rounded-md ${
                              item.type === 'image' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                            }`}
                          >
                            {item.type === 'image' ? (
                              <Image className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Video className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          
                          {!urlValidation.valid && item.url && (
                            <Badge variant="destructive" className="text-xs">
                              {urlValidation.message.includes('embed') ? 'Needs embed' : 'Invalid'}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => moveMediaPriority(index, 'up')}
                                  disabled={item.priority === 1}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move up</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => moveMediaPriority(index, 'down')}
                                  disabled={item.priority === media.length}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move down</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => setActiveMediaIndex(activeMediaIndex === index ? null : index)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  {activeMediaIndex === index ? (
                                    <X className="h-3.5 w-3.5" />
                                  ) : (
                                    <Settings className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {activeMediaIndex === index ? 'Close settings' : 'Open settings'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => removeMedia(index)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove media</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 px-3 pb-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs">Media URL</Label>
                          {!urlValidation.valid && item.url && (
                            <span className="text-xs text-destructive">
                              {urlValidation.message}
                            </span>
                          )}
                        </div>
                        <Input
                          value={item.url}
                          onChange={(e) => updateMedia(index, 'url', e.target.value)}
                          placeholder={`Enter ${item.type} URL...`}
                          className="text-sm break-all overflow-hidden text-ellipsis whitespace-nowrap"
                        />
                      </div>

                      {item.url && (
                        <div className="border rounded p-2 bg-muted/20">
                          {renderMediaPreview(item, index)}
                        </div>
                      )}

                      <AnimatePresence>
                        {activeMediaIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 border-t pt-3 overflow-hidden"
                          >
                            {/* Size Controls - Only width and height remain */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Width (px)</Label>
                                <Input
                                  type="number"
                                  min="50"
                                  max="800"
                                  value={item.position.width}
                                  onChange={(e) => updateMedia(index, 'position', { width: parseInt(e.target.value) || 300 })}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Height (px)</Label>
                                <Input
                                  type="number"
                                  min="50"
                                  max="600"
                                  value={item.position.height}
                                  onChange={(e) => updateMedia(index, 'position', { height: parseInt(e.target.value) || 200 })}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>

                            {/* Animation and Priority */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Animation</Label>
                                <Select
                                  value={item.animation}
                                  onValueChange={(value) => updateMedia(index, 'animation', value)}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {animationStyles.map((style) => (
                                      <SelectItem key={style.value} value={style.value}>
                                        {style.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Priority</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max={media.length}
                                  value={item.priority}
                                  onChange={(e) => updateMedia(index, 'priority', parseInt(e.target.value) || 1)}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedMediaUploader;