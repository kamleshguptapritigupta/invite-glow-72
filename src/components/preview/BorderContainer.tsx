import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { BorderSettings, BorderElement, makeCompatibleForLegacy } from '@/types/background';
import { motion } from 'framer-motion';

interface Props {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  children: React.ReactNode;
}

const BorderContainer: React.FC<Props> = ({ greetingData, selectedEvent, children }) => {
  const borderRef = useRef<HTMLDivElement | null>(null);

  const rawBorder = greetingData?.borderSettings || ({} as Partial<BorderSettings>);
  const borderSettings = useMemo(() => makeCompatibleForLegacy(rawBorder), [rawBorder]);

  const [borderSize, setBorderSize] = useState({ width: 300, height: 200 });
  useEffect(() => {
    const el = borderRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBorderSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [borderRef.current]);

  // compute perimeter
  const computePerimeterPos = (posPercent: number, elSize: number, borderWidth: number) => {
    const inset = borderWidth / 2;
    const innerX = inset;
    const innerY = inset;
    const innerW = Math.max(0, borderSize.width - inset * 2);
    const innerH = Math.max(0, borderSize.height - inset * 2);
    const perim = 2 * (innerW + innerH);
    const normalized = ((posPercent % 100) + 100) % 100;
    const dist = (normalized / 100) * perim;

    let x = innerX, y = innerY;
    if (dist <= innerW) x = innerX + dist;
    else if (dist <= innerW + innerH) { x = innerX + innerW; y = innerY + (dist - innerW); }
    else if (dist <= innerW + innerH + innerW) { x = innerX + innerW - (dist - innerW - innerH); y = innerY + innerH; }
    else { x = innerX; y = innerY + innerH - (dist - innerW - innerH - innerW); }

    return { left: Math.round(x - elSize / 2), top: Math.round(y - elSize / 2) };
  };

  // revolve animation
  const [revolvePositions, setRevolvePositions] = useState<Record<string, { left: number; top: number }>>({});
  useEffect(() => {
    let rafId = 0;
    let start = performance.now();

    const revolveEls: BorderElement[] = (borderSettings.decorativeElements || []).filter(e => e.animation === 'revolve');
    if (revolveEls.length === 0) return;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const newPos: Record<string, { left: number; top: number }> = {};
      revolveEls.forEach(el => {
        const duration = el.rotateSpeed && el.rotateSpeed > 0 ? el.rotateSpeed : 6;
        const startOffset = ((el.position ?? 0) % 100) / 100;
        const progress = (startOffset + (elapsed / duration)) % 1;
        const percent = progress * 100;
        newPos[el.id] = computePerimeterPos(percent, el.size || 24, borderSettings.width || 1);
      });
      setRevolvePositions(prev => ({ ...prev, ...newPos }));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [borderSettings.decorativeElements, borderSize, borderSettings.width]);

  // static positions
  const nonRevolvePositions = useMemo(() => {
    const out: Record<string, { left: number; top: number }> = {};
    (borderSettings.decorativeElements || []).forEach(el => {
      if (el.animation === 'revolve') return;
      out[el.id] = computePerimeterPos(el.position ?? 0, el.size || 24, borderSettings.width || 1);
    });
    return out;
  }, [borderSettings.decorativeElements, borderSize, borderSettings.width]);

  const hasGradient =
    !!(borderSettings.secondaryColor && borderSettings.primaryColor && borderSettings.primaryColor !== borderSettings.secondaryColor);

  return (
    <motion.div
      ref={borderRef}
      className="shadow-2xl relative overflow-hidden"

       style={
  !!(borderSettings && borderSettings.enabled)
    ? (hasGradient
        ? { border: 'none', borderRadius: `${borderSettings?.radius ?? 0}px`, overflow: 'hidden' }
        : {
            borderWidth: `${borderSettings?.width ?? 0}px`,
            borderStyle: borderSettings?.style ?? 'solid',
            borderColor:borderSettings?.primaryColor ?? (borderSettings as any)?.color ?? '#000',
            borderRadius: `${borderSettings?.radius ?? 0}px`,
            overflow: 'hidden'
          })
    : { border: 'none', borderRadius: `${borderSettings?.radius ?? 0}px`, overflow: 'hidden' }
}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {hasGradient && (
        <svg width="100%" height="100%" viewBox={`0 0 ${borderSize.width} ${borderSize.height}`} style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="preview-gradient-full" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor={borderSettings.primaryColor || '#000'} />
              <stop offset="100%" stopColor={borderSettings.secondaryColor || '#000'} />
            </linearGradient>
          </defs>
          <rect
            x={borderSettings.width / 2}
            y={borderSettings.width / 2}
            width={borderSize.width - borderSettings.width}
            height={borderSize.height - borderSettings.width}
            rx={borderSettings.radius - borderSettings.width / 2}
            ry={borderSettings.radius - borderSettings.width / 2}
            fill="none"
            stroke="url(#preview-gradient-full)"
            strokeWidth={borderSettings.width}
          />
        </svg>
      )}

      <div className="p-6 md:p-10">{children}</div>

      {borderSettings.decorativeElements?.map(el => {
        const isRevolve = el.animation === 'revolve';
        const pos = isRevolve ? revolvePositions[el.id] : nonRevolvePositions[el.id];
        const style: React.CSSProperties = {
          position: 'absolute',
          left: pos?.left ?? 0,
          top: pos?.top ?? 0,
          width: el.size,
          height: el.size,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          fontSize: (el.size || 24) * 0.6,
        };
        return (
          <div key={el.id} style={style}>
            {el.type === 'emoji' ? el.content : <img src={el.content} alt="decor" className="w-full h-full object-cover" />}
          </div>
        );
      })}
    </motion.div>
  );
};

export default BorderContainer;
