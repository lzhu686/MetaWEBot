'use client'

import { useState, useCallback } from 'react';
import { ARScene } from '@/components/ar-scene';
import dynamic from 'next/dynamic';

// 状态类型定义
type ARStatus = 'ready' | 'loading' | 'running' | 'error';

// 动态导入 AR 场景组件
const DynamicARScene = dynamic(() => Promise.resolve(ARScene), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      textAlign: 'center'
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
      
      // 检查 AR.js 是否已加载
      if (!window.THREEx) {
        throw new Error('AR.js 未加载，请刷新页面重试');
      }

      // 请求摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment'
        } 
      });
      
      if (stream.getVideoTracks().length > 0) {
        setStatus('running');
      } else {
        throw new Error('无法获取视频流');
      }
    } catch (error: any) {
      console.error('AR初始化错误:', error);
      handleError(error.message || '无法访问摄像头，请确保已授予摄像头访问权限。');
    }
  }, [handleError]);

  // 重试处理
  const handleRetry = useCallback(() => {
    setStatus('ready');
    setErrorMessage('');
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#000'
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