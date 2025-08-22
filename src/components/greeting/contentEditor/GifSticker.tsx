import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search, Plus, Loader2, Image, Video, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GifItem {
  id: string;
  url: string;
  preview: string;
  title: string;
  type: 'gif' | 'sticker';
}

interface GifStickerProps {
  onAdd: (item: GifItem) => void;
  maxItems?: number;
  currentCount?: number;
}

const GifSticker: React.FC<GifStickerProps> = ({ 
  onAdd, 
  maxItems = 10, 
  currentCount = 0 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'gif' | 'sticker'>('gif');
  const [showSearch, setShowSearch] = useState(false);

  // Mock API call - replace with actual Giphy API
  const searchGifs = async (query: string, type: 'gif' | 'sticker') => {
    setLoading(true);
    try {
      // Mock data - in real implementation, use Giphy API
      const mockResults: GifItem[] = [
        {
          id: '1',
          url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
          preview: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy_s.gif',
          title: `Happy ${query}`,
          type
        },
        {
          id: '2',
          url: 'https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy.gif',
          preview: 'https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy_s.gif',
          title: `Celebration ${query}`,
          type
        },
        {
          id: '3',
          url: 'https://media.giphy.com/media/3o6fJ9Oi4zEBLjzCow/giphy.gif',
          preview: 'https://media.giphy.com/media/3o6fJ9Oi4zEBLjzCow/giphy_s.gif',
          title: `Party ${query}`,
          type
        }
      ];
      
      setResults(mockResults);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchGifs(searchTerm, selectedType);
    }
  };

  const handleAdd = (item: GifItem) => {
    onAdd(item);
    setShowSearch(false);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <Card className="border border-purple-300 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="py-3">
        <CardTitle>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                GIFs & Stickers
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs",
                  currentCount >= maxItems 
                    ? "bg-destructive/10 text-destructive" 
                    : "bg-primary/10 text-primary"
                )}>
                  {currentCount}/{maxItems}
                </span>
              </span>
            </Label>
            
            <Button
              onClick={() => setShowSearch(!showSearch)}
              disabled={currentCount >= maxItems}
              size="sm"
              variant={showSearch ? "default" : "outline"}
              className={cn(
                "transition-all duration-300 font-medium",
                currentCount >= maxItems && "bg-destructive/10 text-destructive border-destructive"
              )}
            >
              {showSearch ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showSearch ? 'Close' : 'Add'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {showSearch && (
          <Card className="border-primary/20 shadow-md">
            <CardContent className="p-4 space-y-4">
              {/* Type Selection */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedType('gif')}
                  variant={selectedType === 'gif' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  GIFs
                </Button>
                <Button
                  onClick={() => setSelectedType('sticker')}
                  variant={selectedType === 'sticker' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Stickers
                </Button>
              </div>

              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  placeholder={`Search ${selectedType}s...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || loading}
                  size="sm"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Results Grid */}
              {results.length > 0 && (
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 aspect-square"
                      onClick={() => handleAdd(item)}
                    >
                      <img
                        src={item.preview}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching {selectedType}s...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentCount === 0 && !showSearch && (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No GIFs or stickers added yet</p>
            <Button
              onClick={() => setShowSearch(true)}
              className="mt-2"
              size="sm"
              variant="outline"
            >
              🎬 Add Your First GIF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GifSticker;