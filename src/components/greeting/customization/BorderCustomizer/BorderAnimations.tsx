import React from 'react';
import { motion } from 'framer-motion';
import { BorderSettings } from '@/types/background';

interface BorderAnimationsProps {
  borderSettings: BorderSettings;
  containerSize: { width: number; height: number };
}

const BorderAnimations = ({ borderSettings, containerSize }: BorderAnimationsProps) => {
  if (!borderSettings.enabled) return null;

  const { width, height } = containerSize;
  const perimeter = 2 * (width + height);

  // Utility: get X/Y from % along border
  const getPositionAlongBorder = (percentage: number) => {
    const position = (percentage / 100) * perimeter;

    if (position <= width) {
      return { x: position, y: 0 }; // Top
    } else if (position <= width + height) {
      return { x: width, y: position - width }; // Right
    } else if (position <= 2 * width + height) {
      return { x: width - (position - width - height), y: height }; // Bottom
    } else {
      return { x: 0, y: height - (position - 2 * width - height) }; // Left
    }
  };

  // 🔥 Build animation set based on multiple flags
  const buildAnimations = (element: any, basePos: { x: number; y: number }) => {
    const animations: any = {};
    const transitions: any = {
      duration: element.speed ? 10 / element.speed : 4,
      repeat: Infinity,
      ease: 'linear',
    };

    // Helper to apply one animation at a time
    const applyAnimation = (type: string) => {
      switch (type) {
        case 'spin':
          animations.rotate = element.direction === 'counterclockwise' ? [0, -360] : [0, 360];
          transitions.duration = 6 / (element.speed || 1);
          break;

        case 'pulse':
          animations.scale = [1, 1.3, 1];
          transitions.duration = 1.5 / (element.speed || 1);
          transitions.ease = 'easeInOut';
          break;

        case 'blink':
          animations.opacity = [1, 0, 1];
          transitions.duration = 1 / (element.speed || 1);
          transitions.ease = 'easeInOut';
          break;

        case 'pop':
          animations.x = Array.from({ length: 6 }, () =>
            getPositionAlongBorder(Math.random() * 100).x
          );
          animations.y = Array.from({ length: 6 }, () =>
            getPositionAlongBorder(Math.random() * 100).y
          );
          animations.scale = [0.5, 1.2, 1];
          transitions.duration = 5 / (element.speed || 1);
          break;

        case 'slide':
          const step = element.direction === 'counterclockwise' ? -10 : 10;
          animations.x = Array.from({ length: 10 }, (_, i) =>
            getPositionAlongBorder((element.position + i * step + 100) % 100).x
          );
          animations.y = Array.from({ length: 10 }, (_, i) =>
            getPositionAlongBorder((element.position + i * step + 100) % 100).y
          );
          transitions.duration = 12 / (element.speed || 1);
          break;

        case 'bounce':
          animations.y = [basePos.y, basePos.y - 15, basePos.y];
          transitions.duration = 1 / (element.speed || 1);
          transitions.ease = 'easeInOut';
          break;

        case 'wiggle':
          animations.x = [basePos.x - 5, basePos.x + 5, basePos.x];
          transitions.duration = 0.6 / (element.speed || 1);
          transitions.ease = 'easeInOut';
          break;

        case 'float':
          animations.y = [basePos.y, basePos.y - 10, basePos.y];
          animations.x = [basePos.x, basePos.x + 5, basePos.x];
          transitions.duration = 4 / (element.speed || 1);
          transitions.ease = 'easeInOut';
          break;

        default:
          break;
      }
    };

    // Support single or multiple animations
    if (Array.isArray(element.animations)) {
      element.animations.forEach(applyAnimation);
    } else if (element.animation) {
      applyAnimation(element.animation);
    }

    return { animations, transitions };
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Always render static border */}
      <div
        className="absolute inset-0"
        style={{
          borderWidth: `${borderSettings.width}px`,
          borderStyle: borderSettings.style,
          borderColor: borderSettings.color,
          borderRadius: `${borderSettings.radius}px`,
        }}
      />

      {/* Decorative elements (emoji / image) */}
      {borderSettings.decorativeElements.map((element, index) => {
        const basePos = getPositionAlongBorder(element.position);
        const { animations, transitions } = buildAnimations(element, basePos);

        return (
          <motion.div
            key={element.id}
            className="absolute z-10"
            initial={{ x: basePos.x, y: basePos.y, scale: 1, opacity: 1 }}
            animate={animations}
            transition={transitions}
            style={{
              fontSize: `${Math.min(element.size, 32)}px`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {element.type === 'emoji' ? (
              <span className="drop-shadow-lg">{element.content}</span>
            ) : (
              <img
                src={element.content}
                alt="Border decoration"
                className="drop-shadow-lg"
                style={{
                  width: `${Math.min(element.size, 32)}px`,
                  height: `${Math.min(element.size, 32)}px`,
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Optional glowing border animation */}
      {borderSettings.animation.enabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderWidth: `${borderSettings.width}px`,
            borderStyle: borderSettings.style,
            borderColor: borderSettings.color,
            borderRadius: `${borderSettings.radius}px`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            filter: [
              'drop-shadow(0 0 5px currentColor)',
              'drop-shadow(0 0 15px currentColor)',
              'drop-shadow(0 0 5px currentColor)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

export default BorderAnimations;
