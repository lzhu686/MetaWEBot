'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function ARCoreSceneObjectsPage() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isChecking, setIsChecking] = useState(false)

  const checkARSupport = async () => {
    setIsChecking(true)
    setErrorMessage('')
    
    try {
      // 1. 检查 WebXR API
      if (!navigator.xr) {
        throw new Error('您的浏览器不支持 WebXR API')
      }
      console.log('✅ WebXR API 可用')

      // 2. 检查浏览器
      const userAgent = navigator.userAgent
      console.log('当前浏览器信息:', userAgent)
      
      if (!/Chrome/i.test(userAgent)) {
        throw new Error('请使用 Chrome 浏览器')
      }
      console.log('✅ 使用的是 Chrome 浏览器')

      // 3. 检查设备
      const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent)
      if (!isMobile) {
        throw new Error('请使用移动设备访问')
      }
      console.log('✅ 使用的是移动设备')

      // 4. 检查 HTTPS
      if (
        window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost'
      ) {
        throw new Error('需要使用 HTTPS 协议')
      }
      console.log('✅ 使用的是安全协议')

      // 5. 检查 AR 会话支持
      const isArSupported = await navigator.xr.isSessionSupported('immersive-ar')
      if (!isArSupported) {
        throw new Error(
          '设备不支持 AR 功能，请确保：\n' +
          '1. 使用 Android 设备\n' +
          '2. 已安装 ARCore (Google Play Services for AR)\n' +
          '3. Chrome 版本 >= 93'
        )
      }
      console.log('✅ AR 会话支持检查通过')

      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      console.error('❌ AR 检查失败:', message)
      setErrorMessage(message)
      return false
    } finally {
      setIsChecking(false)
    }
  }

  const initAR = async () => {
    const isSupported = await checkARSupport()
    if (!isSupported) return

    try {
      // 请求 AR 会话
      const session = await navigator.xr!.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      })

      console.log('✅ AR 会话创建成功')
      
      // ... 其余 AR 初始化代码 ...

    } catch (error) {
      console.error('AR 初始化失败:', error)
      setErrorMessage(error instanceof Error ? error.message : '未知错误')
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4">
      <button
        className={`px-6 py-3 rounded-lg text-white font-semibold ${
          isChecking ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={initAR}
        disabled={isChecking}
      >
        {isChecking ? '检查 AR 支持中...' : '开始 AR 体验'}
      </button>

      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-line">
          {errorMessage}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">使用要求：</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Android 设备</li>
          <li>Chrome 浏览器（93+）</li>
          <li>已安装 ARCore</li>
          <li>HTTPS 环境</li>
        </ul>
      </div>
    </div>
  )
}