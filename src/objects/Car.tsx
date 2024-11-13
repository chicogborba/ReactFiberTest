import { useGLTF } from "@react-three/drei";
import { PrimitiveProps } from "@react-three/fiber";

export default function Car(props: Omit<PrimitiveProps, 'object'>) {
  const gltf = useGLTF('/src/assets/models/Room.glb');
  return <primitive {...props}  object={gltf.scene} scale={[1, 1, 1]} />;
}
