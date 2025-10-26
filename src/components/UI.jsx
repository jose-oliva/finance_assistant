import { useReserva } from "../hooks/useLAB";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaCheck, FaChalkboardTeacher } from "react-icons/fa";
import { TbLego } from "react-icons/tb";
import { GiLaptop } from "react-icons/gi";
import { BsHeadsetVr, BsProjector } from "react-icons/bs";
import { MdOutlineVideoSettings } from "react-icons/md";
import "../index.css";
import ReservationBanner from './ReservationBanner';
import axiosInstance from "../hooks/axiosInstance";
import { FaCheckCircle } from 'react-icons/fa';
import '../index.css';
import { FaMicrophone } from "react-icons/fa6";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { endOfISOWeek, format, subMinutes } from 'date-fns';
import { useBudgetStore } from "./BudgetStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import BudgetBreakdown from './BudgetBreakdown';
import ReviewPanel from './ReviewPanel';
import SavingsOverview from "./SavingsOverview";
import EndOfMonthSurvivalPlanOverview from "./EndOfMonthSurvivalPlanOverview";

export const UI = ({ hidden, ...props }) => {
  const [loadingR, setLoadingR] = useState(true);
  const [activePlan, setActivePlan] = useState(null);
  const [activeSurvivalStep, setActiveSurvivalStep] = useState(null);

  const initialData = [
    { nombre: 'NOMBRE1', horario: 'HORARIO1' },
    { nombre: 'NOMBRE2', horario: 'HORARIO2' },
    { nombre: 'NOMBRE3', horario: 'HORARIO3' },
    { nombre: 'NOMBRE4', horario: 'HORARIO4' },
    { nombre: 'NOMBRE5', horario: 'HORARIO5' },
    { nombre: 'NOMBRE6', horario: 'HORARIO6' },
    { nombre: 'NOMBRE7', horario: 'HORARIO7' },
    { nombre: 'NOMBRE8', horario: 'HORARIO8' },
  ];

  const cardNames = [
    "PCB Factory",
    "PC Room",
    "Electric Garage",
    "Meeting Room",
    "Lego Room",
    "VR Room",
    "New Horizons",
    "Graveyard",
    "Dimension Forge"
  ];

  const input = useRef();
  const [inputValue, setInputValue] = useState("");
  const [budgetValue, setBudgetValue] = useState("");
  const { chat, message, loading, cameraZoomed, setCameraZoomed } = useReserva();
  const [nameValid, setNameValid] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [buttonState, setButtonState] = useState("empty");
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [showAvatarOnly, setShowAvatarOnly] = useState(false);
  const [reservationCreated, setReservationCreated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [expensesData, setExpensesData] = useState([]);
  const [posterImages, setPosterImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [data, setData] = useState(initialData);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [selected, setSelected] = useState({});
  const [selectedLab, setSelectedLab] = useState(null);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomImages, setRoomImages] = useState({});
  const [equipmentImages, setEquipmentImages] = useState({});
  const [previousLab, setPreviousLab] = useState(null);
  const [executed, setExecuted] = useState(false);;
  const [counts, setCounts] = useState({
    'LEGO': 0,
    'VR Headset': 0,
    'PC': 0,
    'Projector': 0,
    'Whiteboard': 0
  });

  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const selectbotones = (num) => {
    if (selectedButtons.length === 0 || selectedButtons.length === 2 || num > selectedButtons[0]) {
      if (selectedButtons.length < 2) {
        setSelectedButtons([...selectedButtons, num]);
      } else {
        setSelectedButtons([num]);
      }
    }
  };

  const timeToMinutes = (time24) => {
    const [hour, minute] = time24.split(':').map(Number);
    return hour * 60 + minute;
  };

  const convertTo12Hour = (time24) => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour < 12 || hour === 24 ? 'AM' : 'PM';
    return `${(hour % 12) || 12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const recs = [
    {
      id: 1,
      title: "Reduce gastos variables",
      description:
        "Esta semana gastaste ~32% en comida fuera. Si bajas a 20%, ahorras ~$1,200 MXN/mes.",
      priority: "alta",
      actionText: "Ver cómo ahorrar",
    },
    {
      id: 2,
      title: "Fondo de emergencia",
      description:
        "Tienes ~1.4 meses de gastos fijos cubiertos. Meta recomendada: 3 meses.",
      priority: "media",
      actionText: "Plan de ahorro",
    },
    {
      id: 3,
      title: "Inversión segura",
      description:
        "Te quedan ~$1,800 MXN libres al mes. Puedes ponerlos en un instrumento 7-10% anual.",
      priority: "baja",
      actionText: "Ver opciones",
    },
  ];

  useEffect(() => {
    const timePattern = /(\d{1,2}):?(\d{2})?\s*(a\.?\s*m\.?|p\.?\s*m\.?).*?(\d{1,2}):?(\d{2})?\s*(a\.?\s*m\.?|p\.?\s*m\.?)/i;
    const match = transcript.match(timePattern);

    if (match) {
      const startHour = match[1];
      const startMinute = match[2] || '00';
      const startPeriod = match[3];
      const endHour = match[4];
      const endMinute = match[5] || '00';
      const endPeriod = match[6];

      const convertTo24Hour = (hour, minute, period) => {
        hour = parseInt(hour, 10);
        if (period.toLowerCase() === 'pm' && hour !== 12) {
          hour += 12;
        } else if (period.toLowerCase() === 'am' && hour === 12) {
          hour = 0;
        }
        return `${hour.toString().padStart(2, '0')}:${minute}`;
      };

      const startHour24 = convertTo24Hour(startHour, startMinute, startPeriod);
      const endHour24 = convertTo24Hour(endHour, endMinute, endPeriod);

      input.current.value = `${startHour24} - ${endHour24}`;
      sendMessage();
      setTimeout(() => {
        handleQuestionClick(currentQuestionIndex + 1);
      }, 11000);
      setSelectedTimes([startHour24, endHour24]);
    }
  }, [transcript]);

  const labToEquipments = {
    "Lego Room": ["LEGO", "PC"],
    "VR Room": ["VR Headset"],
    "PC Room": ["VR Headset"],
    "Meeting Room": ["Whiteboard", "Projector"],
    "Electric Garage": ["Whiteboard", "Projector"],
    "PCB Factory": ["VR Headset"],
    "New Horizons": ["Whiteboard", "Projector"],
    "Graveyard": ["VR Headset"],
    "Dimension Forge": ["LEGO", "PC"]
  };

  useEffect(() => {
    setAvailableEquipments(labToEquipments[selectedLab] || []);
  }, [selectedLab]);

  const incrementCount = () => {
    if (selected) {
      setCounts(prevCounts => ({
        ...prevCounts,
        [selected]: prevCounts[selected] < 10 ? prevCounts[selected] + 1 : prevCounts[selected]
      }));
    }
  };

  const decrementCount = () => {
    if (selected) {
      setCounts(prevCounts => ({
        ...prevCounts,
        [selected]: prevCounts[selected] > 0 ? prevCounts[selected] - 1 : prevCounts[selected]
      }));
    }
  };

  const textToNumber = (text) => {
    const numbers = {
      'un': 1,
      'una': 1,
      'dos': 2,
      'tres': 3,
      'cuatro': 4,
      'cinco': 5,
      'seis': 6,
      'siete': 7,
      'ocho': 8,
      'nueve': 9,
      'diez': 10
    };
    const number = parseInt(text);
    return isNaN(number) ? numbers[text.toLowerCase()] || 0 : number;
  };

  const messageSentRef = useRef(false);

  useEffect(() => {
    if (!selectedLab || messageSentRef.current) {
      return;
    }

    const equipmentRegex = /(\d+|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez).*?([a-záéíóúñ]+)/gi;
    let match;
    let inputValues = [];
    while ((match = equipmentRegex.exec(transcript.toLowerCase())) !== null) {
      const quantity = textToNumber(match[1]);
      let equipment = match[2];
      if (['pizarrón', 'pizarrones'].includes(equipment)) {
        equipment = 'Whiteboard';
      } else if (['proyector', 'proyectores'].includes(equipment)) {
        equipment = 'Projector';
      } else if (['lego', 'legos'].includes(equipment)) {
        equipment = 'LEGO';
      } else if (['lente', 'lentes'].includes(equipment)) {
        equipment = 'VR Headset';
      } else if (['computadora', 'computadoras', 'PC', 'pc'].includes(equipment)) {
        equipment = 'PC';
      }
      if (Object.keys(counts).includes(equipment)) {
        if (labToEquipments[selectedLab].includes(equipment)) {
          setCounts(prevCounts => ({
            ...prevCounts,
            [equipment]: quantity
          }));
          inputValues.push(`${quantity} ${equipment}`);
        } else {
          // console.error(`El equipo ${equipment} no está disponible en la sala seleccionada`);
        }
      } else {
        // console.error(`El equipo ${equipment} no está disponible`);
      }
    }
    input.current.value = inputValues.join(' - ');
    //console.log(`Equipos seleccionados: ${inputValues.join(' - ')}`);
    const equipmentList = ['Whiteboard', 'Projector', 'LEGO', 'VR Headset', 'PC'];
    const inputContainsEquipment = equipmentList.some(equipment => input.current.value.includes(equipment));
    if (inputValues.length > 0 && inputContainsEquipment) {
      sendMessage();
    }
    if (inputValues.length > 0 && inputContainsEquipment) {
      messageSentRef.current = true;
      setTimeout(() => {
        if (input.current.value.trim() !== '') {
          sendMessage();
        }
      }, 2000);
      //setTimeout(() => {
      //handleCreateReservation();
      //}, 12000);
    }
  }, [transcript, selectedLab]);

  useEffect(() => {
    messageSentRef.current = false;
  }, [selectedLab]);

  useEffect(() => {
    if (reservationCreated && !executed) {
      input.current.value = "reservacion creada";
      sendMessage();
      setExecuted(true);
    }
  }, [reservationCreated]);

  const allowedNames = ["Santiago", "José", "Karla", "Gael", "Jose", "Carla"];

  useEffect(() => {
    if (inputValue === "") {
      setButtonState("empty");
      setNameError(false);
    } else if (allowedNames.includes(inputValue.trim())) {
      setButtonState("valid");
      setNameError(false);
    } else {
      setButtonState("invalid");
      setNameError(true);
    }
  }, [inputValue]);

  useEffect(() => {
    const matriculaRegex = /a01630223/i;
    const processedTranscript = transcript.replace(/\s+/g, '');
    const match = processedTranscript.match(matriculaRegex);
    if (match) {
      let matricula = match[0];
      matricula = matricula.charAt(0).toUpperCase() + matricula.slice(1);
      setInputValue(matricula);
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.click();
        }
      }, 2000);
    }
  }, [transcript]);

  useEffect(() => {
    const dateRegex = /(\d{1,2})\s+.*\s+([a-zA-Z]+)\s+.*\s+(\d{4})/;
    const match = transcript.match(dateRegex);
    if (match) {
      const day = parseInt(match[1]);
      const month = match[2];
      const year = parseInt(match[3]);
      const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      const monthIndex = monthNames.indexOf(month.toLowerCase());
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date >= today) {
          setSelectedDate(date);
          input.current.value = date.toLocaleDateString('es-ES');
          sendMessage();
          setTimeout(() => {
            handleQuestionClick(currentQuestionIndex + 1);
          }, 9000);
        }
      }
    }
  }, [transcript]);

  useEffect(() => {
    const cardNamesRegex = new RegExp(cardNames.join("|"), "i");
    const labNumberRegex = /laboratorio (\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)/i;
    const match = transcript.match(cardNamesRegex);
    const labNumberMatch = transcript.match(labNumberRegex);
    if (match) {
      const selectedCardName = match[0];
      const index = cardNames.findIndex(cardName => cardName.toLowerCase() === selectedCardName.toLowerCase());
      if (index !== -1 && cardNames[index] !== previousLab) {
        setSelectedCard(index);
        setSelectedRoomId(roomIds[cardNames[index]]);
        setSelectedLab(cardNames[index]);
        setCounts({
          'LEGO': 0,
          'VR Headset': 0,
          'PC': 0,
          'Projector': 0,
          'Whiteboard': 0
        });
        input.current.value = "Laboratorio " + cardNames[index];
        sendMessage();
        setPreviousLab(cardNames[index]);
      }
    } else if (labNumberMatch) {
      const labNumber = labNumberMatch[1];
      const numberMap = {
        'uno': 1,
        'dos': 2,
        'tres': 3,
        'cuatro': 4,
        'cinco': 5,
        'seis': 6,
        'siete': 7,
        'ocho': 8,
        'nueve': 9,
        'diez': 10
      };
      const index = isNaN(labNumber) ? numberMap[labNumber] - 1 : parseInt(labNumber) - 1;
      if (index >= 0 && index < cardNames.length && cardNames[index] !== previousLab) {
        setSelectedCard(index);
        setSelectedRoomId(roomIds[cardNames[index]]);
        setSelectedLab(cardNames[index]);
        setCounts({
          'LEGO': 0,
          'VR Headset': 0,
          'PC': 0,
          'Projector': 0,
          'Whiteboard': 0
        });
        input.current.value = "Laboratorio " + cardNames[index];
        sendMessage();
        setPreviousLab(cardNames[index]);
      }
    }
  }, [transcript, cardNames]);

  const originalConsoleLog = console.log;
  console.log = function (message) {
    originalConsoleLog.apply(console, arguments);

    if (message === "Avatar has stopped talking") {
      startListeningHandler();
    }
  };

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
    return () => {
      stopListeningHandler();
    };
  }, [stopListeningHandler]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Lo siento, tu navegador no soporta reconocimiento de voz.</p>
  }

  useEffect(() => {
    if (!loadingR) {
      const interval = setInterval(() => {
        setData(prevData => {
          const firstItem = prevData[0];
          const nextIndex = (reservations.indexOf(firstItem) + 7) % reservations.length;
          const nextItem = reservations[nextIndex];

          return [...prevData.slice(1), nextItem];
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [reservations, loadingR]);

  useEffect(() => {
    const now = new Date();
    const startDate = format(subMinutes(now, 15), 'yyyy-MM-dd HH:mm');
    const endDate = format(endOfISOWeek(now), 'yyyy-MM-dd HH:mm');

    axiosInstance.get(`/admin/reservations/selector/${startDate}/${endDate}`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    })
      .then(response => {
        if (Array.isArray(response.data)) {
          const reservationsData = response.data.map(reservation => {
            const nombre = reservation.user.name;
            const horario = `${new Date(reservation.start_date).toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${new Date(reservation.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            return { nombre, horario };
          });
          setReservations(reservationsData);
          setData(reservationsData.slice(0, 7));
          setLoadingR(false);
        } else {
          throw new Error('La respuesta no es un array.');
        }
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
        setLoadingR(false);
      });
  }, []);

  useEffect(() => {
    axiosInstance.get('/posts/')
      .then(response => {
        // console.log('API response:', response.data);
        if (Array.isArray(response.data.data)) {
          const images = response.data.data.filter(post => post.visible).map(post => ({
            file: post.file
          }));
          // console.log('Formatted images:', images);
          setPosterImages(images);
          setError(null);
        } else {
          throw new Error('Error');
        }
      })
      .catch(error => {
        // console.error('Error imagenes:', error);
        setError('Error al cargar las imágenes.');
      });
  }, []);

  useEffect(() => {
    axiosInstance.get('/rooms/')
      .then(response => {
        if (Array.isArray(response.data.data)) {
          const images = {};
          response.data.data.forEach(room => {
            images[room.name] = room.image;
          });
          setRoomImages(images);
          // console.log('Todas las salas ya se les asignó su imagen.');
          setError(null);
        } else {
          throw new Error('Error');
        }
      })
      .catch(error => {
        setError('Error al cargar las imágenes de las salas.');
      });
  }, []);

  const roomIds = {
    "Lego Room": "6614aaed6d294f5d44008698",
    "VR Room": "6614aaed6d294f5d44008699",
    "PC Room": "6614aaed6d294f5d4400869a",
    "Electric Garage": "6635064964d1e813a40d1d41",
    "PCB Factory": "6635064964d1e813a40d1d44",
    "Meeting Room": "6614aaed6d294f5d4400869b",
    "New Horizons": "6635064964d1e813a40d1d45",
    "Graveyard": "6635064964d1e813a40d1d46",
    "Dimension Forge": "6635064964d1e813a40d1d47"
  };

  useEffect(() => {
    const equipmentIds = {
      "LEGO": "6614aaed6d294f5d4400869c",
      "VR Headset": "6614aaed6d294f5d4400869d",
      "PC": "6614aaed6d294f5d4400869e",
      "Projector": "6614aaed6d294f5d4400869f",
      "Whiteboard": "6614aaed6d294f5d440086a0",
    };

    axiosInstance.get('/equipment/')
      .then(response => {
        if (Array.isArray(response.data.data)) {
          const images = {};
          response.data.data.forEach(equipment => {
            const equipmentName = equipment.name.toUpperCase();
            if (Object.keys(equipmentIds).map(key => key.toUpperCase()).includes(equipmentName)) {
              images[equipment.name] = equipment.image;
              // console.log(`El equipo ${equipment.name} tiene la imagen ${equipment.image}`);
            }
          });
          setEquipmentImages(images);
          setError(null);
          Object.keys(images).forEach(equipment => {
            // console.log(`A ${equipment} se le ha asignado una imagen.`);
          });
          // console.log('equipmentImages:', images);
        } else {
          throw new Error('Error');
        }
      })
      .catch(error => {
        setError('Error al cargar las imágenes de los equipos.');
      });
  }, []);

  const teamIcons = {
    'LEGO': <TbLego />,
    'VR Headset': <BsHeadsetVr />,
    'PC': <GiLaptop />,
    'Projector': <BsProjector />,
    'Whiteboard': <FaChalkboardTeacher />
  };

  const equipmentIds = {
    "LEGO": "6614aaed6d294f5d4400869c",
    "VR Headset": "6614aaed6d294f5d4400869d",
    "PC": "6614aaed6d294f5d4400869e",
    "Projector": "6614aaed6d294f5d4400869f",
    "Whiteboard": "6614aaed6d294f5d440086a0",
  };

  const handleCreateReservation = async () => {
    if (!selectedRoomId) {
      alert("Por favor, selecciona una sala antes de crear la reserva.");
      return;
    }

    if (selectedTimes.length !== 2) {
      alert("Por favor, selecciona un horario antes de crear la reserva.");
      return;
    }

    const startDate = new Date(selectedDate);
    const [startHours, startMinutes] = selectedTimes[0].split(':');
    startDate.setHours(startHours, startMinutes);

    const endDate = new Date(selectedDate);
    const [endHours, endMinutes] = selectedTimes[1].split(':');
    endDate.setHours(endHours, endMinutes);

    const toLocalISOString = (date) => {
      const tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = (num) => {
          const norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
        };
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
    }

    const reservedEquipment = Object.entries(counts)
      .filter(([equipment, count]) => count > 0)
      .map(([equipment]) => equipmentIds[equipment]);

    const payload = {
      room_id: selectedRoomId,
      start_date: toLocalISOString(startDate).slice(0, 16).replace('T', ' '),
      end_date: toLocalISOString(endDate).slice(0, 16).replace('T', ' '),
      reserved_equipment: reservedEquipment,
      comments: "",
      status: "6614aaed6d294f5d44008695"
    }

    console.log(payload);

    try {
      await axiosInstance.post('/reservations/', payload);
      // alert("¡Reservacion creada con exito!");
      setReservationCreated(true);
      setIsVisible(true);
    } catch (error) {
      console.error(error.response || error);
      // alert(error);
    }
  };

  const toggleSelectNew = (newSelection) => {
    setSelected(newSelection);
  };

  React.useEffect(() => {
    if (selectedCard !== null) {
      input.current.value = "Laboratorio " + cardNames[selectedCard];
      sendMessage();
      setTimeout(() => {
        handleQuestionClick(currentQuestionIndex + 1);
      }, 9000);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (!isButtonVisible) {
      input.current.value = "iniciar reservacion";
      sendMessage();
    }
  }, [isButtonVisible]);

  const questions = [
    "Income",
    "Budgets",
    "Expenses",
    "Review",
    "Strategies",
  ];

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const handleButtonClick = () => {
    setShowAvatarOnly(!showAvatarOnly);
  };

  useEffect(() => {
    if (posterImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % posterImages.length);
    }, 8000);

    return () => {
      clearInterval(timer);
    };
  }, [posterImages.length]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  const [editingBudget, setEditingBudget] = useState(true);
  const budgetInputRef = useRef(null);

  const cats = useBudgetStore((s) => s.categories);
  const budget = useBudgetStore((s) => s.budget);
  const setBudget = useBudgetStore((s) => s.setBudget);

  const alloc = useBudgetStore((s) => s.allocation);
  const setAlloc = useBudgetStore((s) => s.setAlloc);
  const sumAlloc = useBudgetStore((s) => s.sumAlloc());

  const remaining = Math.max(0, Number(budget || 0) - sumAlloc);

  const COLORS = ["#4F46E5", "#22C55E", "#06B6D4"];
  const pie = cats.map((c, i) => ({
    name: c,
    value: Number(alloc[c] || 0),
    color: COLORS[i % COLORS.length],
  }));

  const parseDigits = (v) => {
    const n = Number(String(v).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const confirmBudget = () => {
    const n = parseDigits(budgetInputRef.current?.value ?? budget);
    setBudget(n);
    setEditingBudget(false);
  };

  const onBudgetKeyDown = (e) => {
    if (e.key === "Enter") confirmBudget();
    if (e.key === "Escape") {
      setEditingBudget(false);
      if (budgetInputRef.current) budgetInputRef.current.value = budget;
    }
  };

  useEffect(() => {
    const transcriptLower = transcript.toLowerCase();
    const foundName = allowedNames.find(name => transcriptLower.includes(name.toLowerCase()));

    if (foundName) {
      setInputValue(foundName);
      handleNameSubmit(foundName);
      input.current.value = `Welcome to ${foundName}`;
      sendMessage();
    }
  }, [transcript]);

  const handleNameSubmit = (name) => {
    if (allowedNames.includes(name.trim())) {
      setNameValid(true);
      setNameError(false);
    } else {
      setNameError(true);
    }
  };

  useEffect(() => {
    const transcriptLower = transcript.toLowerCase();

    if (transcriptLower.includes("income")) {
      const numberMatch = transcript.match(/\d+/);
      if (numberMatch) {
        const numberValue = numberMatch[0];
        input.current.value = `income ${numberValue}`;
        setBudgetValue(
          numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        sendMessage();
        handleQuestionClick(currentQuestionIndex + 1);
      }
    }
  }, [transcript]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center w-full h-full">
      {!showAvatarOnly ? (
        <>
          <div className="flex flex-col items-start justify-start w-2/5 h-full">
            <div className="flex items-start justify-start w-full h-1/6">
              <div className={`flex items-center justify-center w-full h-full`}>
                <input
                  className={` w-7/12 h-2/6 placeholder:text-gray-800 placeholder:italic p-4 rounded-l-md bg-opacity-50 bg-white backdrop-blur-md`}
                  placeholder="Type something..."
                  ref={input}
                  onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(); } }}
                />
                <button
                  onClick={sendMessage}
                  className={` w-2/12 h-2/6 bg-blue-500 hover:bg-blue-600 text-white font-semibold uppercase rounded-r-md ${loading || message ? "cursor-not-allowed" : ""}`}
                >
                  Send
                </button>
              </div>
            </div>
            <div className="flex w-full h-3/6">
            </div>
            <div className={`flex flex-col items-center justify-center w-full h-2/6`}>
              <div className="flex flex-col items-center justify-end w-full h-4/6">
                {transcript && (
                  <>
                    <div className="flex px-4 py-2 mx-16 rounded-2xl bg-black bg-opacity-40 text-white items-center justify-center">{transcript}</div>
                    <div className="flex w-1/12 h-1/6 bg-black bg-opacity-40" style={{ clipPath: 'polygon(50% 100%, 20% 0%, 80% 0%)' }}></div>
                  </>
                )}
              </div>
              <div className="flex items-start justify-center w-full h-2/6">
                <div className="flex w-1/12 h-3/6">
                  <button
                    onClick={() => {
                      setIsClicked(true);
                      startListeningHandler();
                    }}
                    className={`border border-white flex w-full h-full bg-blue-500 text-white items-center justify-center rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 ${isClicked ? 'animate-pulse' : ''}`}
                  >
                    <div className="w-5/12 h-2/6">
                      {isClicked ? <FaMicrophone className="w-full h-full" /> : <FaMicrophone className="w-full h-full" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!nameValid ? (
            <div className="flex flex-col items-center justify-center w-3/5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#10069f",
                  width: "66.7%",
                  height: "10%",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <h1 className="text-white text-2xl font-semibold text-center">
                  Hi 👋 I'm Omnia
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center text-xl pointer-events-auto w-4/6 h-2/6 mx-auto bg-opacity-50 bg-white backdrop-blur-md rounded-b p-8">
                <p className="mb-6 text-center text-gray-800">
                  I'm here to help you understand and manage your finances better.
                  Please enter your name to get started.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNameSubmit(inputValue);
                  }}
                  className="flex flex-col items-center justify-center w-3/5"
                >
                  <input
                    className="placeholder:text-gray-600 placeholder:italic p-2 w-full rounded-md text-center"
                    placeholder="Enter your name..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ backgroundColor: "transparent", color: "#000", fontFamily: "'Georgia', serif", fontWeight: "500", fontSize: "2rem" }}
                  />
                  <button
                    type="submit"
                    ref={buttonRef}
                    className={`mt-4 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-500`}
                    style={{
                      borderColor:
                        buttonState === "empty"
                          ? "gray"
                          : buttonState === "valid"
                            ? "green"
                            : "gray",
                      color:
                        buttonState === "empty"
                          ? "gray"
                          : buttonState === "valid"
                            ? "green"
                            : "gray",
                    }}
                    onClick={() => {
                      input.current.value = `Welcome ${inputValue}`;
                      sendMessage();
                    }}
                  >
                    {buttonState === "empty" && (
                      <span className="text-3xl font-bold animate-fadeIn">-</span>
                    )}
                    {buttonState === "valid" && (
                      <FaCheck className="text-3xl animate-fadeIn" />
                    )}
                    {buttonState === "invalid" && (
                      <div className="flex justify-center items-center">
                        <span className="dot dot1"></span>
                        <span className="dot dot2"></span>
                        <span className="dot dot3"></span>
                      </div>
                    )}
                  </button>
                </form>
                {nameError && (
                  <p className="text-gray-500 mt-2 text-xs animate-fadeIn">
                    Please enter a valid name
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center w-3/5 h-full">
              <div className="w-3/12 h-5/6 flex flex-col justify-center items-center bg-[#10069f] relative rounded-l-md">
                {selectedDate && (
                  <div className="flex justify-center items-center h-full w-full flex-col text-white mt-5">
                    <div className="text-center text-3xl font-semibold mb-4">
                      ${budgetValue ? budgetValue : "0"}
                    </div>
                    <div className="h-2/5 w-11/12 flex flex-col items-center justify-center">
                      <ResponsiveContainer width="100%" height="75%">
                        <PieChart>
                          <Pie
                            data={pie}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={50}
                            outerRadius={90}
                            isAnimationActive
                          >
                            {pie.map((d) => (
                              <Cell key={d.name} fill={d.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 flex flex-wrap justify-center gap-4">
                        {pie.map((d) => (
                          <div key={d.name} className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: d.color }}
                              aria-label={`${d.name} color`}
                              title={d.name}
                            />
                            <span className="text-base">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-2/6 w-10/12 mt-6">
                      <span className="flex h-1/5 items-center text-base underline uppercase font-bold text-[1vw] overflow-hidden">
                        Budgets:
                      </span>
                      <ul className="mt-1 list-disc list-inside text-base text-white w-full">
                        {Object.entries(alloc).map(([category, amount]) =>
                          amount !== "" && amount !== null && amount !== undefined ? (
                            <li key={category}>
                              {category}: ${Number(amount).toLocaleString()}
                            </li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="border border-blue-800 flex flex-col items-center justify-center w-8/12 h-5/6 bg-opacity-50 bg-white backdrop-blur-md rounded-r-md">
                {reservationCreated ? (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <FaCheckCircle className="checkmark-animation" size={100} color="blue" />
                    <h1 className="text-[2vw] overflow-hidden text-animation">RESERVACIÓN CREADA CON ÉXITO</h1>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full flex justify-center items-center">
                      {(() => {
                        switch (questions[currentQuestionIndex]) {
                          case "Income":
                            return (
                              <div className="flex flex-col items-center justify-center w-11/12 h-5/6">
                                <h2 className="text-6xl font-bold text-center mb-4 block">Total Income</h2>

                                <input
                                  type="text"
                                  className="placeholder:text-gray-600 placeholder:italic p-2 w-2/3 rounded-md text-center mb-4 block"
                                  placeholder="Enter your budget..."
                                  value={budgetValue ? `$${budgetValue}` : ""}
                                  onChange={(e) => {
                                    const onlyNums = e.target.value.replace(/\D/g, "");
                                    const formatted = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    setBudgetValue(formatted);
                                  }}
                                  style={{ backgroundColor: "transparent", color: "#000", fontWeight: "500", fontSize: "2rem" }}
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    input.current.value = `income ${budgetValue}`;
                                    sendMessage();
                                    handleQuestionClick(currentQuestionIndex + 1);
                                  }}
                                  className={`mt-4 flex items-center justify-center w-20 h-12 rounded-full border-2 transition-colors duration-500 ${budgetValue.trim() === ""
                                    ? "border-gray-500 text-gray-500 bg-gray-500 cursor-not-allowed"
                                    : "border-green-500 text-green-500 bg-green-500 hover:bg-green-600 cursor-pointer"
                                    }`}
                                  aria-label="Confirm budget"
                                  disabled={budgetValue.trim() === ""}
                                >
                                  <FaCheck className="text-white text-xl" />
                                </button>
                              </div>
                            );
                          case "Budgets":
                            const cleanNumberString = (str) => str.replace(/[^\d]/g, "");
                            return (
                              <div className="flex flex-col items-center justify-center w-11/12 h-5/6">
                                <h2 className="text-5xl font-bold text-center mb-4">Budget by category</h2>
                                <div className="flex w-full h-full items-start">
                                  <div className="flex flex-col items-center justify-center w-1/2 h-full">
                                    {cats.map((c) => (
                                      <div key={c} className="flex flex-col items-center mb-4">
                                        <span className="w-full text-center text-lg">{c}</span>
                                        <input
                                          className="w-3/4 h-12 rounded-md text-center text-lg outline-none focus:ring-4 focus:ring-blue-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          type="text"
                                          inputMode="numeric"
                                          value={
                                            alloc[c] !== undefined && alloc[c] !== null && alloc[c] !== ""
                                              ? `$${Number(alloc[c]).toLocaleString()}`
                                              : ""
                                          }
                                          onChange={(e) => {
                                            const rawValue = cleanNumberString(e.target.value);
                                            setAlloc(c, rawValue === "" ? "" : Number(rawValue));
                                          }}
                                        />
                                      </div>
                                    ))}

                                    {(() => {
                                      const hasValidValue = Object.values(alloc).some(
                                        (val) => typeof val === "number" && val > 0
                                      );
                                      return (
                                        <button
                                          type="button"
                                          className={`mt-4 flex items-center justify-center w-20 h-12 rounded-full border-2 transition-colors duration-500 ${hasValidValue
                                            ? "border-green-500 text-white bg-green-500 hover:bg-green-600 cursor-pointer"
                                            : "border-gray-500 text-white bg-gray-500 cursor-not-allowed"
                                            }`}
                                          aria-label="Confirm budget"
                                          disabled={!hasValidValue}
                                          onClick={() => {
                                            input.current.value = `budgets ${Object.entries(alloc).map(([cat, val]) => `${cat} ${val}`).join(" ")}`;
                                            sendMessage();
                                            handleQuestionClick(currentQuestionIndex + 1);
                                          }}
                                        >
                                          <FaCheck className="text-xl" />
                                        </button>
                                      );
                                    })()}
                                  </div>

                                  <div className="w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="70%">
                                      <PieChart>
                                        <Pie
                                          data={pie}
                                          dataKey="value"
                                          nameKey="name"
                                          innerRadius={80}
                                          outerRadius={120}
                                          isAnimationActive
                                        >
                                          {pie.map((d) => (
                                            <Cell key={d.name} fill={d.color} />
                                          ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                                      </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                                      {pie.map((d) => (
                                        <div key={d.name} className="flex items-center gap-2">
                                          <span
                                            className="w-6 h-6 rounded"
                                            style={{ backgroundColor: d.color }}
                                            aria-label={`${d.name} color`}
                                            title={d.name}
                                          />
                                          <span className="text-lg">{d.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          case "Expenses":
                            return (
                              <div className="flex flex-col items-center justify-center w-11/12 h-5/6">
                                <BudgetBreakdown
                                  category="Home"
                                  initialTotals={alloc}
                                  currency="USD"
                                  budgetsByCategory={alloc}
                                  onNextCategory={() => {
                                    handleQuestionClick(currentQuestionIndex + 1);
                                  }}
                                  onComplete={() => {
                                    console.log("Expenses complete");
                                  }}
                                  onExpensesChange={(data) => {
                                    if (data.expensesSeries) setExpensesData(data.expensesSeries);
                                  }}
                                />
                                <button
                                  type="button"
                                  className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                  onClick={() => {
                                    input.current.value = `expenses completed`;
                                    sendMessage();
                                    handleQuestionClick(currentQuestionIndex + 1);
                                  }}
                                >
                                  Next
                                </button>
                              </div>
                            );
                          case "Review":
                            return (
                              <ReviewPanel
                                income={budgetValue ? Number(budgetValue.replace(/,/g, "")) : 0}
                                budgets={alloc}
                                expenses={expensesData}
                              />
                            );
                          case "Strategies":
                            return (
                              <SavingsOverview
                                monthlyExpenses={budgetValue ? Number(budgetValue.replace(/,/g, "")) : 0}
                                emergencyMonthlyDeposit={budgetValue ? Number(budgetValue.replace(/,/g, "")) / 6 : 0}
                                shortTermGoalCost={budgetValue ? Number(budgetValue.replace(/,/g, "")) / 3 : 0}
                                shortTermDepositA={budgetValue ? Number(budgetValue.replace(/,/g, "")) / 5 : 0}
                                fastDeposit={budgetValue ? Number(budgetValue.replace(/,/g, "")) / 5 : 0}
                                monthlyLongTerm={budgetValue ? Number(budgetValue.replace(/,/g, "")) / 12 : 0}
                              />
                            );
                        }
                      })()}
                    </div>
                    <div className="w-full h-1/6 flex items-center justify-center space-x-4">
                      {questions.map((question, index) => (
                        <React.Fragment key={index}>
                          {index !== 0 && <span className="text-gray-500">•</span>}
                          <button
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleQuestionClick(index)}
                            className={`relative text-[1.1vw] h-4/6 w-auto flex items-center justify-center ${currentQuestionIndex === index ? "text-blue-500" : "text-gray-500"} ${hoverIndex === index ? "hovered" : ""}`}
                          >
                            {question}
                            {currentQuestionIndex === index && <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2 active-arrow">▼</span>}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ position: 'relative' }} className="flex justify-start w-full h-full">
          <div className="w-8/12 h-full grid grid-cols-1">
            {posterImages.length > 0 && currentImageIndex < posterImages.length ? (
              posterImages[currentImageIndex]?.file ? (
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${posterImages[currentImageIndex].file})` }}
                >
                </div>
              ) : (
                <div
                  className="bg-white text-black flex items-center justify-center"
                  style={{ height: '100%', width: '100%' }}
                >
                  Error al cargar las imagenes...
                </div>
              )
            ) : (
              <div
                className="bg-white text-black flex items-center justify-center"
                style={{ height: '100%', width: '100%' }}
              >
                No images available.
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="flex flex-col justify-center items-center h-full w-6/12">
            <div className="flex w-full h-1/6 relative">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#014ad1',
                position: 'absolute',
                clipPath: 'polygon(25% 100%, 30% 100%, 35% 0, 30% 0)',
                zIndex: 1
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                clipPath: 'polygon(30% 100%, 40% 100%, 45% 0, 35% 0)',
                zIndex: 2
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#001234',
                position: 'absolute',
                clipPath: 'polygon(40% 100%, 90% 100%, 95% 0, 45% 0)',
                zIndex: 3
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '65%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white'
                }}>
                  <span style={{
                    fontSize: '1vw',
                    color: 'white',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>Proxima Reservación</span>
                </div>
              </div>
            </div>
            <div className="flex w-full h-2/6">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#014ad1',
                position: 'relative',
                clipPath: 'polygon(10% 100%, 100% 100%, 100% 0, 20% 0)'
              }}>
                <ReservationBanner />
              </div>
            </div>
            <div className="flex w-full h-3/6 relative">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#002c7f',
                position: 'absolute',
                clipPath: 'polygon(13.5% 10%, 13.5% 10%, 10% 0, 15% 0)',
                zIndex: 1
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#014ad1',
                position: 'absolute',
                clipPath: 'polygon(0% 100%, 5% 100%, 20% 0, 15% 0)',
                zIndex: 2
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                clipPath: 'polygon(5% 100%, 15% 100%, 30% 0, 20% 0)',
                zIndex: 3
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#002c7f',
                position: 'absolute',
                clipPath: 'polygon(15% 100%, 65% 100%, 80% 0, 30% 0)',
                zIndex: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="flex flex-col items-start justify-center h-full w-full">
                  {data.map((item, index) => (
                    <div key={index} style={{ marginLeft: `${30 - index * 2}%` }} className="animate flex items-center justify-center w-6/12 h-1/6 text-center text-white">
                      <div style={{ fontSize: '0.7vw' }} className="flex h-5/6 w-6/12 items-center justify-center whitespace-nowrap font-bold text-2xl">{item.nombre}</div>
                      <div style={{ fontSize: '0.6vw' }} className="flex border-l border-white h-3/6 w-6/12 items-center justify-center whitespace-nowrap text-2xl">{item.horario}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                position: 'absolute',
                clipPath: 'polygon(10% 0%, 79.3% 5%, 80% 0%, 0% 0%)',
                zIndex: 5,
                opacity: 0.5
              }}>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};
