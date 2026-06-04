import { useContext } from "react";
import TravelPlanDetailContext from "../../contexts/TravelPlanDetailContext";

const PlaceList = ({ handlePlaceClick }) => {
  const { proposal } = useContext(TravelPlanDetailContext);

  if (!proposal || !proposal.data || !proposal.data.travelPlan) {
    return <div>장소를 불러오지 못했습니다.</div>;
  }

  const { places } = proposal.data.travelPlan;
  
  // places가 없다면 '장소가 없습니다.' 메시지 표시
  if (!places || places.length === 0) {
    return <div>장소가 없습니다.</div>;
  };

  // likeCount를 기준으로 내림차순으로 정렬
  const sortedPlaces = places.sort((a, b) => b.likeCount - a.likeCount);

  return (
    <div className="flex flex-col w-full gap-1 p-2  cursor-pointer">
      {sortedPlaces.map((place, idx) => {

        const visibleTags = place.tags && place.tags.length > 5 ? place.tags.slice(0, 5) : place.tags;
        const showMoreText = place.tags && place.tags.length > 5; 
        
        return (
          <div 
            className="relative flex flex-col items-start justify-start w-[400px] h-[100px] px-2 mb-4 overflow-hidden bg-[#fafafa] border-2 border-[#ddd] rounded-[10px] shadow-sm" 
            key={idx} 
            onClick={() => { handlePlaceClick(place) }}
          >
            <p className="mt-[10px] text-[1.1rem] text-[#333] font-bold truncate">{place.name}</p>
            <span className="absolute top-[5px] right-[10px] mt-[5px] text-[#412B2B] text-[1rem] ">👍 {place.likeCount}</span>

            {/* 태그들이 수평으로 나열되도록 */}
            <div className="relative flex flex-wrap gap-[5px] pt-[5px] overflow-hidden">
              {visibleTags && visibleTags.length > 0 ? (
                visibleTags.map((tag, index) => (
                  <span 
                    className="inline-block text-[#4f5b62] max-w-full overflow-hidden text-[0.9rem] font-semibold truncate" 
                    key={index}
                  >
                    # {tag.name}
                  </span>
                ))
              ) : (
                <p className="text-[0.9rem] text-[#9ca3af] mt-[5px] text-center">태그가 없습니다.</p>
              )}
              {showMoreText && (
                <span className="inline-block text-[#4f5b62] max-w-full overflow-hidden text-[0.9rem] font-semibold truncate" >
                  # 더보기...
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaceList;
