'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ARSceneProps {
  onError: (error: string) => void;
  onLoad: () => void;
}

declare global {
  interface Window {
    THREEx: any;
  }
}

// 添加设备检测工具函数
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /Android/.test(userAgent);
  const isMobile = isIOS || isAndroid;
  const isLowEndDevice = isMobile && (navigator.hardwareConcurrency || 4) <= 4;
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    isLowEndDevice
  };
};

export function ARScene({ onError, onLoad }: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || sceneInitialized.current) return;

    // 获取设备信息
    const { isMobile, isLowEndDevice } = getDeviceInfo();

    const checkARJS = () => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 20;
        
        const check = () => {
          attempts++;
          console.log(`检查 AR.js 是否加载 (尝试 ${attempts}/${maxAttempts})`);
          
          if (window.THREEx && window.THREEx.ArToolkitSource) {
            console.log('AR.js 已加载');
            resolve(true);
          } else if (attempts >= maxAttempts) {
            reject(new Error('AR.js 加载失败：THREEx 对象未定义'));
          } else {
            setTimeout(check, 500);
          }
        };
        
        check();
      });
    };

    // 性能监控函数
    let frameCount = 0;
    let lastTime = performance.now();
    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`当前FPS: ${fps}`);
        if (fps < 20 && isLowEndDevice) {
          console.warn('性能不足，建议降低画质设置');
        }
        frameCount = 0;
        lastTime = currentTime;
      }
    };

    const initAR = async () => {
      try {
        await checkARJS();
        
        if (!window.THREEx) {
          throw new Error('Three.js 未加载');
        }
        
        // 创建场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          isMobile ? 60 : 45,  // FOV (视场角)
          window.innerWidth / window.innerHeight,
          0.5, // 近裁剪面 0.1-1.0（太小可能造成z-fighting）
          1000 // 远裁剪面 100-2000（太大可能造成z-fighting）
        );

        const renderer = new THREE.WebGLRenderer({
          antialias: !isMobile,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        if (isMobile) {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // 限制最大像素比
        } else {
          renderer.setPixelRatio(window.devicePixelRatio);
        }
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '1';

        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement);
        }

        // 等待一小段时间确保 AR.js 完全初始化
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 创建 AR 工具包源
        const arToolkitSource = new window.THREEx.ArToolkitSource({
          sourceType: 'webcam',
          sourceWidth: window.innerWidth,    // 添加源宽度
          sourceHeight: window.innerHeight,  // 添加源高度
          displayWidth: window.innerWidth,   // 添加显示宽度
          displayHeight: window.innerHeight, // 添加显示高度
          debugUIEnabled: false
        });

        // 初始化 AR 源时设置视频元素样式
        await new Promise<void>((resolve, reject) => {
          try {
            arToolkitSource.init(() => {
              arToolkitSource.domElement.style.position = 'absolute';
              arToolkitSource.domElement.style.top = '0';
              arToolkitSource.domElement.style.left = '0';
              arToolkitSource.domElement.style.width = '100%';     // 确保宽度100%
              arToolkitSource.domElement.style.height = '100%';    // 确保高度100%
              arToolkitSource.domElement.style.objectFit = 'cover'; // 添加objectFit
              arToolkitSource.domElement.style.zIndex = '0';
              
              if (containerRef.current) {
                containerRef.current.appendChild(arToolkitSource.domElement);
              }
              
              console.log('AR 源初始化完成');
              setTimeout(resolve, 1000);
            });
          } catch (error: any) {
            reject(new Error('AR 源初始化失败: ' + error.message));
          }
        });

        // 创建 AR 上下文
        const arToolkitContext = new window.THREEx.ArToolkitContext({
          cameraParametersUrl: '/libs/ar-js/data/camera_para.dat', // 相机标定参数
          detectionMode: 'mono',  // 单目检测模式
          maxDetectionRate: isMobile ? 30 : 60,  // 移动端降低检测帧率
          canvasWidth: window.innerWidth,   // 画布尺寸
          canvasHeight: window.innerHeight,
          patternRatio: isMobile ? 0.65 : 0.5,  // 移动端增加识别比例
          imageSmoothingEnabled: !isMobile,  // 移动端关闭图像平滑
          debug: false  // 调试模式
        });

        // 初始化 AR 上下文
        await new Promise<void>((resolve) => {
          arToolkitContext.init(() => {
            // 复制 AR.js 的投影矩阵到 Three.js 相机
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
            
            // 添加这部分代码来调整投影矩阵
            const scale = window.innerWidth / window.innerHeight;
            if (scale > 1) {
              camera.projectionMatrix.elements[0] /= scale;
            } else {
              camera.projectionMatrix.elements[5] *= scale;
            }
            
            console.log('AR 上下文初始化完成');
            resolve();
          });
        });

        // 创建标记和 3D 对象
        const markerRoot = new THREE.Group();
        scene.add(markerRoot);

        // 创建标记控制器
        new window.THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
          type: 'pattern',
          patternUrl: '/libs/ar-js/data/patt.hiro',
          smooth: true,         // 启用平滑
          smoothCount: isMobile ? 3 : 5,  // 移动端减少平滑帧数
          smoothTolerance: isMobile ? 0.02 : 0.01,  // 移动端增加容差
          smoothThreshold: isMobile ? 3 : 2    // 平滑阈值 - 影响突变检测，突变调整这里
        });

        // 创建立方体
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.4;
        markerRoot.add(cube);

        // 处理窗口大小变化
        const onResize = () => {
          arToolkitSource.onResizeElement();
          arToolkitSource.copyElementSizeTo(renderer.domElement);
          
          if (arToolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
            
            // 更新相机和投影矩阵
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            
            // 更新渲染器尺寸
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
          
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onResize);
        onResize();

        // 动画循环
        const animate = () => {
          requestAnimationFrame(animate);
          if (arToolkitSource.ready === true) {
            try {
              renderer.clear();
              if (arToolkitContext.arController !== null) {
                arToolkitContext.update(arToolkitSource.domElement);
                // 确保场景可见性与相机同步
                scene.visible = camera.visible;
              }
              renderer.render(scene, camera);
              if (isLowEndDevice) {
                monitorPerformance();
              }
            } catch (error) {
              console.warn('AR 渲染错误:', error);
              onError('AR渲染出现问题，请刷新页面重试');
            }
          }
        };

        animate();
        console.log('AR 场景初始化完成');
        onLoad();
        sceneInitialized.current = true;

        return () => {
          window.removeEventListener('resize', onResize);
          renderer.dispose();
          geometry.dispose();
          material.dispose();
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        };
      } catch (error: any) {
        console.error('AR初始化失败:', error);
        onError(error.message || 'AR场景初始化失败');
      }
    };

    initAR();
  }, [onError, onLoad]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed',           // 改为fixed
        top: 0,
        left: 0,
        width: '100vw',             // 使用vw
        height: '100vh',            // 使用vh
        backgroundColor: '#000',
        overflow: 'hidden',
        zIndex: 1000
      }} 
    />
  );
} 