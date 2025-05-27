# 🌍 Ukiki - 고객 제안 기반 맞춤형 여행 패키지 플랫폼

<p align="center">
  <img src="https://github.com/user-attachments/assets/d7ba2d35-eb39-434f-b2ae-85750be5c248" width="800" alt="Ukiki Main Image"/>
</p>

---

## 📚 목차 (Table of Contents)

- [🧭 프로젝트 소개](#-프로젝트-소개)
- [🧩 문제 정의](#-문제-정의)
- [💡 해결방안](#-해결방안)
- [🔧 기술 구성](#-기술-구성)
  - [📦 아키텍처 요약](#-아키텍처-요약)
  - [🖼️ 와이어프레임](#-와이어프레임)
  - [📊 ERD](#-erd)
  - [🧱 주요 기술 스택](#-주요-기술-스택)
- [👥 팀 구성](#-팀-구성)

---

## 🧭 프로젝트 소개

<img src="https://github.com/user-attachments/assets/515148e7-b2a6-4045-9151-9f02ec4d11d0" width="100%" />

- **기간**: 2025년 1월 13일 ~ 2025년 2월 21일 (총 6주)
- **기획의도**:  
  MZ세대의 자기주도적 소비 및 경험 중심의 여행 수요에 맞춰,  
  맞춤형 여행 패키지를 직접 설계하고 여행사와 협력하는 플랫폼 제공
- **핵심 컨셉**:  
  사용자가 여행 계획에 직접 참여하고 원하는 일정과 장소를 선택할 수 있도록 함

---

## 🧩 문제 정의

- ❌ 기존 패키지 여행의 일정과 장소 제한  
- ❌ 사용자가 원하는 장소를 반영하기 어려움  
- ❌ 일정 조정 불가 및 불만족스러운 경험  

---

## 💡 해결방안

| 기능 | 설명 |
|------|------|
| 🗓️ 맞춤형 여행 일정 설정 | 사용자가 직접 일정을 설정 |
| 🏨 방 찾기 및 예약 | 취향과 조건에 맞는 숙소 선택 |
| 🧑‍💼 여행사 협업 | 사용자 요청 기반 일정 설계 |
| 📢 패키지 투표 및 확정 | 사용자 투표로 패키지 확정 |
| 💳 간편 결제 | 간단한 결제 프로세스 제공 |


### 🔄 유저(여행자) 플로우

![여행자 플로우](https://github.com/user-attachments/assets/e56336db-b5c5-4d0e-bb56-5336a7be3ccc)

#### 👣 사용자 시나리오

1. **여행방 찾기** → 2. **취향 조사** → 3. **여행사 요청** → 4. **패키지 투표** → 5. **확정 및 결제**


---

## 🧑‍💼 여행사 플로우

![여행사 플로우](https://github.com/user-attachments/assets/5475b11b-c0af-4bd0-88ee-d31b453334d1)

### 🧩 여행사 시나리오

1. **제안 수신** → 2. **일정 설계** → 3. **패키지 제안** → 4. **투표 및 확정** → 5. **결제 처리** → 6. **화상 상담**


---

## 🔧 기술 구성

### 📦 아키텍처 요약
![Ukiki Architecture](https://github.com/user-attachments/assets/e41716ba-4068-4494-aaf6-6137b2f2200d)

---

### 🖼️ 와이어프레임
[![와이어프레임](https://github.com/user-attachments/assets/dc3fb195-5816-4d92-88f4-5914b8ce4455)](https://www.figma.com/design/Y6gwYWBepPRNpY430a2Z3N/%EC%9A%B0%EB%81%BC%EB%81%BC-?node-id=84-2)

---

### 📊 ERD
![Ukiki ERD](https://github.com/user-attachments/assets/1be28673-8967-4cb3-b23d-a39f2e289811)



---


### 🧱 주요 기술 스택

### 🖥️ Frontend
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/> <img src="https://img.shields.io/badge/Zustand-8DD6F9?style=for-the-badge&logo=zustand&logoColor=black"/> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>

### 🛠 Backend
<img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/> <img src="https://img.shields.io/badge/OpenVidu-0E76A8?style=for-the-badge&logo=webrtc&logoColor=white"/>

### 💾 Database
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>

### ⚙ DevOps & Infra
<img src="https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white"/> <img src="https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white"/> <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/> <img src="https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white"/>


---


## 👥 팀 구성

<table>
  <tbody>
    <tr align="center">
      <td><img src="https://avatars.githubusercontent.com/u/113484236?v=4" width="100px;" style="border-radius: 50%;" alt=""/><br /></td>
      <td><img src="https://avatars.githubusercontent.com/u/108385400?v=4" width="100px;" style="border-radius: 50%;" alt=""/><br /></td>
      <td><img src="https://avatars.githubusercontent.com/u/105963431?v=4" width="100px;" style="border-radius: 50%;" alt=""/><br /></td>
      <td><img src="https://avatars.githubusercontent.com/u/175383118?v=4" width="100px;" style="border-radius: 50%;" alt=""/><br /></td>
      <td><img src="https://avatars.githubusercontent.com/u/145769307?v=4" width="100px;" style="border-radius: 50%;" alt=""/><br /></td>
      <td><img src="https://avatars.githubusercontent.com/u/105963431?v=4" width="100px;" style="border-radius: 50%;" alt=""/><br /></td>
    </tr>
    <tr align="center">
      <td width="200"><a href="http://github.com/miltonjskim">팀장 : 김준석<br/>INFJ</a></td>
      <td width="200"><a href="http://github.com/wjdrbgus8167">팀원 : 정규현<br/>ISFP</a></td>
      <td width="200"><a href="https://github.com/Kzerojun">팀원 : 김영준<br/>ISTP</a></td>
      <td width="200"><a href="https://github.com/newww-a">팀원 : 신승아<br/>ENFP</a></td>
      <td width="200"><a href="https://github.com/songowen">팀원 : 송창현<br/>ISTP</a></td>
      <td width="200"><a href="https://github.com/juuhyeon">팀원 : 박주현<br/>ENTJ</a></td>
    </tr>
    
  </tbody>
</table>


