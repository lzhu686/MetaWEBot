'use client'

import ModelViewer from '@/components/ModelViewer'

export default function WebSync() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Web机器人实时场景同步</h1>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ModelViewer
            src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
            alt="宇航员3D模型"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            style={{width: '100%', height: '400px'}}
          >
            <button slot="ar-button" style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              border: 'none',
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '8px 12px'
            }}>
              👋 激活AR
            </button>
          </ModelViewer>
          <p className="text-center mt-4">宇航员3D模型</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-300 z-0"></div>
          <div className="relative z-10">
            <ModelViewer
              src="https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb"
              alt="透明背景汽车3D模型"
              camera-controls
              touch-action="pan-y"
              auto-rotate
              style={{width: '100%', height: '400px', backgroundColor: 'unset'}}
            />
          </div>
          <p className="text-center mt-4 relative z-10">透明背景汽车3D模型</p>
        </div>
      </div>
      
      <p className="text-xl mt-8 text-center max-w-2xl">
        这里展示了两个3D模型。左侧是宇航员模型，右侧是透明背景的汽车模型。您可以使用鼠标或触摸屏来旋转和缩放模型。在支持AR的设备上，您还可以在增强现实中查看宇航员模型。
      </p>
    </main>
  )
}
