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
            reject(new Error('AR.js 加载失败：THREEx 对象未定义'));
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
        const camera = new THREE.PerspectiveCamera(
          75, // 视野角度（FOV）
          window.innerWidth / window.innerHeight, // 宽高比
          0.1, // 近平面
          1000 // 远平面
        );
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
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
          displayWidth: undefined,
          displayHeight: undefined,
          debugUIEnabled: true
        });

        // 初始化 AR 源
        await new Promise<void>((resolve, reject) => {
          try {
            arToolkitSource.init(() => {
              arToolkitSource.domElement.style.position = 'absolute';
              arToolkitSource.domElement.style.top = '0';
              arToolkitSource.domElement.style.left = '0';
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
          cameraParametersUrl: '/libs/ar-js/data/camera_para.dat',
          detectionMode: 'mono',
          maxDetectionRate: 60,
          canvasWidth: window.innerWidth,
          canvasHeight: window.innerHeight,
          debug: true
        });

        // 初始化 AR 上下文
        await new Promise<void>((resolve) => {
          arToolkitContext.init(async () => {
            // 等待一段时间确保完全初始化
            await new Promise(resolve => setTimeout(resolve, 1000));
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
            
            // 更新相机投影矩阵
            if (camera instanceof THREE.PerspectiveCamera) {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
            }
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
              // 确保 AR 上下文和控制器都已准备好
              if (arToolkitContext && arToolkitContext.arController) {
                arToolkitContext.update(arToolkitSource.domElement);
                scene.visible = camera.visible;
              }
              renderer.render(scene, camera);
            } catch (error) {
              console.warn('AR 渲染错误:', error);
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
        width: '100vw', 
        height: '100vh', 
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} 
    />
  );
} 