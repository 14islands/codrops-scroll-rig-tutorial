import React, { useRef } from 'react'
import { ScrollScene, UseCanvas, useScrollbar, useScrollRig, styles, useImageAsTexture } from '@14islands/r3f-scroll-rig'
import { useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial } from '@react-three/drei'
import { a, useSpring, config } from '@react-spring/three'

export function ImageCube({ src, ...props }) {
  const el = useRef()
  const img = useRef()
  const { hasSmoothScrollbar } = useScrollRig()
  return (
    <>
      <div ref={el} {...props}>
        <img
          className={styles.hiddenWhenSmooth}
          ref={img}
          src={src}
          loading="eager"
          decode="async"
          alt="This will be loaded as a texture"
        />
      </div>

      {hasSmoothScrollbar && (
        <UseCanvas debug={false}>
          <ScrollScene track={el}>{(props) => <WebGLCube img={img} {...props} />}</ScrollScene>
        </UseCanvas>
      )}
    </>
  )
}

function WebGLCube({ img, scale, inViewport }) {
  const mesh = useRef()
  const texture = useImageAsTexture(img)
  const { scroll } = useScrollbar()

  useFrame((_, delta) => {
    mesh.current.material.factor += scroll.velocity * 0.005
    mesh.current.material.factor *= 0.95
  })

  const spring = useSpring({
    scale: inViewport ? scale.times(1) : scale.times(0),
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 200 : 0
  })

  return (
    <a.mesh ref={mesh} {...spring}>
      <boxGeometry args={[1, 1, 0.5, 64, 64]} />
      <MeshWobbleMaterial
        factor={0}
        speed={2}
        color="#fff"
        map={texture}
        roughness={0.14}
        metalness={0}
        // render on top of the webgl background plane which is also transparent
        transparent
        depthTest={false}
      />
    </a.mesh>
  )
}
