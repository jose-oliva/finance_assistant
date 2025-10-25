import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useReserva } from "../hooks/useLAB";
import { Avatar } from "./Avatar";

const Dots = (props) => {
  const { loading } = useReserva();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useReserva();

  useEffect(() => {
    cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current.setLookAt(-0.3, 1.5, 1.5, 0.45, 1.5, 0, true);
    } else {
      cameraControls.current.setLookAt(1.4, 1.4, 1.9, -0.5, 1.9, 1.4, true);
    }
  }, [cameraZoomed]);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      <Avatar />
      <ContactShadows opacity={0.7} />
    </>
  );
};
