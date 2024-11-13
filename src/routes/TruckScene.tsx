import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model() {
  // Carrega o modelo
  const gltf = useGLTF('/src/assets/models/TruckNew.glb');
  
  // Referência para o objeto 3D
  const modelRef = useRef<THREE.Object3D>();

  // Variável para controlar a animação
  const [moving, setMoving] = useState(true);
  const [direction, setDirection] = useState(false); // true para frente, false para trás

  // Animação: mover o objeto para frente e para trás
  useFrame(() => {
    if (modelRef.current && moving) {
      if (direction) {
        modelRef.current.position.x += 0.05;  // Move para frente ao longo do eixo X
        if (modelRef.current.position.x >= 1) {
          setDirection(false); // Muda a direção para trás
        }
      } else {
        modelRef.current.position.x -= 0.05;  // Move para trás ao longo do eixo X
        if (modelRef.current.position.x <= -13) {
          setDirection(true); // Muda a direção para frente
        }
      }
    }
  });

  return <primitive onClick={() => setMoving(!moving) } ref={modelRef} object={gltf.scene} />;
}

function Pathway() {
  const gltf = useGLTF('/src/assets/models/Cena.glb');
  return <primitive object={gltf.scene} />;
}

function TruckScene() {
  return (
    <Canvas
      style={{ height: '100vh', width: '100vw', background: '#19172F' }}
      shadows
      camera={{ position: [-15, 8, 15], fov: 60 }}
    >
      {/* Luz ambiente leve para um brilho uniforme */}
      <ambientLight intensity={3} />

      {/* Luz direcional vinda de cima */}
      <directionalLight
        position={[-5, 5, 2]}
        intensity={4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <OrbitControls />
      {/* Envolve o modelo com Bounds para centralizar */}
        <Model />
        <Pathway />

      {/* Permite girar a cena com o mouse */}
    </Canvas>
  );
}

export default TruckScene;
