import React from 'react';
import { motion } from 'framer-motion';
import { BorderSettings } from '@/types/background';

interface BorderAnimationsProps {
  borderSettings: BorderSettings;
  containerSize: { width: number; height: number };
}

const BorderAnimations = ({ borderSettings, containerSize }: BorderAnimationsProps) => {
  if (!borderSettings.enabled || !borderSettings.decorativeElements.length) {
    return null;
  }

  const { width, height } = containerSize;
  const perimeter = 2 * (width + height);
  
  // Calculate positions along the border perimeter
  const getPositionAlongBorder = (percentage: number) => {
    const position = (percentage / 100) * perimeter;
    
    if (position <= width) {
      // Top edge
      return { x: position, y: 0 };
    } else if (position <= width + height) {
      // Right edge
      return { x: width, y: position - width };
    } else if (position <= 2 * width + height) {
      // Bottom edge
      return { x: width - (position - width - height), y: height };
    } else {
      // Left edge
      return { x: 0, y: height - (position - 2 * width - height) };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {borderSettings.decorativeElements.map((element, index) => {
        const basePosition = getPositionAlongBorder(element.position);
        
        return (
          <motion.div
            key={element.id}
            className="absolute z-10"
            initial={{ 
              x: basePosition.x,
              y: basePosition.y,
              scale: 1
            }}
            animate={{
              x: borderSettings.animation.enabled ? [
                basePosition.x,
                ...Array.from({ length: 8 }, (_, i) => {
                  const newPercentage = (element.position + (i + 1) * 12.5) % 100;
                  return getPositionAlongBorder(newPercentage).x;
                })
              ] : basePosition.x,
              y: borderSettings.animation.enabled ? [
                basePosition.y,
                ...Array.from({ length: 8 }, (_, i) => {
                  const newPercentage = (element.position + (i + 1) * 12.5) % 100;
                  return getPositionAlongBorder(newPercentage).y;
                })
              ] : basePosition.y,
              rotate: element.animation === 'spin' ? [0, 360] : 0,
              scale: element.animation === 'pulse' ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: borderSettings.animation.enabled ? 10 / borderSettings.animation.speed : 0,
              repeat: borderSettings.animation.enabled ? Infinity : 0,
              ease: "linear"
            }}
            style={{
              fontSize: `${Math.min(element.size, 32)}px`,
              transform: `translate(-50%, -50%)`
            }}
          >
            {element.type === 'emoji' ? (
              <span className="drop-shadow-lg">
                {element.content}
              </span>
            ) : (
              <img
                src={element.content}
                alt="Border decoration"
                className="drop-shadow-lg"
                style={{
                  width: `${Math.min(element.size, 32)}px`,
                  height: `${Math.min(element.size, 32)}px`,
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            )}
          </motion.div>
        );
      })}
      
      {/* Animated Border Glow Effect */}
      {borderSettings.animation.enabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderWidth: `${borderSettings.width}px`,
            borderStyle: borderSettings.style,
            borderColor: borderSettings.color,
            borderRadius: `${borderSettings.radius}px`,
            filter: 'drop-shadow(0 0 10px currentColor)'
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            filter: [
              'drop-shadow(0 0 5px currentColor)',
              'drop-shadow(0 0 15px currentColor)',
              'drop-shadow(0 0 5px currentColor)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default BorderAnimations;