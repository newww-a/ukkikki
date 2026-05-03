import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/mypage/Sidebar';
import UserProfile from '../components/mypage/profile/UserProfile';
import MyRooms from '../components/mypage/myroom/MyRooms';
import OngoingProposals from '../components/mypage/company/OngoingProposals'; 
import ReceivedProposals from '../components/mypage/company/ReceivedProposals'; 
import AcceptedProposals from '../components/mypage/company/AcceptedProposals';  
import useAuthStore from '../store/authStore';
import { TravelPlanProvider } from '../contexts/travelPlanContext';
import { useLocation } from 'react-router';
import { 
  MyProfileContainer, 
  MainContentWrapper, 
  GridWrapper, 
  SidebarWrapper, 
  ContentWrapper 
} from './style/MyProfilePageStyle';

const MyProfile = () => {
  const location = useLocation();
  const { userRole } = useAuthStore();
  const [activeComponent, setActiveComponent] = useState(location.state?.activeComponent || 'profile');

  const renderContent = () => {
    if (activeComponent === 'profile') {
      return <UserProfile />;
    }
    if (userRole === 'company' && activeComponent === 'ReceivedProposals') {
      return (
        <TravelPlanProvider>
          <ReceivedProposals />
        </TravelPlanProvider>
      );
    }
    if (userRole === 'company' && activeComponent === 'OngoingProposals') {
      return (
        <TravelPlanProvider>
          <OngoingProposals />
        </TravelPlanProvider>
      );
    }
    if (userRole === 'company' && activeComponent === 'AcceptedProposals') {  
      return (
        <TravelPlanProvider>
          <AcceptedProposals />
        </TravelPlanProvider>
      );
    }
    return <MyRooms />;
  }
  
  return (
    <MyProfileContainer>
      <Header />
      <MainContentWrapper>
        <GridWrapper>
          {/* 왼쪽 여백 */}
          <SidebarWrapper>
            <Sidebar 
            onMenuClick={setActiveComponent}
            userRole={userRole}
            />
          </SidebarWrapper>
          {/* 메인콘텐츠 */}
          <ContentWrapper>
            {renderContent()}
          </ContentWrapper>
        </GridWrapper>
      </MainContentWrapper>
    </MyProfileContainer>
  );
};

export default MyProfile;
