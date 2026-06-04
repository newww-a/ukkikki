import { useState } from 'react';
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

const MyProfile = () => {
  const location = useLocation();
  const { userRole } = useAuthStore();
  const [activeComponent, setActiveComponent] = useState(
    location.state?.activeComponent || 'profile',
  );

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
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex-grow max-w-[1280px] mx-auto py-[40px] px-[24px] h-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-[20px] md:gap-[16px]">
          {/* 왼쪽 여백 */}
          <div className="border-r border-[#e2e8f0] pr-[16px] hidden md:block">
            <Sidebar onMenuClick={setActiveComponent} userRole={userRole} />
          </div>
          {/* 메인콘텐츠 */}
          <div className="bg-white p-[16px]">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
