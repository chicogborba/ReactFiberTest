import { Box, useKeyboardControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import Car from "../../objects/Car";
import { useRef } from "react";
import * as THREE from "three";
import { Controls } from "./Game";
import { useFrame, useThree } from "@react-three/fiber";

export default function Experience() {
  const cubeRef = useRef<RapierRigidBody>(null);

  // Usando a câmera padrão do three.js através do React Three Fiber
  const { camera } = useThree();

  const goForward = () => {
    if (cubeRef.current) {
      const rotation = cubeRef.current.rotation();
      const forwardDirection = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(rotation)
        .normalize();
      cubeRef.current.applyImpulse(
        { x: forwardDirection.x * 300, y: 100, z: forwardDirection.z * 300 },
        true
      );
    }
  };

  const goBackward = () => {
    if (cubeRef.current) {
      const rotation = cubeRef.current.rotation();
      const backwardDirection = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(rotation)
        .normalize();
      cubeRef.current.applyImpulse(
        { x: backwardDirection.x * 300, y: 0, z: backwardDirection.z * 300 },
        true
      );
    }
  };

  const goLeft = () => {
    if (cubeRef.current) {
      cubeRef.current.applyTorqueImpulse({ x: 0, y: 100, z: 0 }, true);
    }
  };

  const goRight = () => {
    if (cubeRef.current) {
      cubeRef.current.applyTorqueImpulse({ x: 0, y: -100, z: 0 }, true);
    }
  };

  const fowardPressed = useKeyboardControls((state) => state[Controls.forward]);
  const backwardPressed = useKeyboardControls((state) => state[Controls.backward]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);

  useFrame(() => {
    if (fowardPressed) goForward();
    if (backwardPressed) goBackward();
    if (leftPressed) goLeft();
    if (rightPressed) goRight();

    // Atualização da câmera para acompanhar a frente do carro
    if (cubeRef.current) {
      const carPosition = cubeRef.current.translation();
      const carRotation = cubeRef.current.rotation();
      
      // Calcula a direção de frente do carro
      const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(carRotation).normalize();
      
      // Define a posição da câmera atrás do carro, ajustando a altura e distância
      const cameraOffset = forwardDirection.clone().multiplyScalar(-30).add(new THREE.Vector3(0, 10, 0));
      const cameraPosition = new THREE.Vector3().copy(carPosition).add(cameraOffset);

      // Suaviza a posição da câmera para seguir o carro
      camera.position.lerp(cameraPosition, 0.1);

      // Faz a câmera olhar na direção da frente do carro
      const lookAtPosition = new THREE.Vector3().copy(carPosition).add(forwardDirection);
      camera.lookAt(lookAtPosition);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      {/* <OrbitControls /> */}

      {/* Carro com física */}
      <RigidBody
        density={2.3}
        ref={cubeRef}
        colliders="cuboid"
        position={[-2.5, 1, 0]}
        friction={4}
      >
        <Car />
      </RigidBody>

      {/* Chão */}
      <RigidBody type="fixed" friction={0.5}>
        <Box scale={[50, 1, 800]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
}
