import { useLoadingStore } from '../../store/loadingStore';
import spinnerImage from '../../assets/loading-spinner.png';
const LoadingSpinner = () => {
  const { loading } = useLoadingStore(); // Zustand에서 로딩 상태 가져오기
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
      <img
        src={spinnerImage}
        alt="Loading..."
        className="w-16 h-16 animate-slow-spin"
      />
    </div>
  );
};

export default LoadingSpinner;
