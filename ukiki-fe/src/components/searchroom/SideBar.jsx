import { useState } from 'react';

const Sidebar = ({ onFilter }) => {
  const themes = [
    '골프',
    '관광+휴양',
    '휴양',
    '관광',
    '럭셔리',
    '식도락',
    '축구',
    '현지문화체험',
    '해양스포츠',
    '온천',
    'SNS핫플',
    '성지순례',
    '기차여행',
  ];
  const roomStates = ['진행중', '요청중', '예약중', '여행확정'];

  const [selectedThemes, setSelectedThemes] = useState(['전체보기']);
  const [selectedRoomStates, setSelectedRoomStates] = useState(['전체보기']);

  // 테마 버튼 클릭 핸들러
  const handleThemeClick = (theme) => {
    if (theme === '전체보기') {
      setSelectedThemes(['전체보기']);
      onFilter(['전체보기'], selectedRoomStates);
    } else {
      const newThemes = selectedThemes.includes('전체보기')
        ? [theme]
        : selectedThemes.includes(theme)
        ? selectedThemes.filter((t) => t !== theme) // 이미 선택된 테마 제거
        : [...selectedThemes, theme]; // 새로운 테마 추가

      setSelectedThemes(newThemes);
      onFilter(newThemes, selectedRoomStates);
    }
  };

  // 방 상태 버튼 클릭 핸들러
  const handleRoomStateClick = (state) => {
    if (state === '전체보기') {
      setSelectedRoomStates(['전체보기']);
      onFilter(selectedThemes, ['전체보기']);
    } else {
      const newStates = selectedRoomStates.includes('전체보기')
        ? [state]
        : selectedRoomStates.includes(state)
        ? selectedRoomStates.filter((s) => s !== state) // 이미 선택된 상태 제거
        : [...selectedRoomStates, state]; // 새로운 상태 추가

      setSelectedRoomStates(newStates);
      onFilter(selectedThemes, newStates);
    }
  };

  return (
    <aside className="p-6 space-y-6 bg-gray-100 shadow-md w-80">
      {/* 방 상태 필터 */}
      <div>
        <h3 className="mb-4 text-lg font-bold">방 상태</h3>
        <div className="flex flex-wrap gap-2">
          {['전체보기', ...roomStates].map((state, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedRoomStates.includes(state)
                  ? 'bg-yellow text-brown font-bold'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleRoomStateClick(state)}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* 여행 테마 필터 */}
      <div>
        <h3 className="mb-4 text-lg font-bold">여행 테마</h3>
        <div className="flex flex-wrap gap-2">
          {['전체보기', ...themes].map((theme, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedThemes.includes(theme)
                  ? 'bg-yellow text-brown font-bold'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleThemeClick(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
