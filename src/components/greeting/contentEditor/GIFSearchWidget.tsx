import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem } from '@/types/greeting';

interface GIFResult {
  id: string;
  url: string;
  preview_url: string;
  title: string;
  width: number;
  height: number;
}

interface Props {
  onGIFSelect: (gif: MediaItem) => void;
  className?: string;
}

const GIFSearchWidget: React.FC<Props> = ({ onGIFSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GIFResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Using Giphy API (free tier)
  const searchGIFs = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      // Using public API endpoint (no key required for basic usage)
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodeURIComponent(query)}&limit=12&rating=g`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch GIFs');
      }
      
      const data = await response.json();
      const gifResults: GIFResult[] = data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
        preview_url: gif.images.fixed_height_small.url,
        title: gif.title || 'GIF',
        width: parseInt(gif.images.fixed_height.width),
        height: parseInt(gif.images.fixed_height.height),
      }));
      
      setGifs(gifResults);
    } catch (error) {
      console.error('Error searching GIFs:', error);
      
      // Fallback: Generate mock GIFs for demo
      const mockGifs: GIFResult[] = Array.from({ length: 8 }, (_, i) => ({
        id: `mock-${i}`,
        url: `https://via.placeholder.com/200x150/FF6B6B/FFFFFF?text=GIF+${i+1}`,
        preview_url: `https://via.placeholder.com/100x75/FF6B6B/FFFFFF?text=GIF+${i+1}`,
        title: `${query} GIF ${i + 1}`,
        width: 200,
        height: 150,
      }));
      setGifs(mockGifs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchGIFs(searchQuery);
      setIsExpanded(true);
    }
  };

  const handleGIFSelect = (gif: GIFResult) => {
    const mediaItem: MediaItem = {
      id: Date.now().toString(),
      url: gif.url,
      type: 'image',
      position: {
        width: Math.min(gif.width, 300),
        height: Math.min(gif.height, 225),
        x: 0,
        y: 0,
      },
      animation: 'bounceIn',
      priority: 1,
      fileType: 'gif',
    };
    
    onGIFSelect(mediaItem);
  };

  const trendingQueries = [
    'celebration', 'party', 'happy', 'love', 'congratulations', 
    'birthday', 'christmas', 'new year', 'anniversary', 'thank you'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${className}`}
    >
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <ImageIcon className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-pink-800">GIF Library</CardTitle>
                <p className="text-sm text-pink-600 mt-1">
                  Add animated GIFs to your greeting
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              Free
            </Badge>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search for GIFs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !searchQuery.trim()}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Search
                  </Button>
                </form>

                {/* Trending queries */}
                {gifs.length === 0 && !isLoading && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Trending:</p>
                    <div className="flex flex-wrap gap-1">
                      {trendingQueries.map((query) => (
                        <button
                          key={query}
                          onClick={() => {
                            setSearchQuery(query);
                            searchGIFs(query);
                          }}
                          className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* GIF Results */}
                {gifs.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gifs.map((gif, index) => (
                      <motion.div
                        key={gif.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white rounded-lg overflow-hidden border-2 border-pink-200 hover:border-pink-400 transition-all cursor-pointer"
                        onClick={() => handleGIFSelect(gif)}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={gif.preview_url}
                            alt={gif.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            className="gap-2 bg-white text-pink-600 hover:bg-pink-50"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
                    <span className="ml-2 text-pink-700">Searching GIFs...</span>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default GIFSearchWidget;