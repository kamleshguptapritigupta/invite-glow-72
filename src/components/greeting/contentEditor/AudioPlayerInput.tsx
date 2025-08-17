// components/greeting/AudioPlayerInput.tsx
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play, Pause, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AudioPlayerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AudioPlayerInput({ value, onChange }: AudioPlayerInputProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSupportedUrl, setIsSupportedUrl] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Check if URL is supported when it changes
    if (value) {
      const supported = checkSupportedUrl(value);
      setIsSupportedUrl(supported);
      
      if (supported && audioRef.current) {
        audioRef.current.src = value;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error("Auto-play was prevented:", error);
              setIsPlaying(false);
              showErrorToast(value);
            });
        }
      } else {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
      setIsSupportedUrl(true); // Reset when empty
    }
  }, [value]);

  const checkSupportedUrl = (url: string): boolean => {
    try {
      new URL(url);
      
      // List of domains that don't provide direct audio streams
      const unsupportedDomains = [
        'pixabay.com',
        'jiosaavn.com',
        'gaana.com',
        'spotify.com',
        'youtube.com',
        'youtu.be'
      ];
      
      // Check if URL contains any unsupported domain
      return !unsupportedDomains.some(domain => url.includes(domain));
    } catch (_) {
      return false;
    }
  };

  const showErrorToast = (url: string) => {
    toast({
      title: "Unsupported music URL",
      description: "Please use a direct link to an audio file (.mp3, .wav, etc.). Streaming platforms are not supported.",
      variant: "destructive"
    });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !isSupportedUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
            showErrorToast(value);
          });
      }
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
      
      {/* Input field */}
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter direct audio URL (e.g., https://example.com/song.mp3)"
          type="url"
          className={!isSupportedUrl && value ? "border-destructive" : ""}
        />
        {!isSupportedUrl && value && (
          <div className="absolute right-2 top-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>
      
      {/* Play/Pause button - responsive */}
      <Button
        type="button"
        variant="outline"
        size={isSmallScreen ? "icon" : "default"}
        onClick={togglePlayPause}
        disabled={!value || !isSupportedUrl}
        className="shrink-0"
      >
        {isSmallScreen ? (
          isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
        ) : (
          <>
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Play
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
}




{/* Audio */}
              {/* <div className="space-y-2 p-6 border border-red-300 rounded-xl shadow-lg">
                <Label htmlFor="audioUrl">Background Music URL (optional)</Label>
                <Input
                  id="audioUrl"
                  value={formData.audioUrl}
                  onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                  placeholder="https://example.com/music.mp3"
                  type="url"
                />
              </div> */}

              
              
              {/* Replace your current audio input with this */}


{/* <div className="space-y-2 p-6 border border-red-300 rounded-xl shadow-lg">
              <Label htmlFor="audioUrl">Background Music URL (optional)</Label>
              <AudioPlayerInput
                value={formData.audioUrl}
                onChange={(value) => handleInputChange('audioUrl', value)}
              />
            </div> */}