import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">欢迎来到 MetaWEBot</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        MetaWEBot 是一个先进的 Web 和 WebXR 机器人控制平台，提供实时场景同步和远程控制功能。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <FunctionCard
          title="ModelView 案例库"
          description="展示 Web 3D 技术的多种应用。"
          href="/modelview-cases"
        />
        <FunctionCard
          title="AR 案例库" 
          description="基于 AR.js 和 Three.js 的增强现实演示案例集合。"
          href="/ar-cases"
        />
        <FunctionCard 
          title="Web机器人实时场景同步" 
          description="通过 Web 界面实时同步和监控机器人所处的场景。"
          href="/web-sync"
        />
        <FunctionCard 
          title="Web远程控制机器人" 
          description="使用 Web 界面远程操控和管理机器人。"
          href="/web-control"
        />
        <FunctionCard 
          title="WebXR全景机器人实时场景同步" 
          description="利用 WebXR 技术，在虚拟现实中体验机器人的实时场景。"
          href="/webxr-sync"
        />
        <FunctionCard 
          title="WebXR远程控制机器人" 
          description="在虚拟现实环境中远程操控机器人，提供沉浸式体验。"
          href="/webxr-control"
        />
      </div>
    </main>
  )
}

function FunctionCard({ title, description, href }: { title: string, description: string, href: string }) {
  return (
    <Link href={href} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}