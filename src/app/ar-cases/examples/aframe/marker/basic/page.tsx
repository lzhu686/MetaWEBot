'use client'

import { AFrameContainer } from '@/components/aframe-container'

const aframeContent = `
  <a-scene embedded arjs='sourceType: webcam;'>
    <!-- 定义一个标记 -->
    <a-marker preset='hiro'>
      <!-- 在标记上添加3D模型 -->
      <a-box position='0 0.5 0' material='color: red;'></a-box>
    </a-marker>
    
    <!-- 添加相机 -->
    <a-entity camera></a-entity>
  </a-scene>
`

export default function AFrameMarkerBasic() {
  return <AFrameContainer content={aframeContent} />
}