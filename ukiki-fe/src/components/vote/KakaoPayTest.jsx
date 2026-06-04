import { useEffect } from 'react';
import logo from '../../assets/kakaopay.png';
import Swal from 'sweetalert2';

const KakaoPayTest = ({ onPaymentComplete }) => {
  useEffect(() => {
    const { IMP } = window;
    const merchantId = import.meta.env.VITE_APP_MPORT_MERCHANT_ID;
    IMP.init(merchantId);
  }, []);

  const requestPay = () => {
    const { IMP } = window;
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: `mid_${new Date().getTime()}`,
        name: '테스트 상품',
        amount: 100,
        buyer_email: 'test@test.com',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678',
        buyer_addr: '서울특별시 강남구',
        buyer_postcode: '12345',
      },
      (rsp) => {
        if (rsp.success) {
          console.log('결제 성공:', rsp);
          if (onPaymentComplete) {
            onPaymentComplete();
          }
        } else {
          console.log('결제 실패:', rsp);
          Swal.fire('알람', `❌ 결제 실패: ${rsp.error_msg}`, 'error');
        }
      },
    );
  };

  return (
    <div className="flex items-center justify-center py-4">
      <button
        onClick={requestPay}
        className="flex items-center justify-center w-full gap-2 px-6 py-3 text-lg font-semibold text-gray-800 transition-all duration-200 bg-yellow-400 border border-yellow-500 rounded-lg shadow-md hover:bg-yellow-500"
      >
        <img src={logo} alt="KakaoPay Logo" className="w-20" />
        카카오페이 결제하기
      </button>
    </div>
  );
};

export default KakaoPayTest;
