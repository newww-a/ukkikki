import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useParams } from 'react-router';
import { TravelPlanDetailProvider } from '../contexts/TravelPlanDetailContext';
import { ProposalDetailProvider } from '../contexts/ProposalDetailContext';
import MainLayout from '../components/TravelPlanner/MainLayout';
import { StyledMainLayout } from './style/CreateTravelPageStyle';
import { TravelPlanDetail } from '../api/agency';

const CreateTravelPage = () => {
  const { travelPlanId, proposalId } = useParams();
  console.log('travelPlanId:', travelPlanId, 'proposalId:', proposalId);

  // travelPlanId가 있을 경우 TravelPlanDetail API 호출 후 콘솔에 response.data 출력
  useEffect(() => {
    if (travelPlanId) {
      TravelPlanDetail(travelPlanId)
        .then((response) => {
          console.log('TravelPlanDetail Response:', response.data);
        })
        .catch((error) => {
          console.error('여행계획 세부조회 오류:', error);
        });
    }
  }, [travelPlanId]);

  return (
    <div>
      <Header />
      {proposalId ? (
        // 제안서 편집 페이지: proposalId가 있을 경우 ProposalDetailProvider 사용
        <ProposalDetailProvider
          proposalId={proposalId}
          travelPlanId={travelPlanId}
        >
          <StyledMainLayout>
            <MainLayout />
          </StyledMainLayout>
        </ProposalDetailProvider>
      ) : (
        // 새 여행 계획 생성 페이지: proposalId가 없으면 TravelPlanDetailProvider 사용
        <TravelPlanDetailProvider travelPlanId={travelPlanId}>
          <StyledMainLayout>
            <MainLayout />
          </StyledMainLayout>
        </TravelPlanDetailProvider>
      )}
      <Footer />
    </div>
  );
};

export default CreateTravelPage;
