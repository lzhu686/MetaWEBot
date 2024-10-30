'use client'

import { AFrameContainer } from '@/components/aframe-container'

const aframeContent = `
  <a-scene embedded arjs='sourceType: webcam; debugUIEnabled: false;'>
    <!-- 定义一个标记 -->
    <a-marker preset='hiro'>
      <!-- 添加3D文本显示AI分析结果 -->
      <a-text
        value="AI分析中..."
        position="0 0.5 0"
        rotation="-90 0 0"
        align="center"
        color="#000000"
        id="ai-result">
      </a-text>
      
      <!-- 添加一个简单的AI图标模型 -->
      <a-entity
        position="0 0 0"
        scale="0.5 0.5 0.5">
        <a-sphere color="#4CC3D9" radius="0.5">
          <a-animation
            attribute="position"
            dur="1000"
            direction="alternate"
            easing="ease-in-out-cubic"
            to="0 0.1 0"
            repeat="indefinite">
          </a-animation>
        </a-sphere>
      </a-entity>
    </a-marker>

    <!-- 添加相机 -->
    <a-entity camera></a-entity>
  </a-scene>
`

export default function AFrameMarkerAI() {
  return <AFrameContainer content={aframeContent} />
} 