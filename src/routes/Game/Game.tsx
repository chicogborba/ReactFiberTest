import { Canvas,  } from "@react-three/fiber";
import { Physics,  } from "@react-three/rapier";
import { Suspense, useMemo,  } from "react";
import Experience from "./Experience";
import { KeyboardControls } from "@react-three/drei";

export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  jump: "jump",
}

const Game = () => {

  const map = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["Space"] },
  ]
  , []);

  return (
    <KeyboardControls map={map}>
      <Canvas style={{ height: '100vh', width: '100vw'}} shadows camera={{ position: [10, 10, 10], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Suspense>
          <Physics debug>
            <Experience/>
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
};

export default Game;
