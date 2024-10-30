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
      if (window.THREEx && window.THREEx.ArToolkitSource) {
        setArjsLoaded(true)
      }
    }

    window.addEventListener('load', checkARJS)
    return () => window.removeEventListener('load', checkARJS)
  }, [])

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.filename?.includes('ar.js')) {
        setArjsError('加载失败，请刷新页面重试')
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return (
    <div>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
        id="threejs"
      />
      <Script 
        src="https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js"
        strategy="afterInteractive"
        id="arjs"
      />
      
      {/* AR.js 加载状态提示 */}
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
          zIndex: 1000
        }}>
          正在加载 AR.js...
        </div>
      )}
      
      {arjsError && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          AR.js 加载失败: {arjsError}
        </div>
      )}

      {children}
    </div>
  )
} 