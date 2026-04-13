import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="inline-block word" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      const charElements = el.querySelectorAll('.inline-block');
      if (!charElements.length) return;

      ScrollTrigger.create({
        trigger: el,
        scroller,
        start: scrollStart,
        end: scrollEnd,
        once: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          gsap.fromTo(
            charElements,
            {
              y: 14,
              transformOrigin: '50% 50%'
            },
            {
              duration: animationDuration,
              ease,
              y: 0,
              stagger,
              clearProps: 'transform'
            }
          );
        },
      });
    }, el);

    return () => ctx.revert();
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <h2
      ref={containerRef}
      className={`my-2 overflow-hidden ${containerClassName}`}>
      <span
        className={`inline-block leading-[1.2] ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
