import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/mypage/Sidebar';
import OngoingProposals from '../components/mypage/company/OngoingProposals';
import ReceivedProposals from '../components/mypage/company/ReceivedProposals';
import { TravelPlanProvider } from '../contexts/travelPlanContext';
import useAuthStore from '../store/authStore';
import { useNavigate, useLocation } from 'react-router';
import {
  MyProfileContainer,
  MainContentWrapper,
  GridWrapper,
  SidebarWrapper,
  ContentWrapper,
} from './style/MyProfilePageStyle';
import AcceptedProposals from '../components/mypage/company/AcceptedProposals';

const ProposalStatus = () => {
  const navigate = useNavigate();
  const { userRole } = useAuthStore();

  if (userRole !== 'company') {
    navigate('/'); // 여행사가 아니면 메인 페이지로 리다이렉트
  }

  const [activeComponent, setActiveComponent] = useState('receivedProposals'); // 기본값을 'receivedProposals'

  const renderContent = () => {
    if (activeComponent === 'receivedProposals') {
      return (
        <TravelPlanProvider>
          <ReceivedProposals />
        </TravelPlanProvider>
      );
    }
    if (activeComponent === 'ongoingProposals') {
      return (
        <TravelPlanProvider>
          <OngoingProposals />
        </TravelPlanProvider>
      );
    }
    if (activeComponent === 'AcceptedProposals') {
      return (
        <TravelPlanProvider>
          <AcceptedProposals />
        </TravelPlanProvider>
      );
    }
  };

  return (
    <MyProfileContainer>
      <Header />
      <MainContentWrapper>
        <GridWrapper>
          {/* 왼쪽 여백 */}
          <SidebarWrapper>
            <Sidebar
              onMenuClick={setActiveComponent} // 클릭 시 activeComponent 값을 변경
              userRole={userRole} // 사용자 역할을 전달
            />
          </SidebarWrapper>
          {/* 메인 콘텐츠 */}
          <ContentWrapper>{renderContent()}</ContentWrapper>
        </GridWrapper>
      </MainContentWrapper>
      <Footer />
    </MyProfileContainer>
  );
};

export default ProposalStatus;
