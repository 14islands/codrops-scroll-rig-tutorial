import * as THREE from "three";
import { useRef, useState } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO, useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { easing } from "maath";

export function Lens({ children, damping = 0.14, ...props }) {
  const ref = useRef();
  const { nodes } = useGLTF("glb/lens-transformed2.glb");
  const buffer = useFBO();
  const viewport = useThree((state) => state.viewport);
  const [scene] = useState(() => new THREE.Scene());
  useFrame((state, delta) => {
    // Tie lens to the pointer
    // getCurrentViewport gives us the width & height that would fill the screen in threejs units
    // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
    // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 1]);

    easing.damp3(
      ref.current.position,
      [
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2,
        1,
      ],
      damping,
      delta
    );
    // This is entirely optional but spares us one extra render of the scene
    // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
    // The following code will render that scene into a buffer, whose texture will then be fed into
    // a plane spanning the full screen and the lens transmission material
    state.gl.setRenderTarget(buffer);
    state.gl.setClearColor("#ecedef");
    state.gl.render(scene, state.camera);
    state.gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>
      <mesh
        scale={Math.min(viewport.width, viewport.height) * 0.14}
        ref={ref}
        rotation-x={Math.PI / 2}
        geometry={nodes.Cylinder.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={1.14}
          thickness={1.4}
          anisotropy={0.14}
          chromaticAberration={0.14}
          distortion={0.14}
          distortionScale={1.4}
          temporalDistortion={0.14}
        />
      </mesh>
    </>
  );
}

useGLTF.preload("/lens-transformed2.glb");
