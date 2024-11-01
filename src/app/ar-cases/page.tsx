'use client'

import { FunctionCard } from '@/components/function-card'
import { PageTitle } from '@/components/page-title'

export default function ARCasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="AR 案例库" 
        description="基于 AR.js、MindAR、ARCore 的 Three.js 与 A-Frame 增强现实示例集合"
      />

      {/* 场景物体放置区块 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">场景物体放置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FunctionCard
            title="ARCore 场景物体放置"
            description="使用 ARCore 实现虚拟物体在真实场景中的放置与交互"
            href="/ar-cases/examples/ARCore/scene-objects"
          />
          <FunctionCard
            title="A-Frame 场景物体放置"
            description="使用 A-Frame 实现虚拟物体在真实场景中的放置与交互"
            href="/ar-cases/examples/aframe/scene-objects"
          />
        </div>
      </div>

      {/* 图像追踪区块 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">图像追踪</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FunctionCard
            title="Three.js 标记追踪"
            description="使用基础标记（Hiro、Kanji等）进行3D模型展示"
            href="/ar-cases/examples/threejs/marker/basic"
          />
          <FunctionCard
            title="A-Frame 标记追踪"
            description="使用A-Frame实现基础标记追踪"
            href="/ar-cases/examples/aframe/marker/basic"
          />
          <FunctionCard
            title="A-Frame AI 标记追踪"
            description="使用A-Frame实现基于AI的标记识别与交互"
            href="/ar-cases/examples/aframe/marker/ai"
          />
        </div>
      </div>

      {/* 人脸追踪区块 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">人脸追踪</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FunctionCard
            title="MindAR 人脸追踪"
            description="基于MindAR的人脸追踪与虚拟试戴"
            href="/ar-cases/examples/mindar/face/tryon"
          />
        </div>
      </div>

      {/* 文档和资源链接 */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">相关资源</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="https://developers.google.com/ar" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            ARCore 官方文档
          </a>
          <a 
            href="https://ar-js-org.github.io/AR.js-Docs/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            AR.js 官方文档
          </a>
          <a 
            href="https://aframe.io/docs/1.4.0/introduction/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            A-Frame 文档
          </a>
          <a 
            href="https://hiukim.github.io/mind-ar-js-doc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            MindAR 官方文档
          </a>
        </div>
      </div>
    </div>
  )
}
