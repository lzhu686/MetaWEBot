'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import ModelViewer, { ModelViewerElement } from '@/components/ModelViewer'

const handleError = (event: Event) => {
  console.error('Model loading error:', event);
};

export default function ModelViewCases() {
  const animatedModelRef = useRef<ModelViewerElement>(null);
  const [currentAnimation, setCurrentAnimation] = useState('Running');
  const horseModelRef = useRef<ModelViewerElement>(null);
  const [isHorseModelLoaded, setIsHorseModelLoaded] = useState(false);

  const handleHorseModelLoad = useCallback(() => {
    setIsHorseModelLoaded(true);
  }, []);

  useEffect(() => {
    const modelViewer = animatedModelRef.current;
    if (modelViewer) {
      const interval = setInterval(() => {
        const newAnimation = currentAnimation === 'Running' ? 'Wave' : 'Running';
        modelViewer.animationName = newAnimation;
        setCurrentAnimation(newAnimation);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentAnimation]);

  useEffect(() => {
    if (!isHorseModelLoaded) return;

    const horseModelElement = document.querySelector('#animation-demo') as HTMLElement;
    if (!horseModelElement) return;

    const lines = horseModelElement.querySelectorAll('.line') as NodeListOf<SVGLineElement>;
    let baseRect: DOMRect;
    let noseRect: DOMRect;
    let hoofRect: DOMRect;
    let tailRect: DOMRect;
    let animationFrameId: number;

    const onResize = () => {
      baseRect = horseModelElement.getBoundingClientRect();
      noseRect = document.querySelector('#nose')?.getBoundingClientRect() || new DOMRect();
      hoofRect = document.querySelector('#hoof')?.getBoundingClientRect() || new DOMRect();
      tailRect = document.querySelector('#tail')?.getBoundingClientRect() || new DOMRect();
    };

    const drawLine = (svgLine: SVGLineElement, name: string, rect: DOMRect) => {
      const hotspot = (horseModelElement as any).queryHotspot('hotspot-' + name);
      if (hotspot && svgLine) {
        const { x, y } = hotspot.canvasPosition;
        svgLine.setAttribute('x1', x.toString());
        svgLine.setAttribute('y1', y.toString());
        svgLine.setAttribute('x2', ((rect.left + rect.right) / 2 - baseRect.left).toString());
        svgLine.setAttribute('y2', (rect.top - baseRect.top).toString());
      }
    };

    const startSVGRenderLoop = () => {
      if (baseRect && noseRect && hoofRect && tailRect) {
        drawLine(lines[0], 'nose', noseRect);
        drawLine(lines[1], 'hoof', hoofRect);
        drawLine(lines[2], 'tail', tailRect);
      }
      animationFrameId = requestAnimationFrame(startSVGRenderLoop);
    };

    onResize();
    startSVGRenderLoop();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHorseModelLoaded]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-5xl font-bold mb-12 text-center text-blue-600 shadow-text">ModelView 案例库</h1>
      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* 宇航员模型 */}
        <div className="space-y-6 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold text-center text-gray-800">宇航员模型</h2>
          <ModelViewer
            src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
            alt="宇航员3D模型"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            style={{width: '100%', height: '400px'}}
            className="rounded-lg"
          >
            <button slot="ar-button" className="bg-blue-500 text-white rounded-md border-none absolute bottom-4 right-4 px-4 py-2 font-medium hover:bg-blue-600 transition-colors">
              👋 激活AR
            </button>
          </ModelViewer>
          <p className="text-center text-gray-600">这是一个可交互的宇航员3D模型。您可以旋转、缩放模型，甚至在支持的设备上使用AR功能。</p>
        </div>
        
        {/* 动画机器人模型 */}
        <div className="space-y-6 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold text-center text-gray-800">动画机器人模型</h2>
          <ModelViewer
            ref={animatedModelRef}
            src="https://modelviewer.dev/shared-assets/models/RobotExpressive.glb"
            alt="带有动画的机器人3D模型"
            camera-controls
            touch-action="pan-y"
            autoplay
            animation-name={currentAnimation}
            ar
            ar-modes="webxr scene-viewer"
            scale="0.5 0.5 0.5"
            shadow-intensity="1"
            style={{width: '100%', height: '400px'}}
            className="rounded-lg"
            onError={handleError}
          />
          <p className="text-center text-gray-600">这个机器人模型会在"跑步"和"挥手"动作之间自动切换。当前动画: {currentAnimation}</p>
        </div>
        
        {/* 马模型跟踪演示 */}
        <div className="space-y-6 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold text-center text-gray-800">马模型跟踪演示</h2>
          <ModelViewer
            ref={horseModelRef}
            id="animation-demo"
            src="https://modelviewer.dev/shared-assets/models/Horse.glb"
            alt="A 3D model of a horse galloping."
            autoplay
            ar
            ar-modes="webxr"
            ar-status="not-presenting"
            scale="0.01 0.01 0.01"
            camera-orbit="90deg auto auto"
            shadow-intensity="1"
            camera-controls
            touch-action="pan-y"
            style={{width: '100%', height: '400px'}}
            className="rounded-lg"
            onLoad={handleHorseModelLoad}
            onError={handleError}
          >
            <div slot="hotspot-nose" className="anchor" data-surface="0 0 228 113 111 0.217 0.341 0.442"></div>
            <div slot="hotspot-hoof" className="anchor" data-surface="0 0 752 733 735 0.132 0.379 0.489"></div>
            <div slot="hotspot-tail" className="anchor" data-surface="0 0 220 221 222 0.405 0.061 0.534"></div>
            <svg id="lines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="lineContainer">
              <line className="line"></line>
              <line className="line"></line>
              <line className="line"></line>
            </svg>
            <div id="container">
              <button id="nose" className="label">鼻子</button>
              <button id="hoof" className="label">蹄子</button>
              <button id="tail" className="label">尾巴</button>
            </div>
          </ModelViewer>
          <p className="text-center text-gray-600">这个马模型演示了如何在3D模型上添加交互式标记和动态线条跟踪。</p>
        </div>
        
        {/* HDR天空盒头盔模型 */}
        <div className="space-y-6 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold text-center text-gray-800">HDR天空盒头盔模型</h2>
          <ModelViewer
            src="https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF/DamagedHelmet.gltf"
            alt="使用HDR天空盒的损坏头盔3D模型"
            camera-controls
            touch-action="pan-y"
            skybox-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.jpg"
            style={{width: '100%', height: '400px'}}
            className="rounded-lg"
          />
          <p className="text-center text-gray-600">
            这个模型展示了如何使用HDR天空盒来增强3D模型的光照效果。HDR图像提供了更高的动态范围，能够更真实地表现自然或人工场景的光照。
          </p>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-gray-600">
        <p className="max-w-6xl mx-auto">
          ModelView 案例库展示了 Web 3D 技术的多种应用。从简单的模型展示到复杂的动画和 AR 交互，3D 技术为网页设计和用户体验带来了无限可能。
          <br/>探索每个模型，体验未来网页的交互方式！
        </p>
      </footer>
    </main>
  )
}
