'use client'

import { AFrameContainer } from '@/components/aframe-container'

const aframeContent = `
  <a-scene
    embedded
    vr-mode-ui="enabled: false"
    renderer="antialias: true; alpha: true"
    loading-screen="enabled: false"
    arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;"
  >
    <a-camera 
      look-controls="enabled: false"
      position="0 0 0"
      cursor="fuse: false; rayOrigin: mouse;"
      raycaster="far: 10000; objects: .clickable"
    ></a-camera>

    <a-entity light="type: ambient; intensity: 1.0"></a-entity>
    <a-entity light="type: directional; intensity: 0.8" position="-1 1 0"></a-entity>

    <a-entity id="placementIndicator" visible="true" position="0 0 -3" class="clickable">
      <a-circle 
        radius="0.15" 
        rotation="-90 0 0" 
        material="shader: flat; color: #4CAF50; transparent: true; opacity: 0.8; side: double"
        animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true"
      ></a-circle>
    </a-entity>

    <a-entity id="models-container"></a-entity>
  </a-scene>
`

export default function AFrameSceneObjects() {
  const handlePlacement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const indicator = document.querySelector('#placementIndicator')
    if (!indicator) return
    
    const position = indicator.getAttribute('position')
    if (!position) return

    // 创建立方体
    const box = document.createElement('a-box')
    box.setAttribute('position', position)
    box.setAttribute('color', '#4CC3D9')
    box.setAttribute('scale', '0.5 0.5 0.5')
    box.setAttribute('class', 'clickable')
    
    // 添加点击事件改变大小
    box.addEventListener('click', function(this: any) {
      const currentScale = this.getAttribute('scale')
      const newScale = currentScale.x === 0.5 ? '1 1 1' : '0.5 0.5 0.5'
      this.setAttribute('scale', newScale)
    })

    // 添加到场景
    const container = document.querySelector('#models-container')
    if (container) {
      container.appendChild(box)
    }
  }

  return (
    <div className="relative w-screen h-screen select-none touch-none">
      <AFrameContainer content={aframeContent} />
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1002] space-y-4">
        <button
          onClick={handlePlacement}
          className="px-6 py-3 rounded-lg shadow-lg transition-colors select-none pointer-events-auto bg-blue-500 text-white hover:bg-blue-600"
        >
          放置立方体
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1002] select-none text-white">
        <h3 className="font-bold mb-2">使用说明：</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>移动鼠标调整放置位置（绿色圆圈）</li>
          <li>点击"放置立方体"按钮在指示位置创建立方体</li>
          <li>点击已放置的立方体可以改变其大小</li>
        </ul>
      </div>
    </div>
  )
}
