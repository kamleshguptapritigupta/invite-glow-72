import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Adjust import path as needed

interface FloatingButtonProps {
  className?: string;
}

export const FloatingButton = ({ className }: FloatingButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className={`fixed bottom-0 left-0 right-0 flex justify-center p-4 sm:p-6 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm z-50 ${className}`}>
      <div className="relative">
        {/* Lightning spark rotating around button */}
        <div 
          className="absolute -inset-2 rounded-lg animate-spin-slow [animation-duration:8s]"
          style={{
            ['--spark-color-1' as any]: '#f472b6', // pink-400
            ['--spark-color-2' as any]: '#a78bfa', // violet-400
            ['--spark-color-3' as any]: '#60a5fa', // blue-400
            ['--spark-color-4' as any]: '#34d399', // emerald-400
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 left-1/2 w-full h-full"
              style={{
                transform: `rotate(${i * 90}deg)`,
                ['--delay' as any]: `${i * 0.5}s`,
              }}
            >
              <div 
                className={`absolute top-0 left-0 w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-[pulse_1.5s_ease-in-out_infinite]`}
                style={{
                  backgroundColor: `var(--spark-color-${i + 1})`,
                  ['--delay' as any]: `${i * 0.5}s`,
                  animationDelay: `var(--delay)`
                }}
              />
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={() => navigate('/create')}
          className="
            w-full sm:w-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5
            text-sm sm:text-base md:text-lg
            relative overflow-hidden group animate-zoom-in shadow-2xl 
            hover:shadow-primary/30 transition-all duration-500 
            bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l
            rounded-lg max-w-md
          "
        >
          {/* Inner content */}
          <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
            <span className="mr-2 sm:mr-3 text-lg sm:text-xl md:text-2xl group-hover:animate-spin">
              ✨
            </span>
            <span className="text-center">Customize and share with others</span>
          </span>

          {/* Shine effect */}
          <span className="
            absolute top-0 left-1/2 w-16 sm:w-20 h-full 
            bg-white/30 -skew-x-12 transform -translate-x-1/2 
            opacity-0 group-hover:opacity-100 group-hover:animate-shine 
            transition-opacity duration-700
          "/>

          {/* Border morph */}
          <span className="
            absolute inset-0 border-2 border-transparent 
            group-hover:border-white/30 rounded-lg 
            group-hover:rounded-none 
            transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]
          "/>
        </Button>
      </div>
    </div>
  );
};