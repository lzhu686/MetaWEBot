'use client'

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

interface ModelViewerProps {
  src: string;
  id?: string;
  alt: string;
  ar?: boolean;
  'ar-modes'?: string;
  'camera-controls'?: boolean;
  'touch-action'?: string;
  'auto-rotate'?: boolean;
  autoplay?: boolean;
  'animation-name'?: string;
  scale?: string;
  'shadow-intensity'?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
  onLoad?: () => void;
  onError?: (event: Event) => void;
  'ar-status'?: string;
  'camera-orbit'?: string;
}

export interface ModelViewerElement extends HTMLElement {
  animationName: string;
  queryHotspot: (name: string) => { canvasPosition: { x: number; y: number } } | null;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & ModelViewerProps
    }
  }
}

const ModelViewer = forwardRef<ModelViewerElement, ModelViewerProps>((props, ref) => {
  const internalRef = useRef<HTMLElement>(null)

  useImperativeHandle(ref, () => ({
    get animationName() {
      return internalRef.current?.getAttribute('animation-name') || '';
    },
    set animationName(value: string) {
      if (internalRef.current) {
        internalRef.current.setAttribute('animation-name', value);
      }
    },
    queryHotspot: (name: string) => {
      return (internalRef.current as any)?.queryHotspot(name) || null;
    }
  }) as ModelViewerElement);

  useEffect(() => {
    const element = internalRef.current;
    if (element) {
      element.addEventListener('load', props.onLoad || (() => {}));
      element.addEventListener('error', props.onError || (() => {}));
    }
    return () => {
      if (element) {
        element.removeEventListener('load', props.onLoad || (() => {}));
        element.removeEventListener('error', props.onError || (() => {}));
      }
    };
  }, [props.onLoad, props.onError]);

  return React.createElement('model-viewer', { ref: internalRef, ...props, suppressHydrationWarning: true });
})

ModelViewer.displayName = 'ModelViewer';

export default ModelViewer

