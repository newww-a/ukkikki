import React from 'react';

const FlightList = ({ flights, isLoading }) => {
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!flights || flights.length === 0) {
    return <div>항공편 정보가 없습니다.</div>;
  }

  return (
    <ul>
      {flights.map((flight, index) => (
        <li key={index} className="border-b p-2">
          {flight.airline} - {flight.flightNum} ({flight.departureTime} → {flight.arrivalTime})
        </li>
      ))}
    </ul>
  );
};

export default FlightList;