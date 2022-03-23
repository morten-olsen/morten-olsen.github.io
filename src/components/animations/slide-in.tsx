import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useMemo, useRef } from 'react';
import { useOnScreen } from '../../hooks/animation';

const SlideIn: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>();
  const controls = useAnimation();
  const onScreen = useOnScreen(ref);
  const slideTime = useMemo(
    () => 1,
    [],
  );

  useEffect(
    () => {
      if (!onScreen) {
        return;
      }
      controls.start({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          duration: slideTime,
          ease: "easeOut"
        }    
      })
    },
    [controls, onScreen],
  );

  return (
    <motion.div
      {...props as any}
      ref={ref}
      initial={{
        y: 50,
        opacity: 0,
        scale: 1.3,
      }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

export { SlideIn };
