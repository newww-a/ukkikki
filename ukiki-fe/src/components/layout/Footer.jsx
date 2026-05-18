
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 border-gray-300">
      <div className="container mx-auto px-6 text-center">
        {/* 하단 링크 */}
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="/about"
            className="text-gray-500 hover:text-blue-500 transition duration-300"
          >
            프로젝트 소개
          </a>
          <a
            href="/contact"
            className="text-gray-500 hover:text-blue-500 transition duration-300"
          >
            문의하기
          </a>
          <a
            href="/privacy"
            className="text-gray-500 hover:text-blue-500 transition duration-300"
          >
            개인정보 처리방침
          </a>
        </div>

        {/* 저작권 정보 */}
        <p className="text-sm text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} 춤추는 오랑우탄. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
