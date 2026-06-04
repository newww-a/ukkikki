import { useContext, useState, useRef, useEffect } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';
import ProposalDetailContext from '../../contexts/ProposalDetailContext';
import SuggestedPlaceList from './PlaceList/SuggestedPlaceList';
import SearchPlace from './PlaceList/SearchPlace';
import { v4 as uuidv4 } from 'uuid';

const libraries = ['places'];
const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;

const PlaceSelection = ({ onSelectPlace }) => {
  // 두 컨텍스트 모두 사용
  const travelPlanContext = useContext(TravelPlanDetailContext);
  const proposalDetailContext = useContext(ProposalDetailContext);

  // proposal은 두 컨텍스트 중 값이 있는 쪽 사용
  const proposal =
    proposalDetailContext?.proposal || travelPlanContext?.proposal;

  // selectedDayId: 두 컨텍스트 모두에서 가져옵니다.
  const contextSelectedDayId =
    proposalDetailContext?.selectedDayId !== undefined
      ? proposalDetailContext.selectedDayId
      : travelPlanContext?.selectedDayId;
  const selectedDayId =
    contextSelectedDayId !== undefined ? contextSelectedDayId : 1;

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [enhancedPlaceList, setEnhancedPlaceList] = useState([]);
  const [addedPlaces, setAddedPlaces] = useState([]); // 이미 추가된 장소를 저장할 state
  const autocompleteRef = useRef(null);
  const enhancedPlacesRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    language: 'ko', // 모든 컴포넌트에서 동일한 언어 설정 사용
  });

  if (!proposal) {
    return <div>로딩중</div>;
  }

  // travelPlan 데이터: 생성 페이지의 경우 proposal.data.travelPlan, 수정 페이지의 경우 proposal 자체 사용
  const travelPlan =
    proposal.data && proposal.data.travelPlan
      ? proposal.data.travelPlan
      : proposal;
  const { startDate, endDate } = travelPlan;

  // 기본 장소 목록 설정: travelPlan.places가 있으면 사용, 없으면 proposal.scheduleItems를 매핑하여 생성
  const rawPlaces = travelPlan.places || proposal.scheduleItems || [];

  // 만약 rawPlaces가 proposal.scheduleItems에서 온 것이라면, 필요한 형태로 매핑해줍니다.
  const places = rawPlaces.map((p) => {
    if (p.placeId) {
      return {
        id: p.placeId,
        name: p.name,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        photoUrl: p.photoUrl || null,
        rating: p.rating || null,
        likeCount: p.likeCount,
      };
    } else {
      // travelPlan.places인 경우는 그대로 사용
      return p;
    }
  });

  useEffect(() => {
    if (!isLoaded || !places || places.length === 0) return;
    if (enhancedPlacesRef.current) {
      setEnhancedPlaceList(enhancedPlacesRef.current);
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div'),
    );

    Promise.all(
      places.map((p) => {
        return new Promise((resolve) => {
          const query = `${p.name} ${p.address}`;
          const request = {
            query,
            fields: [
              'formatted_address',
              'name',
              'place_id',
              'photos',
              'rating',
              'geometry',
            ],
          };

          service.findPlaceFromQuery(request, (results, status) => {
            let photoUrl = null;
            let rating = null;
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results &&
              results.length > 0
            ) {
              const placeResult = results[0];
              photoUrl =
                placeResult.photos && placeResult.photos.length > 0
                  ? placeResult.photos[0].getUrl({
                      maxWidth: 400,
                      maxHeight: 400,
                    })
                  : null;
              rating = placeResult.rating || null;
            }
            resolve({
              id: p.id || uuidv4(),
              ...p,
              photoUrl,
              rating,
            });
          });
        });
      }),
    ).then((enhanced) => {
      enhancedPlacesRef.current = enhanced;
      setEnhancedPlaceList(enhanced);
    });
  }, [isLoaded, places]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const photoUrl =
          place.photos && place.photos.length > 0
            ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 400 })
            : null;
        const rating = place.rating || null;

        const newPlace = {
          id: Date.now(),
          name: place.name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          photoUrl,
          rating,
        };
        setSearchedPlace(newPlace);
      }
    }
  };

  const getTravelDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return Array.from({ length: diffDays }, (_, i) => ({
      id: i + 1,
      label: `${i + 1}일차`,
      date: new Date(start.getTime() + i * 86400000)
        .toISOString()
        .split('T')[0],
    }));
  };

  const travelDays = getTravelDays(startDate, endDate);
  const selectedDay = travelDays.find((day) => day.id === selectedDayId);

  console.log('선택된 일자:', selectedDay);

  // 장소 선택 시 local state와 부모 콜백에 모두 반영합니다.
  const handleSelectPlace = (place) => {
    // 이미 추가된 장소가 아니라면 추가
    if (!addedPlaces.find((p) => p.id === place.id)) {
      setAddedPlaces((prev) => [...prev, place]);
    }
    // 부모 컴포넌트의 콜백 호출
    onSelectPlace(place);
  };

  // 이미 추가된 장소를 제외한 장소 목록 필터링
  const filteredPlaceList = enhancedPlaceList.filter(
    (place) => !addedPlaces.find((p) => p.id === place.id),
  );

  return (
    <div className="mt-[14px] px-[5px]">
      <div className="bg-white ml-[-5px] mt-[-14px] w-[102%] md:w-[95%] md:mx-auto sm:w-[90%] sm:mx-auto">
        {selectedDay && (
          <div className="ml-[5px]">
            <span className="text-[30px] font-bold text-[#333]">
              {selectedDay.label}
            </span>
            <span className="text-[18px] text-[#555] ml-[5px]">
              _ [{selectedDay.date}]
            </span>
          </div>
        )}
        <div className="flex mb-[14px] justify-evenly">
          <button
            onClick={() => setIsSearchMode(false)}
            className={`flex-1 px-[2px] py-[8px] text-[16px] font-semibold cursor-pointer border-none border-b-2 transition-all duration-200 text-center min-w-[10px] whitespace-nowrap 
            ${
              !isSearchMode
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#9ca3af]'
            }`}
          >
            제안 장소 목록
          </button>
          <button
            onClick={() => setIsSearchMode(true)}
            className={`flex-1 px-[2px] py-[8px] text-[16px] font-semibold cursor-pointer border-none border-b-2 transition-all duration-200 text-center min-w-[10px] whitespace-nowrap 
            ${
              isSearchMode
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#9ca3af]'
            }`}
          >
            새로운 장소 검색
          </button>
        </div>
      </div>

      <div className="h-[550px] overflow-y-auto">
        {!isSearchMode ? (
          <SuggestedPlaceList
            places={filteredPlaceList}
            onSelectPlace={handleSelectPlace}
            onSelectDay={selectedDay.date}
          />
        ) : (
          <SearchPlace
            isLoaded={isLoaded}
            autocompleteRef={autocompleteRef}
            onPlaceChanged={onPlaceChanged}
            searchedPlace={searchedPlace}
            setSearchedPlace={setSearchedPlace} // 이 부분을 추가해야 합니다.
            onSelectPlace={(place) => {
              console.log('onSelectPlace called with:', place);
              handleSelectPlace(place);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PlaceSelection;
