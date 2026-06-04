import { useContext, useEffect, useState } from 'react';
import { LoadScript, InfoWindow } from '@react-google-maps/api';
import PlaceMap from '../../services/map/PlaceMap';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';

const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;

const UserLocationMap = ({ latitude, longitude }) => {
  const { proposal } = useContext(TravelPlanDetailContext);
  const [centerCoordinates, setCenterCoordinates] = useState({
    lat: 37.5665,
    lng: 126.978,
  }); // 서울 기본 좌표 설정
  const [zoomLevel, setZoomLevel] = useState(12);
  const [place, setPlace] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (
      proposal &&
      proposal.data &&
      proposal.data.travelPlan &&
      proposal.data.travelPlan.places
    ) {
      const places = proposal.data.travelPlan.places;
      setPlace(places);
      // 첫 번째 장소의 위도와 경도로 지도 초기화
      const firstPlace = places[0];
      if (firstPlace) {
        setCenterCoordinates({
          lat: firstPlace.latitude,
          lng: firstPlace.longitude,
        });
        setZoomLevel(16); // 첫 번째 장소에 맞춰 줌 레벨 설정
      }
    }
  }, [proposal]);

  useEffect(() => {
    // 만약 latitude와 longitude가 제공되면 해당 좌표로 지도 설정
    if (latitude && longitude) {
      setCenterCoordinates({ lat: latitude, lng: longitude });
      setZoomLevel(16);
    }
  }, [latitude, longitude]);

  const handleMarkerClick = (place) => {
    console.log('마커 클릭:', place);
    setSelectedMarker(place);
  };

  if (!centerCoordinates) {
    return <div>지도 로딩 중...</div>;
  }

  return (
    <div className='w-full h-[500px]'>
      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        <PlaceMap
          coordinates={centerCoordinates}
          markers={place.map((place) => ({
            lat: place.latitude,
            lng: place.longitude,
            onClick: () => handleMarkerClick(place),
          }))}
          zoom={zoomLevel}
        >
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.latitude,
                lng: selectedMarker.longitude,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div
                style={{
                  width: '300px',
                  minHeight: '100px',
                  marginTop: '-10px',
                }}
                className="p-2"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span className="text-lg font-bold">
                    {selectedMarker?.name}
                  </span>
                  <span
                    className=" pr-2 text-[15px] font-bold rounded-full right-7"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    ❤️{selectedMarker?.likeCount}
                  </span>
                </div>
                <div>태그:</div>
                {selectedMarker.tags && selectedMarker.tags.length > 0 ? (
                  <div className="mt-2">
                    {selectedMarker.tags.map((tag, idx) => (
                      <span
                        key={tag.placeTagId || idx}
                        className="text-xs bg-gray-200 px-1 py-0.5 rounded mr-1"
                      >
                        #{typeof tag === 'object' ? tag.name : tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">태그가 없습니다.</p>
                )}
              </div>
            </InfoWindow>
          )}
        </PlaceMap>
      </LoadScript>
    </div>
  );
};

export default UserLocationMap;
