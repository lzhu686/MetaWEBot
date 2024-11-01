'use client'

import { useState, useEffect } from 'react'

export default function ARLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // 客户端初始化
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      checkDeviceCompatibility()
    }
  }, [])

  const checkDeviceCompatibility = () => {
    if (typeof window === 'undefined') return

    // 检查浏览器兼容性
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isAndroid = /Android/.test(navigator.userAgent)
    
    if (isIOS && !navigator.userAgent.includes('Safari')) {
      setError('iOS设备请使用Safari浏览器访问')
      return
    }
    
    if (isAndroid && !navigator.userAgent.includes('Chrome')) {
      setError('Android设备请使用Chrome浏览器访问')
      return
    }

    // 检查是否支持摄像头
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('您的设备不支持摄像头访问，无法使用此功能')
      return
    }

    // 检查是否为 HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('此功能需要在 HTTPS 环境下使用')
      return
    }

    // 请求摄像头权限
    navigator.mediaDevices.getUserMedia({ 
      video: {
        facingMode: 'environment',
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight }
      } 
    })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop())
        setError(null)
      })
      .catch(err => {
        setError('无法访问摄像头，请确保已授予摄像头访问权限')
      })
  }

  return (
    <>
      {/* 错误提示 */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-4">出错了</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <div className="relative">
        {isClient && !error && children}
      </div>

      {/* 设备方向提示 */}
      {isClient && !error && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 text-center z-40">
          <p className="text-sm text-yellow-800">
            请保持设备垂直并缓慢移动，以获得最佳体验
          </p>
        </div>
      )}
    </>
  )
}
