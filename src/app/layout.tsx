import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MetaWEBot - 先进的Web和WebXR机器人控制平台',
  description: 'MetaWEBot提供Web和WebXR环境下的机器人实时场景同步和远程控制功能。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <Script
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="beforeInteractive"
          type="module"
        />
      </head>
      <body className={`${inter.className} bg-gray-100`}>{children}</body>
    </html>
  )
}
