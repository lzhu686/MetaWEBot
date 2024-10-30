'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function ARLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [arjsLoaded, setArjsLoaded] = useState(false)
  const [arjsError, setArjsError] = useState<string>('')

  useEffect(() => {
    // 监听 AR.js 加载状态
    const checkARJS = () => {
      if (window.THREEx?.ArToolkitSource) {
        setArjsLoaded(true)
      }
    }

    const interval = setInterval(checkARJS, 500)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!window.THREEx?.ArToolkitSource) {
        setArjsError('AR.js 加载超时')
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      {/* 按顺序加载必要的脚本 */}
      <Script 
        src="/libs/ar-js/three.js/build/three.min.js"
        strategy="beforeInteractive"
        id="threejs"
      />
      <Script 
        src="/libs/ar-js/three.js/build/ar-threex.js"
        strategy="afterInteractive"
        id="artoolkit-api"
        onLoad={() => console.log('ARToolkit API loaded')}
      />
      <Script 
        src="/libs/ar-js/three.js/build/ar.js"
        strategy="afterInteractive"
        id="arjs"
        onLoad={() => console.log('AR.js loaded')}
      />
      
      {/* 状态提示 */}
      {!arjsLoaded && !arjsError && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1001
        }}>
          正在加载 AR.js...
        </div>
      )}
      
      {children}
    </div>
  )
} 