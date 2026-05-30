import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Parallax = ({ 
  children, 
  speed = 0.5,
  direction = 'vertical',
  className = ''
}) => {
  const ref = useRef(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    if (!ref.current) return;

    const onResize = () => {
      setElementTop(ref.current.getBoundingClientRect().top + window.scrollY);
      setClientHeight(window.innerHeight);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [ref]);

  const initial = elementTop - clientHeight;
  const final = elementTop + clientHeight;

  const yRange = useTransform(
    scrollY,
    [initial, final],
    direction === 'vertical' ? [speed * 100, -speed * 100] : [0, 0]
  );

  const xRange = useTransform(
    scrollY,
    [initial, final],
    direction === 'horizontal' ? [speed * 100, -speed * 100] : [0, 0]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: direction === 'vertical' ? yRange : 0,
        x: direction === 'horizontal' ? xRange : 0
      }}
    >
      {children}
    </motion.div>
  );
};

export default Parallax;
