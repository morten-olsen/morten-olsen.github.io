// https://redstapler.co/cool-nebula-background-effect-three-js/

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useState } from 'react';

interface CloudProps {
  texture: THREE.Texture;
  position: [number, number, number];
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

const initialClouds = new Array(30).fill(undefined).map((_, i) => ({
  name: `id_${i}`,
  position: [
    Math.random() * 800 - 400,
    500,
    Math.random() * 500 - 500,
  ] as [number, number, number],
  rotation: {
    x: 1.16,
    y: -0.12,
    z: Math.random() * 2 * Math.PI,
  },
}));

const Cloud: React.FC<CloudProps> = ({ texture, position, rotation }) => {
  return (
    <mesh position={position} rotation={[ rotation.x, rotation.y, rotation.z ]}>
      <planeBufferGeometry args={[500, 500]} />
      <meshLambertMaterial opacity={.5} map={texture} transparent={true} />
    </mesh>
  );
};

const Clouds: React.FC<{}> = () => {
  const { camera } = useThree();
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const [texture, setTexture] = useState<THREE.Texture | undefined>();
  const [clouds, setClouds] = useState(initialClouds);

  useEffect(() => {
    console.log(camera);
    camera.rotateX(1.16);
    camera.rotateY(-0.12);
    camera.rotateZ(0.27);
  }, []);

  useEffect(() => {
    loader.load('images/smoke.png', (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);

  useFrame(() => {
    setClouds(current => current.map(c => ({
      ...c,
      rotation: {
        ...c.rotation,
        z: c.rotation.z -= 0.001,
      }
    })));
  });

  if (!texture) {
    return <></>;
  }

  return (
    <>
      {clouds.map((cloud) => (
        <Cloud
          key={cloud.name}
          texture={texture}
          position={cloud.position}
          rotation={cloud.rotation}
        />
      ))}
    </>
  )
}

const style = {
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  position: 'fixed' as any,
  zIndex: -1,
}

const Background: React.FC<{}> = () => {
  const fog = useMemo(() => new THREE.FogExp2(0x03544e, 0.001), []);
  const [aspect, setAspect] = useState(global.window ? window.innerWidth / window.innerHeight : 1);
  if (!global.window) {
    return <Canvas style={style}><></></Canvas>
  }
  useEffect(() => {
    const update = () => {
      setAspect(window.innerWidth / window.innerHeight);
    };
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    }
  }, []);
  return (
    <Canvas style={style}>
      <color attach="background" args={[0x03544e]} />
      <scene fog={fog}>
        <perspectiveCamera
          args={[60, aspect, 1, 1000]}
          aspect={aspect}
          position={[0, 0, 0]}
        />
        <ambientLight args={[0x555555]} />
        <directionalLight args={[0xff8c19]} position={[0,0,1]} />
        <pointLight args={[0xcc6600, 50, 450, 1.7]} position={[200,300,100]} />
        <pointLight args={[0xd8547e, 50, 450, 1.7]} position={[100,300,100]} />
        <pointLight args={[0x3677ac, 50, 450, 1.7]} position={[300,300,200]} />
        <Clouds />
      </scene>
    </Canvas>
  );
};

export default Background;
