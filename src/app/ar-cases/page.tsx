'use client'

import { FunctionCard } from '@/components/function-card'
import { PageTitle } from '@/components/page-title'

export default function ARCasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="AR 案例库" 
        description="基于 AR.js 的 Three.js 与 A-Frame 增强现实示例集合"
      />

      {/* Three.js 示例区块 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Three.js AR 示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FunctionCard
            title="标记追踪基础"
            description="使用基础标记（Hiro、Kanji等）进行3D模型展示"
            href="/ar-cases/examples/threejs/marker/basic"
          />
          <FunctionCard
            title="标记动画"
            description="在标记上展示带动画效果的3D模型"
            href="/ar-cases/examples/threejs/marker/animation"
          />
          <FunctionCard
            title="位置导航"
            description="基于地理位置的AR导航示例"
            href="/ar-cases/examples/threejs/location/navigation"
          />
          <FunctionCard
            title="兴趣点展示"
            description="展示周边POI（兴趣点）信息"
            href="/ar-cases/examples/threejs/location/poi"
          />
          <FunctionCard
            title="图像追踪"
            description="使用自定义图像作为追踪目标"
            href="/ar-cases/examples/threejs/image/tracking"
          />
          <FunctionCard
            title="图像互动"
            description="与追踪图像上的AR内容进行交互"
            href="/ar-cases/examples/threejs/image/interactive"
          />
        </div>
      </div>

      {/* A-Frame 示例区块 */}
      <div>
        <h2 className="text-2xl font-bold mb-6">A-Frame AR 示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FunctionCard
            title="A-Frame 标记基础"
            description="使用A-Frame实现基础标记追踪"
            href="/ar-cases/examples/aframe/marker/basic"
          />
          <FunctionCard
            title="A-Frame 场景动画"
            description="在A-Frame中实现AR场景动画"
            href="/ar-cases/examples/aframe/marker/animation"
          />
          <FunctionCard
            title="A-Frame 位置服务"
            description="使用A-Frame实现位置基础服务"
            href="/ar-cases/examples/aframe/location/places"
          />
          <FunctionCard
            title="A-Frame 图像覆盖"
            description="使用A-Frame实现图像追踪和覆盖"
            href="/ar-cases/examples/aframe/image/overlay"
          />
        </div>
      </div>

      {/* 文档和资源链接 */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">相关资源</h3>
        <ul className="space-y-2">
          <li>
            <a 
              href="https://ar-js-org.github.io/AR.js-Docs/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              AR.js 官方文档
            </a>
          </li>
          <li>
            <a 
              href="https://aframe.io/docs/1.4.0/introduction/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              A-Frame 文档
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
