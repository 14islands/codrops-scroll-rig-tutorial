import React, { useRef, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Image } from "@react-three/drei";

export function WebGLBackground() {
  const bg = useRef();
  const viewport = useThree((s) => s.viewport);
  useFrame((_, delta) => {
    if (bg.current) bg.current.rotation.z -= delta * 0.5;
  });
  return (
    <Suspense fallback="">
      <Image
        ref={bg}
        scale={Math.max(viewport.width, viewport.height) * 1.4}
        url="images/codrops-bg-tiny.png"
        transparent
        renderOrder={-1}
      />
    </Suspense>
  );
}
