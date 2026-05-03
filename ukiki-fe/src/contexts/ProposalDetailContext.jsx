import React, { createContext, useEffect, useState } from "react";
import { ProposalDetail } from "../api/agency";

const ProposalDetailContext = createContext();

export const ProposalDetailProvider = ({children, proposalId, travelPlanId}) => {
  const [proposal, setProposal] = useState(null);
  const [selectedDayId, setSelectedDay] = useState(1); 

  useEffect(() => {
    const fetchProposalData = async() => {
      try {
        const response = await ProposalDetail(proposalId, travelPlanId);
        console.log('제안서 상세 데이터 호출 성공:', response.data)
        setProposal(response.data)
      } catch(error) {
        console.log('제안서 상세 데이터 호출 실패:', error)
      }
    };
    if(travelPlanId && proposalId) {
      fetchProposalData();
    }
  }, [travelPlanId, proposalId]);

  return (
    <ProposalDetailContext.Provider value={{proposal, selectedDayId, setSelectedDay}}>
      {children}
    </ProposalDetailContext.Provider>
  )
};
export default ProposalDetailContext;