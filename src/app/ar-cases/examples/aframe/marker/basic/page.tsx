'use client'

import { AFrameContainer } from '@/components/aframe-container'
import { useEffect, useState } from 'react'

const aframeContent = `
  <a-scene embedded
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false"
    arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;">
    
    <a-marker preset="hiro">
      <a-box 
        position="0 0.5 0" 
        material="color: red;"
        scale="1 1 1"
        rotation="0 45 0"
      >
        <a-animation 
          attribute="rotation"
          dur="3000"
          to="0 360 0"
          repeat="indefinite"
          easing="linear"
        ></a-animation>
      </a-box>
    </a-marker>
    
    <a-entity camera></a-entity>
  </a-scene>
`

export default function AFrameMarkerBasic() {
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // 检查是否为 HTTPS 或本地环境
    const isSecureContext = window.isSecureContext
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    if (!isSecureContext && !isLocalhost) {
      setError('请使用 HTTPS 连接访问此页面')
      return
    }

    // 检查浏览器兼容性
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // 检查是否为iOS设备
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      if (isIOS) {
        setError('iOS设备请使用Safari浏览器访问')
      } else {
        setError('您的浏览器不支持摄像头访问，请使用最新版本的Chrome、Firefox或Safari')
      }
      return
    }

    // 请求摄像头权限
    const constraints = {
      video: {
        facingMode: 'environment', // 优先使用后置摄像头
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        setHasWebcamPermission(true)
        stream.getTracks().forEach(track => track.stop())
      })
      .catch(err => {
        console.error('摄像头访问错误:', err)
        if (err.name === 'NotAllowedError') {
          setError('请允许访问摄像头权限以使用AR功能')
        } else if (err.name === 'NotFoundError') {
          setError('未找到摄像头设备')
        } else {
          setError('无法访问摄像头，请确保已授予摄像头权限并刷新页面')
        }
      })
  }, [])

  const handleRetry = () => {
    setError('')
    setHasWebcamPermission(false)
    window.location.reload()
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <div className="text-center p-4 max-w-md mx-auto">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="text-sm text-gray-400 mb-4">
            提示：
            <ul className="list-disc text-left pl-5 mt-2">
              <li>确保使用支持的浏览器（Chrome、Firefox、Safari）</li>
              <li>允许浏览器访问摄像头权限</li>
              <li>如果使用iOS设备，请使用Safari浏览器</li>
              <li>确保设备有可用的摄像头</li>
            </ul>
          </div>
          <button 
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!hasWebcamPermission) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <div className="text-center p-4">
          <p className="mb-4">正在请求摄像头权限...</p>
          <p className="text-sm text-gray-400">请在弹出的权限请求中选择"允许"</p>
        </div>
      </div>
    )
  }

  return <AFrameContainer content={aframeContent} />
}