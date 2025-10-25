import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './ReservationBanner.css';
import axiosInstance from '../hooks/axiosInstance';
import { startOfDay, endOfDay, format, subMinutes } from 'date-fns';

const ReservationBanner = () => {
  const [DBreservations, setDBReservations] = useState([]);
  const [indexReservation, setIndexReservation] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const now = new Date();
    const startDate = format(subMinutes(now, 15), 'yyyy-MM-dd HH:mm');
    const endDate = format(endOfDay(now), 'yyyy-MM-dd HH:mm');
    //const startDate = startOfDay(now).toISOString();
    //const endDate = endOfDay(now).toISOString();
    console.log(startDate.toString())
    axiosInstance.get(`/admin/reservations/selector/${startDate}/${endDate}`, {
      params: {
        start_date: startDate, end_date: endDate
      }
    })
      .then(response => {
        // console.log('API response:', response.data);
        if (Array.isArray(response.data)) {
          const reservations = response.data.map(reservation => ({
            name: reservation.user.name,
            room: reservation.room.name,
            time: `${new Date(reservation.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(reservation.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          }));
          // console.log('Formatted reservations:', reservations);
          setDBReservations(reservations);
          setError(null);
        } else {
          throw new Error('La respuesta no es un array.');
        }
      })
      .catch(error => {
        // console.error('Error fetching reservations:', error);
        setError('Error al cargar reservaciones.');
      });
  }, []);

  useEffect(() => {
    if (DBreservations.length > 0) {
      const intervalId = setInterval(() => {
        setIndexReservation((prevIndex) => (prevIndex + 1) % DBreservations.length);
      }, 7000);

      return () => clearInterval(intervalId);
    }
  }, [DBreservations.length]);

  const currentReservation = DBreservations[indexReservation];
  // console.log('Current reservation:', currentReservation);

  return (
    <div className="flex items-center justify-end w-full h-full">
      <TransitionGroup className="reservation-container">
        <CSSTransition
          key={indexReservation}
          timeout={500}
          classNames="reservation">
          {currentReservation ? (
            <div className="reservation-item flex items-center justify-end w-full h-full">
              <div className="flex flex-col w-5/12 h-5/6 mr-2">
                <div className="flex items-end justify-end h-3/6">
                  <span style={{
                    fontSize: '2vw',
                    color: 'white',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>{currentReservation.name}</span>
                </div>
                <div className="items-start justify-end flex h-1/6">
                  <span style={{
                    fontSize: '1.5vw',
                    color: '#00FFF7',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>{currentReservation.room}</span>
                </div>
              </div>
              <div className="border-l border-white flex flex-col items-center justify-center w-4/12 h-4/6 ml-2 mr-4">
                <label style={{
                  fontSize: '1.5vw',
                  fontFamily: 'Arial, sans-serif',
                  color: 'white',
                  whiteSpace: 'nowrap'
                }}>{currentReservation.time}</label>
              </div>
            </div>
          ) : (
            <div className="reservation-item flex items-center justify-center w-full h-full">
              <span style={{ color: 'white', fontSize: '2vw' }}>
                {error ? error : 'Cargando reservaciones...'}
              </span>
            </div>
          )}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ReservationBanner;
