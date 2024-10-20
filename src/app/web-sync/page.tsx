'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

interface ModelViewerProps {
  src: string;
  alt: string;
  ar?: boolean;
  'ar-modes'?: string;
  'camera-controls'?: boolean;
  'touch-action'?: string;
  'auto-rotate'?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

const ModelViewer = dynamic<ModelViewerProps>(
  () => import('@google/model-viewer').then((mod) => {
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      customElements.define('model-viewer', mod.ModelViewerElement);
    }
    return function WrappedModelViewer(props: ModelViewerProps) {
      return <model-viewer {...props} />;
    };
  }),
  { ssr: false }
)

export default function WebSync() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Web机器人实时场景同步</h1>
      
      {isClient && (
        <div className="w-full max-w-4xl">
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
        </div>
      )}
      
      <p className="text-xl mt-8 text-center max-w-2xl">
        这里展示了一个宇航员3D模型。您可以使用鼠标或触摸屏来旋转和缩放模型。在支持AR的设备上,您还可以在增强现实中查看模型。
      </p>
    </main>
  )
}
