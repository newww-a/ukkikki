import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  StylePlaceList, 
  StylePlaceContent,
  StylePlace,
} from './style/SuggestedPlaceListStyle';

const SuggestedPlaceList = ({ places, onSelectPlace, onSelectDay }) => {
  const [selectedMap, setSelectedMap] = useState({});

  useEffect(() => {
    const initialMap = {};
    places.forEach(place => {
      const key = place.id || uuidv4(); // key가 고유하도록 uuid 사용
      initialMap[key] = false; // 초기값 false로 설정
    });
    setSelectedMap(initialMap); // places 배열 변경 시마다 초기화
  }, [places]); // places가 변경될 때마다 실행

  useEffect(() => {
    console.log('selectedMap state changed:', selectedMap);
  }, [selectedMap]);

  const handleClick = (place, key) => {
    console.log("Before Update:", selectedMap); // 상태 업데이트 전
    onSelectPlace(place);
    
    setSelectedMap((prev) => {
      const newState = { ...prev, [key]: !prev[key] }; // 상태 토글
      console.log('Updated selectedMap:', newState); // 상태 업데이트 후
      return newState;
    });
  };
    
  // 좋아요 수(likeCount)를 기준으로 내림차순 정렬 (좋아요가 높은 순)
  const sortedPlaces = [...places].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));

  return (
    <div>
      {sortedPlaces.map((place) => {
        const key = place.id || uuidv4(); // ID가 없으면 uuid 생성
        return (
          <StylePlaceList key={key}>
            <StylePlace>
              <div className="flex items-center">
                {place.photoUrl ? (
                  <img 
                    src={place.photoUrl} 
                    alt={place.name} 
                    className="w-20 h-20 object-cover aspect-square m-4 rounded-[20px]"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-sm text-gray-600">No image</span>
                  </div>
                )}

                <StylePlaceContent>
                  <p className="font-semibold text-3xl">{place.name}</p>
                  <p className="text-sm text-gray-600">❤️ {place.likeCount}</p>
                </StylePlaceContent>
              </div> 
              <button 
                  onClick={() => 
                    handleClick({
                      scheduleName: place.name,
                      latitude: place.latitude,
                      longitude: place.longitude,
                      imageUrl: place.photoUrl,
                    }, key)
                  }
                >
                  {selectedMap[key] ? 'test' : '✔️'} {/* 버튼 상태에 따라 text 변경 */}
              </button>
                 
            </StylePlace>
          </StylePlaceList>
        );
      })}
    </div>
  );
};

export default SuggestedPlaceList;
