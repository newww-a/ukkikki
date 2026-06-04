import styled from "styled-components";



export const StylePlaceList = styled.li`
  display: flex;
  align-items: center;
  flex-direction: row; /* 수평 정렬 */
  margin-bottom: 10px;
  width: 100%; /* 부모 컨테이너에 맞게 100% 크기 */
  max-width: 360px; /* 최대 크기 설정 */
  height: 100px;
  border: 1px solid #FFFFFF; /* 테두리 추가 */
  border-radius: 20px;
  background-color: #FFFFFF;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);

  button {
  justify-content: flex-end;
  border: 2px solid #C9C9C9; 
  border-radius: 0.5rem;
  color: black;
  width: 70px; 
  height: 40px;
  font-size: 10px; 
  display: flex;
  align-items: center;
  justify-content: center;
   background-color: transparent; 
  }
`;

// Place 내용 (텍스트) 영역
export const StylePlaceContent = styled.div`
  p {
    margin: 0;
    font-size: 14px;
  }
`;

export const StylePlace = styled.div`
  width: 100%;  
  display: flex;
  align-items: center;
  flex-direction: row; /* 수평 정렬 */
  justify-content: space-between; /* flex justify-between */
  margin-right: 8px; /* 오른쪽 수평 마진 */
  

`;