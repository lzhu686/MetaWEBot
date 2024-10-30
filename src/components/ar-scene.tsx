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

export function ARScene({ onError, onLoad }: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || sceneInitialized.current) return;

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
            // 如果检查失败，尝试重新加载脚本
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            
            threeScript.onload = () => {
              const arScript = document.createElement('script');
              arScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js';
              
              arScript.onload = () => {
                if (window.THREEx && window.THREEx.ArToolkitSource) {
                  console.log('AR.js 动态加载成功');
                  resolve(true);
                } else {
                  reject(new Error('AR.js 加载失败：THREEx 对象未定义'));
                }
              };
              
              arScript.onerror = () => reject(new Error('AR.js 加载失败'));
              document.head.appendChild(arScript);
            };
            
            threeScript.onerror = () => reject(new Error('Three.js 加载失败'));
            document.head.appendChild(threeScript);
          } else {
            setTimeout(check, 500);
          }
        };
        
        check();
      });
    };

    const initAR = async () => {
      try {
        // 等待 AR.js 加载完成
        await checkARJS();
        // 确保 THREE 对象存在
        if (!window.THREEx) {
          throw new Error('Three.js 未加载');
        }
        
        // 创建场景
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement);
        }

        // 等待一小段时间确保 AR.js 完全初始化
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 创建 AR 工具包源
        const arToolkitSource = new window.THREEx.ArToolkitSource({
          sourceType: 'webcam',
          sourceWidth: window.innerWidth,
          sourceHeight: window.innerHeight,
          displayWidth: window.innerWidth,
          displayHeight: window.innerHeight,
        });

        // 初始化 AR 源
        await new Promise<void>((resolve, reject) => {
          try {
            arToolkitSource.init(() => {
              console.log('AR 源初始化完成');
              setTimeout(resolve, 1000);
            });
          } catch (error: any) {
            reject(new Error('AR 源初始化失败: ' + error.message));
          }
        });

        // 创建 AR 上下文
        const arToolkitContext = new window.THREEx.ArToolkitContext({
          cameraParametersUrl: '/libs/ar-js/data/camera_para.dat',
          detectionMode: 'mono',
          maxDetectionRate: 60,
          canvasWidth: window.innerWidth,
          canvasHeight: window.innerHeight,
        });

        // 初始化 AR 上下文
        await new Promise<void>((resolve) => {
          arToolkitContext.init(() => {
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
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
        });

        // 创建立方体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        markerRoot.add(cube);

        // 处理窗口大小变化
        const onResize = () => {
          arToolkitSource.onResizeElement();
          arToolkitSource.copyElementSizeTo(renderer.domElement);
          if (arToolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
          }
        };

        window.addEventListener('resize', onResize);
        onResize();

        // 动画循环
        const animate = () => {
          requestAnimationFrame(animate);
          if (arToolkitSource.ready) {
            arToolkitContext.update(arToolkitSource.domElement);
            scene.visible = camera.visible;
          }
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
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
        width: '100vw', 
        height: '100vh', 
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'transparent'
      }} 
    />
  );
} 