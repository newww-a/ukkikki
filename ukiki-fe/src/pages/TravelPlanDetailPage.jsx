import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProposalContent from '../components/agencyDetail/ProposalContent.jsx';
import PlaceList from '../components/agencyDetail/PlaceList.jsx';
import { TravelPlanDetailProvider } from '../contexts/TravelPlanDetailContext.jsx';
import UserLocationMap from '../components/agencyDetail/UserLocationMap.jsx';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

const TravelPlanDetail = () => {
  const { travelPlanId } = useParams();
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);

  const onhandleCreatePlan = () => {
    navigate(`/travel-plans/${travelPlanId}/proposals`);
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    console.log('선택한 장소:', place);
  };

  return (
    <TravelPlanDetailProvider travelPlanId={travelPlanId}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="pt-[30px] flex-grow">
          <div>
            <div>
              <ProposalContent />
            </div>
            <div className="flex justify-end items-end mr-[90px]">
              <button
                onClick={onhandleCreatePlan}
                className="w-[100px] h-[40px] bg-white text-black text-[1rem] font-medium border border-black rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 "
              >
                수락
              </button>
            </div>
            <div className="flex gap-5 p-10">
              <div className="flex-grow p-4">
                <UserLocationMap
                  latitude={selectedPlace?.latitude}
                  longitude={selectedPlace?.longitude}
                />
              </div>
              <div className="w-[440px] m-4 h-[500px] overflow-y-auto no-scrollbar">
                <PlaceList handlePlaceClick={handlePlaceClick} />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </TravelPlanDetailProvider>
  );
};

export default TravelPlanDetail;
