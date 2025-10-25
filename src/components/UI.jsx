import { useReserva } from "../hooks/useLAB";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MdOutlineVideoSettings } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa6";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "../index.css";
import FinancePanel from "./FinancePanel";

export const UI = ({ hidden, ...props }) => {
  const { chat, message, loading, cameraZoomed, setCameraZoomed } = useReserva();
  const input = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const startListeningHandler = () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, autoStop: true });
    }
  };

  const stopListeningHandler = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsClicked(false);
    }
  }, [listening]);

  useEffect(() => {
    return () => stopListeningHandler();
  }, [stopListeningHandler]);

  const handleCameraClick = () => {
    setCameraZoomed(!cameraZoomed);
  };

  if (hidden) return null;
  if (!browserSupportsSpeechRecognition)
    return <p>Tu navegador no soporta reconocimiento de voz.</p>;

  return (
    <div className="fixed inset-0 z-10 flex justify-between items-center w-full h-full px-10">
      {/* ==== LADO IZQUIERDO (Avatar) ==== */}
      <div className="flex flex-col justify-center items-center w-2/5 h-full relative">
        {/* Aquí el avatar 3D sigue renderizado por tu Experience.jsx */}
        {/* No se elimina nada del modelo ni de la escena */}
      </div>

      {/* ==== BOTONES flotantes ==== */}
      <div className="absolute top-4 left-4 flex gap-3 z-20">
        <button
          onClick={handleCameraClick}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-lg"
        >
          <MdOutlineVideoSettings className="text-2xl" />
        </button>

        <button
          onClick={() => {
            setIsClicked(true);
            startListeningHandler();
          }}
          className={`flex items-center justify-center w-12 h-12 rounded-full border border-white bg-blue-500 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 ${
            isClicked ? "animate-pulse" : ""
          }`}
        >
          <FaMicrophone className="text-xl" />
        </button>
      </div>

      {/* ==== LADO DERECHO (Cuadro FinancePanel) ==== */}
      <div className="w-3/5 flex justify-center items-center">
        <div className="w-10/12 bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-2xl p-10 flex flex-col items-center justify-center border border-blue-800">
          <FinancePanel />
        </div>
      </div>

      {/* ==== TEXTO DEL MICRÓFONO ==== */}
      {transcript && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-800 bg-white bg-opacity-60 backdrop-blur-md px-6 py-2 rounded-full shadow-sm">
          {transcript}
        </div>
      )}
    </div>
  );
};
