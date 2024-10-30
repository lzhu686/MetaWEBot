'use client'

import { useEffect, useState } from 'react'

interface AFrameContainerProps {
  content: string;
  arEnabled?: boolean;
}

export function AFrameContainer({ content, arEnabled = true }: AFrameContainerProps) {
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = src
        script.async = false
        script.crossOrigin = 'anonymous'
        script.onload = () => resolve()
        script.onerror = (e) => reject(e)
        document.head.appendChild(script)
      })
    }

    const loadScripts = async () => {
      try {
        // 使用 本地链接
        await loadScript('/libs/ar-js/aframe/three.min.js')
        console.log('Three.js loaded')

        await loadScript('/libs/ar-js/aframe/aframe.min.js')
        console.log('A-Frame loaded')

        if (arEnabled) {
          await loadScript('/libs/ar-js/aframe/aframe-ar.js')
          console.log('AR.js loaded')
        }

        // 给脚本一点时间初始化
        setTimeout(() => {
          setScriptsLoaded(true)
        }, 1000)

      } catch (error) {
        console.error('Error loading scripts:', error)
      }
    }

    loadScripts()

    return () => {
      // 清理函数
      setScriptsLoaded(false)
    }
  }, [arEnabled])

  if (!scriptsLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-[1001]">
        <div className="text-center">
          <p className="mb-4">正在加载 AR 组件...</p>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        overflow: 'hidden'
      }} 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  )
} 