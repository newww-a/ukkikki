import { useEffect } from 'react';
import { useLoadingStore } from '../store/loadingStore';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const About = () => {
  const { setLoading } = useLoadingStore(); // 전역 로딩 상태 변경 함수 가져오기

  useEffect(() => {
    setLoading(true); // 로딩 시작
    axios.get('/api/about').finally(() => {
      setLoading(false); // 데이터 로딩 완료 후 스피너 숨김
    });
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <h1 className="text-4xl font-bold text-green-600">About Us</h1>
      <Footer />
    </div>
  );
};

export default About;
