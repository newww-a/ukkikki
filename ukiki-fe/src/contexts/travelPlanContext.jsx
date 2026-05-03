import React, { createContext, useEffect, useState } from "react";
import { UserProposalslist } from "../api/agency";

const TravelPlanContext = createContext();

export const TravelPlanProvider = ({children}) => {

  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);

  //여행 제안서 목록 가져오기
  useEffect(() => {
    const getUserProposals = async() => {
      setError(null);

      try{
        const data = await UserProposalslist();
        console.log("API 응답 데이터:", data);
        setProposals(data.travelPlans);
      } catch(error) {
        setError('사용자 제안 목록을 불러오는 데 실패했습니다.');
        console.error(error);
      } 
    };

      getUserProposals();
  },[]);


  return (
    <TravelPlanContext.Provider value={{ proposals, error}}>
      {children}
    </TravelPlanContext.Provider>
  );
};

export default TravelPlanContext;