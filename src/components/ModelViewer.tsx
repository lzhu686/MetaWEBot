'use client'

import { useEffect, useState } from 'react'

interface ModelViewerProps {
  src: string;
  alt: string;
  ar?: boolean;
  'ar-modes'?: string;
  'camera-controls'?: boolean;
  'touch-action'?: string;
  'auto-rotate'?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;  // 添加这一行
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & ModelViewerProps
    }
  }
}

export default function ModelViewer(props: ModelViewerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // 或者返回一个占位符
  }

  return <model-viewer {...props} />
}
