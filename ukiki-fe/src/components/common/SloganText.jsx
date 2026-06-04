
const SloganText = ({ textColor = 'text-white' }) => {
  return (
    <div className="w-full mb-8 text-center md:w-1/2 md:text-left md:mb-0 fade-in-left">
      <h1
        className={`text-pretendard text-4xl md:text-7xl font-bold ${textColor}`}
        style={{ lineHeight: '1.4em' }} // 또는 더 큰 값으로 조정
      >
        우리끼리
        <br /> 만드는
        <br />
        패키지 여행
      </h1>
    </div>
  );
};
export default SloganText;
