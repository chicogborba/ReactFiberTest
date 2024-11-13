import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import Car from "../objects/Car";
import { PerformanceMonitor } from "@react-three/drei";

const HeadTrackedScene = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceRotation, setFaceRotation] = useState({ x: 0, y: 0 });
  const [fps, setFps] = useState(0);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.4,
      minTrackingConfidence: 0.4,
    });

    faceMesh.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (videoRef.current) {
        canvasCtx.filter = "grayscale(100%)";
        canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const nose = landmarks[1];

        setFaceRotation({
          x: (nose.y - 0.5) * 2,
          y: (nose.x - 0.5) * -2,
        });

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const width = Math.abs(rightEye.x - leftEye.x) * canvasRef.current.width * 1.5;
        const height = width * 1.2;
        const x = (nose.x * canvasRef.current.width) - width / 2;
        const y = (nose.y * canvasRef.current.height) - height / 2;

        canvasCtx.beginPath();
        canvasCtx.rect(x, y, width, height);
        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = "red";
        canvasCtx.stroke();
      }
    });

    if (videoRef.current) {
      const camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 160,
        height: 240,
      });
      camera.start();
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
    <Canvas 
        performance={{ min: 1, max: 1 }} // Força 60 FPS
        gl={{ 
          antialias: false, 
          pixelRatio: 0.2, 
          powerPreference: "high-performance",
        }} // Desativa antialias e mantém a resolução nativa
        style={{ width: "100vw", height: "100vh" }}
      >
        <Scene faceRotation={faceRotation} setFps={setFps} />
    </Canvas>

      <video ref={videoRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={80}
        height={120}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "80px",
          height: "120px",
          border: "1px solid black",
        }}
      />

      {/* Exibir FPS */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        FPS: {fps.toFixed(2)}
      </div>
    </div>
  );
};

const Scene = ({ faceRotation, setFps }) => {
  const { camera } = useThree();
  const lastFrameTime = useRef(performance.now());

  camera.position.set(0, 0, 1);
  
  // Atualiza o FPS
  useFrame(() => {
    const now = performance.now();
    const delta = (now - lastFrameTime.current) / 1000; // tempo em segundos
    lastFrameTime.current = now;
    const fps = 1 / delta;
    setFps(fps); // Atualiza o estado do FPS

    camera.rotation.x += (-faceRotation.x * Math.PI / 4 - camera.rotation.x) * 0.15;
    camera.rotation.y += (-faceRotation.y * Math.PI / 4 - camera.rotation.y) * 0.15;
    camera.rotation.z = 0;
  });

  return (
    <mesh>
      <Car />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
    </mesh>
  );
};

export default HeadTrackedScene;
