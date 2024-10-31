'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    AFRAME: any;
    MINDAR: any;
  }
}

export default function FaceTryOnPage() {
  const [isClient, setIsClient] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initializeEvents = () => {
      const list = ["glasses1", "glasses2", "hat1", "hat2", "earring"]
      const visibles = [true, false, false, true, true]
      
      const setVisible = (button: Element, entities: NodeListOf<Element>, visible: boolean) => {
        if (visible) {
          button.classList.add("selected")
        } else {
          button.classList.remove("selected")
        }
        entities.forEach((entity) => {
          entity.setAttribute("visible", visible.toString())
        })
      }

      // 初始化点击事件
      list.forEach((item, index) => {
        const button = document.querySelector("#" + item)
        const entities = document.querySelectorAll("." + item + "-entity")
        if (button && entities) {
          setVisible(button, entities, visibles[index])
          button.addEventListener('click', () => {
            visibles[index] = !visibles[index]
            setVisible(button, entities, visibles[index])
          })
        }
      })

      // 监听模型加载完成事件
      const scene = document.querySelector('a-scene')
      if (scene) {
        scene.addEventListener('loaded', () => {
          console.log('Scene loaded')
          setIsLoaded(true)
        })

        // 监听目标检测事件
        scene.addEventListener('targetFound', () => {
          console.log('Target found')
        })

        scene.addEventListener('targetLost', () => {
          console.log('Target lost')
        })
      }
    }

    const checkScriptsLoaded = setInterval(() => {
      if (window.AFRAME && window.MINDAR) {
        clearInterval(checkScriptsLoaded)
        initializeEvents()
      }
    }, 100)

    return () => {
      clearInterval(checkScriptsLoaded)
    }
  }, [isClient])

  if (!isClient) {
    return <div className="fixed inset-0 bg-black"></div>
  }

  return (
    <>
      <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js" strategy="afterInteractive" />

      <div className="example-container">
        <div className="options-panel">
          <img id="hat1" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/hat/thumbnail.png" alt="hat1"/>
          <img id="hat2" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/hat2/thumbnail.png" alt="hat2"/>
          <img id="glasses1" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/thumbnail.png" alt="glasses1"/>
          <img id="glasses2" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses2/thumbnail.png" alt="glasses2"/>
          <img id="earring" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/earring/thumbnail.png" alt="earring"/>
        </div>

        <a-scene 
          mindar-face="autoStart: true; maxTrack: 1" 
          embedded 
          loading-screen="enabled: false"
          color-space="sRGB" 
          renderer="colorManagement: true, physicallyCorrectLights" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
        >
          <a-assets>
            <a-asset-item id="headModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/sparkar/headOccluder.glb"></a-asset-item>
            <a-asset-item id="glassesModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/scene.gltf"></a-asset-item>
            <a-asset-item id="glassesModel2" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses2/scene.gltf"></a-asset-item>
            <a-asset-item id="hatModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/hat/scene.gltf"></a-asset-item>
            <a-asset-item id="hatModel2" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/hat2/scene.gltf"></a-asset-item>
            <a-asset-item id="earringModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/earring/scene.gltf"></a-asset-item>
          </a-assets>

          <a-camera active="false" position="0 0 0"></a-camera>

          <a-entity mindar-face-target="anchorIndex: 168">
            <a-gltf-model 
              mindar-face-occluder 
              position="0 -0.3 0.15" 
              rotation="0 0 0" 
              scale="0.065 0.065 0.065" 
              src="#headModel"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 10">
            <a-gltf-model 
              rotation="0 -0 0" 
              position="0 1.0 -0.5" 
              scale="0.35 0.35 0.35" 
              src="#hatModel" 
              class="hat1-entity" 
              visible="true"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 10">
            <a-gltf-model 
              rotation="0 -0 0" 
              position="0 -0.2 -0.5" 
              scale="0.008 0.008 0.008" 
              src="#hatModel2" 
              class="hat2-entity" 
              visible="false"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 168">
            <a-gltf-model 
              rotation="0 -0 0" 
              position="0 0 0" 
              scale="0.01 0.01 0.01" 
              src="#glassesModel" 
              class="glasses1-entity" 
              visible="true"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 168">
            <a-gltf-model 
              rotation="0 -90 0" 
              position="0 -0.3 0" 
              scale="0.6 0.6 0.6" 
              src="#glassesModel2" 
              class="glasses2-entity" 
              visible="false"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 127">
            <a-gltf-model 
              rotation="-0.1 -0 0" 
              position="0 -0.3 -0.3" 
              scale="0.05 0.05 0.05" 
              src="#earringModel" 
              class="earring-entity" 
              visible="true"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 356">
            <a-gltf-model 
              rotation="0.1 -0 0" 
              position="0 -0.3 -0.3" 
              scale="0.05 0.05 0.05" 
              src="#earringModel" 
              class="earring-entity" 
              visible="true"
            ></a-gltf-model>
          </a-entity>
        </a-scene>
      </div>

      <style jsx>{`
        .example-container {
          overflow: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .options-panel {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 2;
        }
        .options-panel img {
          border: solid 2px;
          width: 50px;
          height: 50px;
          object-fit: cover;
          cursor: pointer;
        }
        .options-panel img.selected {
          border-color: green;
        }
        a-scene {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
        }
      `}</style>
    </>
  )
} 