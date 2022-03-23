import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Clock, Euler, Vector3 } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import styled from 'styled-components';
const { default: smoke } = require('./smoke.png');

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
`;

const FrameLimiter = () => {
  const [clock] = React.useState(new Clock());
  const [fps] = React.useState(10);

  useFrame((state: any) => {
    state.ready = false;
    const timeUntilNextFrame = (1000 / fps) - clock.getDelta();

    setTimeout(() => {
      state.ready = true;
      state.invalidate();
    }, Math.max(0, timeUntilNextFrame));

  });

  return <></>;
};

const Cloud = ({ texture }) => {
  const ref = useRef<any>();
  const width = window.innerWidth / 2;
  const height = window.innerHeight / 2;

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.z -= 0.003;
  });

  return (
    <mesh
      ref={ref}
      rotation={new Euler(1.16, -0.12, Math.random() * Math.PI * 2)}
      position={new Vector3(Math.random()* width - width / 2, 500, Math.random()* height - height / 2)}
    >
      <planeBufferGeometry args={[500, 500]} />
      <meshLambertMaterial opacity={0.55} args={[{ map: texture, transparent: true }]} />
    </mesh>
  );
}

const Clouds = () => {
  const colorMap = useLoader(TextureLoader, smoke)
  const items = useMemo(
    () => new Array(30).fill(undefined),
    [],
  );
  return (
    <>
      {items.map((_, i) => (
        <Cloud key={i} texture={colorMap} />
      ))}
    </>
  )
}

const Scene = () => {
  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.setClearColor('#f0f0f0');
      }}
      gl={{
        antialias: false,
      }}
      camera={{
        fov: 60,
        aspect: 1,
        near: 1,
        far: 1000,
        position: [0, 0, 1],
        rotation: [1.16, -0.12, 0.27],
      }}
    >
      <FrameLimiter />
      <scene>
      <perspectiveCamera
        args={[60,window.innerWidth / window.innerHeight,1,1000]}
        position={new Vector3(0, 0, 1)}
        rotation={new Euler(1.16, -0.12, 0.27)}
      />
      <ambientLight args={[0x555555]} />
      <fogExp2 args={[0x03544e, 0.001]} />
      <directionalLight
        args={[0xff8c19]}
        position={new Vector3(0, 0, 1)}
      />
      <pointLight
        args={[0xcc6600,50,450,1.7]}
        position={new Vector3(200, 300, 100)}
      />
      <pointLight
        args={[0xd8547e,50,450,1.7]}
        position={new Vector3(100, 300, 100)}
      />
      <pointLight
        args={[0x3677ac,50,450,1.7]}
        position={new Vector3(300, 300, 200)}
      />
      <Suspense fallback={null}>
        <Clouds />
      </Suspense>
      </scene>
    </Canvas>
  )
};

const HeroBackground = () => {
  return (
    <Wrapper 
      suppressHydrationWarning={true}
    >
      {typeof window !== 'undefined' && <Scene />}
    </Wrapper>
  )
}

export { HeroBackground };
