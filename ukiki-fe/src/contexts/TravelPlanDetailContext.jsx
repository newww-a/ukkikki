//여행 계획 제안 디테일
import React, { createContext, useEffect, useState } from "react";
import { TravelPlanDetail } from "../api/agency";

const TravelPlanDetailContext = createContext();

export const TravelPlanDetailProvider = ({children, travelPlanId}) => {
  const [proposal, setProposals ] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState(null);
  

  useEffect(() => {
    const fetchTravelPlanData = async() => {
      try {
        const data = await TravelPlanDetail(travelPlanId);
        console.log('여행 계획 제안 상세 호출 성공:',data)
        setProposals(data);

      } catch(error) {
        console.log('error:', error);
      }
    };
    if (travelPlanId) {
      fetchTravelPlanData();
    }
  },[travelPlanId]);

  const setSelectedDay = (dayId) => {
    setSelectedDayId(dayId);
  }
  return (
    <TravelPlanDetailContext.Provider value={{proposal, selectedDayId, setSelectedDay}}>
      {children}
    </TravelPlanDetailContext.Provider>
  );
};

export default TravelPlanDetailContext;