'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface AFrameContainerProps {
  content: string;
  arEnabled?: boolean;
}

export function AFrameContainer({ content, arEnabled = true }: AFrameContainerProps) {
  return (
    <>
      <Script 
        src="https://aframe.io/releases/1.5.0/aframe.min.js"
        strategy="beforeInteractive"
      />
      {arEnabled && (
        <Script 
          src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
          strategy="beforeInteractive"
        />
      )}
      
      <div 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000 
        }} 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </>
  )
} 