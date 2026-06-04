import { useState, useEffect } from 'react';

const VoteCountdown = ({ closeTime }) => {
  // 투표 시작: closeTime + 7일, 투표 종료: closeTime + 10일
  const voteStart = new Date(
    new Date(closeTime).getTime() + 7 * 24 * 3600 * 1000,
  );
  const voteEnd = new Date(
    new Date(closeTime).getTime() + 10 * 24 * 3600 * 1000,
  );
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000); // 1초마다 업데이트하여 실시간 카운트다운 효과 부여
    return () => clearInterval(timer);
  }, []);

  let message = '';
  let remainingTime = 0;

  if (now < voteStart) {
    message = '투표 시작까지';
    remainingTime = voteStart - now;
  } else if (now < voteEnd) {
    message = '투표 종료까지';
    remainingTime = voteEnd - now;
  } else {
    return (
      <div className="text-center text-gray-500">
        투표 기간이 종료되었습니다.
      </div>
    );
  }

  const oneDayMs = 1000 * 3600 * 24;
  let displayTime = '';

  if (remainingTime < oneDayMs) {
    // 남은 시간이 1일 미만이면 시간과 분 단위로 계산
    const totalMinutes = Math.ceil(remainingTime / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    displayTime = `${hours}시간 ${minutes}분`;
  } else {
    const days = Math.ceil(remainingTime / oneDayMs);
    displayTime = `${days}일`;
  }

  return (
    <div className="text-lg text-center text-blue-600">
      {message} {displayTime} 남았습니다.
    </div>
  );
};

export default VoteCountdown;
