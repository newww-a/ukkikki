import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProposalContent from '../components/agencyDetail/ProposalContent.jsx';
import PlaceList from '../components/agencyDetail/PlaceList.jsx';
import { TravelPlanDetailProvider } from '../contexts/TravelPlanDetailContext.jsx';
import UserLocationMap from '../components/agencyDetail/UserLocationMap.jsx';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import {
  ProposalDetailContainer,
  ContentContainer,
  ProposalContentWrapper,
  MapAndPlaceWrapper,
  MapWrapper,
  PlaceListWrapper,
  AcceptButton,
  ButtonPosition,
} from './style/TravelPlanDetailPageStyle.jsx';

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
      <ProposalDetailContainer>
        <Header />
        <ContentContainer>
          <div>
            <ProposalContentWrapper>
              <ProposalContent />
            </ProposalContentWrapper>
            <ButtonPosition>
              <AcceptButton onClick={onhandleCreatePlan}>수락</AcceptButton>
            </ButtonPosition>
            <MapAndPlaceWrapper>
              <MapWrapper>
                <UserLocationMap
                  latitude={selectedPlace?.latitude}
                  longitude={selectedPlace?.longitude}
                />
              </MapWrapper>
              <PlaceListWrapper>
                <PlaceList handlePlaceClick={handlePlaceClick} />
              </PlaceListWrapper>
            </MapAndPlaceWrapper>
          </div>
        </ContentContainer>

        <Footer />
      </ProposalDetailContainer>
    </TravelPlanDetailProvider>
  );
};

export default TravelPlanDetail;
