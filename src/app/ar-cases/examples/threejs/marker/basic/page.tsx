'use client'

import { useState, useCallback } from 'react';
import { ARScene } from '@/components/three-ar-scene';
import dynamic from 'next/dynamic';

// 状态类型定义
type ARStatus = 'ready' | 'loading' | 'running' | 'error';

// 动态导入 AR 场景组件
const DynamicARScene = dynamic(() => import('@/components/three-ar-scene').then(mod => mod.ARScene), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: 'transparent'
    }}>
      正在加载 AR 组件...
    </div>
  )
});

export default function MarkerBasic() {
  const [status, setStatus] = useState<ARStatus>('ready');
  const [errorMessage, setErrorMessage] = useState('');

  // 错误处理
  const handleError = useCallback((message: string) => {
    console.error('AR错误:', message);
    setStatus('error');
    setErrorMessage(message);
  }, []);

  // 加载完成处理
  const handleLoad = useCallback(() => {
    console.log('AR场景加载完成');
    setStatus('running');
  }, []);

  // 开始 AR 体验
  const startAR = useCallback(async () => {
    try {
      setStatus('loading');
      
      // 检查是否为安全上下文
      if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        throw new Error('请使用 HTTPS 连接访问此页面');
      }

      // 检查浏览器兼容性
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS) {
          throw new Error('iOS设备请使用Safari浏览器');
        } else {
          throw new Error('您的浏览器不支持AR功能，请使用最新版本的Chrome、Firefox或Safari');
        }
      }

      // 检 AR.js
      if (!window.THREEx) {
        throw new Error('AR组件未加载，请刷新页面重试');
      }

      // 请求摄像头权限
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (stream.getVideoTracks().length > 0) {
        setStatus('running');
      } else {
        throw new Error('无法获取视频流');
      }
    } catch (error: any) {
      console.error('AR初始化错误:', error);
      handleError(error.message || '无法访问摄像头，请确保已授予摄像头权限。');
    }
  }, [handleError]);

  // 重试处理
  const handleRetry = useCallback(() => {
    setStatus('ready');
    setErrorMessage('');
  }, []);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {status === 'ready' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <button
            onClick={startAR}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            开启 AR 体验
          </button>
          <div style={{
            color: 'white',
            marginTop: '10px',
            fontSize: '14px'
          }}>
            点击按钮开启摄像头
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center'
        }}>
          正在初始化 AR 场景...
        </div>
      )}

      {status === 'error' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'red',
          textAlign: 'center'
        }}>
          {errorMessage}
          <button
            onClick={handleRetry}
            style={{
              display: 'block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        </div>
      )}

      {status === 'running' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}>
          <DynamicARScene onError={handleError} onLoad={handleLoad} />
        </div>
      )}
    </div>
  );
}