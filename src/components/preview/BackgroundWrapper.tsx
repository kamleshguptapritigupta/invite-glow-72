import React, { useMemo } from 'react';
import { GreetingFormData } from '@/types/greeting';
import BackgroundRenderer from '@/components/greeting/customization/BackgroundCustomizer/BackgroundRenderer';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  greetingData: GreetingFormData;
  className?: string;
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<Props> = ({ greetingData, className, children }) => {
  const prefersReducedMotion = useReducedMotion();
  const bgSettings = useMemo(() => {
    const s = greetingData?.backgroundSettings;
    if (!s) return s;
    if (prefersReducedMotion) {
      return { ...s, animation: { ...s.animation, enabled: false } };
    }
    return s;
  }, [greetingData?.backgroundSettings, prefersReducedMotion]);

  return (
    <BackgroundRenderer settings={bgSettings} className={cn("min-h-screen p-4 w-full relative overflow-hidden", className)}>
      {children}
    </BackgroundRenderer>
  );
};

export default BackgroundWrapper;
