"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** CSS minHeight to reserve while not yet mounted (prevents CLS). E.g. "600px" */
  placeholder?: string;
  /** How many px before the viewport to start loading. Default: 500px */
  rootMargin?: string;
}

/**
 * Mounts children only when the section enters (or nearly enters) the viewport.
 * Combined with next/dynamic it eliminates JS download + parse for below-fold
 * components during the initial load.
 */
export default function LazySection({
  children,
  placeholder = "400px",
  rootMargin = "500px 0px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already in/near viewport on mount, show immediately
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return (
    // Always render the wrapper so anchor IDs inside children remain scrollable-to
    // after the section mounts, and minHeight reserves space to prevent CLS.
    <div ref={ref} style={visible ? undefined : { minHeight: placeholder }}>
      {visible ? children : null}
    </div>
  );
}
