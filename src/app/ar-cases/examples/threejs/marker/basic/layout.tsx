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
    // 检查设备和浏览器兼容性
    const checkCompatibility = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      const isAndroid = /Android/.test(navigator.userAgent)
      const isMobile = isIOS || isAndroid
      
      if (isIOS && !navigator.userAgent.includes('Safari')) {
        setArjsError('iOS设备请使用Safari浏览器访问')
        return false
      }
      
      if (isAndroid && !navigator.userAgent.includes('Chrome')) {
        setArjsError('Android设备请使用Chrome浏览器访问')
        return false
      }
      
      if (isMobile && window.innerWidth < 480) {
        setArjsError('请将设备横屏使用以获得更好的体验')
        return false
      }
      
      return true
    }

    if (!checkCompatibility()) return

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
        setArjsError('AR.js 加载超时，请检查网络连接并刷新页面')
      }
    }, 10000)

    // 添加屏幕方向变化监听
    const handleOrientation = () => {
      if (window.innerWidth < window.innerHeight) {
        setArjsError('请将设备横屏使用以获得更好的体验')
      } else {
        setArjsError('')
      }
    }

    window.addEventListener('orientationchange', handleOrientation)
    window.addEventListener('resize', handleOrientation)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      window.removeEventListener('orientationchange', handleOrientation)
      window.removeEventListener('resize', handleOrientation)
    }
  }, [])

  return (
    <div>
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-sm z-50">
          正在加载 AR 组件...
        </div>
      )}
      
      {arjsError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 text-white z-50 p-4">
          <div className="text-center max-w-md">
            <p className="text-red-500 mb-4">{arjsError}</p>
            <div className="text-sm text-gray-400 mb-4">
              提示：
              <ul className="list-disc text-left pl-5 mt-2">
                <li>iOS设备请使用Safari浏览器</li>
                <li>Android设备请使用Chrome浏览器</li>
                <li>请将设备横屏使用</li>
                <li>确保网络连接正常</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              刷新重试
            </button>
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
} 