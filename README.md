# 고객 제안기반 맞춤형 여행패키지 제안 플랫폼

![ukiki_overview](https://github.com/user-attachments/assets/d7ba2d35-eb39-434f-b2ae-85750be5c248)

---

## 📚 목차 (Table of Contents)

- [🧭 프로젝트 소개](#-프로젝트-소개)
- [🔄 유저(여행자) 플로우](#-유저여행자-플로우)
- [🧑‍💼 여행사 플로우](#-여행사-플로우)
- [🎯 주요 기능 요약](#-주요-기능-요약)
- [🎯 주요 타겟층](#-주요-타겟층)
- [📘 ERD](#-erd)
- [🏗️ 아키텍처](#-아키텍처)
- [🖼️ 와이어프레임](#-와이어프레임)
- [🛠 사용된 기술 스택](#-사용된-기술-스택)

---

## 🧭 프로젝트 소개

<img src="https://github.com/user-attachments/assets/515148e7-b2a6-4045-9151-9f02ec4d11d0" width="100%" />

### 🗓 프로젝트 진행기간
- **2025년 1월 13일 ~ 2월 21일 (총 6주)**

### 💡 기획의도

- 최근 MZ세대는  
  - **자기주도적 소비**  
  - **여행·경험 중심의 투자**  
  에 대한 관심이 높아지고 있으며,  
  단순히 물건을 소비하는 것을 넘어  
  **자신의 취향과 가치를 반영한 경험을 중시**하고 있습니다.

- 하지만 기존 여행 패키지는  
  - 여행사가 미리 구성한 일정과 코스를 따라야 하고,  
  - 사용자는 **원치 않는 장소 방문**, **일정 조정 불가** 등  
    불편함을 겪는 경우가 많습니다.

#### ✨ 우끼끼(우리끼리 만드는 패키(끼)지여행)는 2030 세대를 위한 여행 계획 + 방 찾기 플랫폼입니다.

- **우끼끼는 이러한 문제를 해결하기 위해 만들어졌습니다.**

  - 여행자가 **기획 단계부터 적극 참여**하고  
  - **자신의 취향과 일정에 맞춘 패키지를 직접 선택·조율**할 수 있도록 합니다.

- 이를 통해  
  - **여행자는 더 만족도 높은 여행 경험**을 할 수 있고  
  - **여행사는 사용자 수요 기반의 안정적인 패키지 운영**이 가능합니다.

---

## 🔄 유저(여행자) 플로우

![여행자 플로우](https://github.com/user-attachments/assets/e56336db-b5c5-4d0e-bb56-5336a7be3ccc)

### 👣 사용자 시나리오

1. **여행방 찾기**  
2. **여행 취향 조사**  
3. **여행사에 패키지 요청**  
4. **패키지 투표**  
5. **패키지 확정 및 결제**

---

## 🧑‍💼 여행사 플로우

![여행사 플로우](https://github.com/user-attachments/assets/5475b11b-c0af-4bd0-88ee-d31b453334d1)

### 🧩 여행사 시나리오

1. **여행자 제안 수신**  
2. **제안 수락 및 일정 설계**  
3. **패키지 제안 전달**  
4. **유저 투표 및 확정**  
5. **결제 처리**  
6. **OpenVidu 화상통화**

---

## 🎯 주요 기능 요약

- 🗓️ **여행 일정 설정**
- 🏨 **맞춤형 방 검색**
- 🎒 **패키지 여행 제공**
- 🤝 **공동 여행 설계**
- 💳 **간편 결제 시스템**

---

## 🎯 주요 타겟층

- **여행과 투자에 관심이 많은 2030 세대**
- **합리적이고 자유로운 여행을 원하는 사용자**
- **친구, 연인, 가족 등과 함께 기획하고 싶은 유저**

---

## 📘 ERD

![ERD](https://github.com/user-attachments/assets/1be28673-8967-4cb3-b23d-a39f2e289811)

---

## 🏗️ 아키텍처

![아키텍처](https://github.com/user-attachments/assets/e41716ba-4068-4494-aaf6-6137b2f2200d)

---

## 🖼️ 와이어프레임

[![와이어프레임](https://github.com/user-attachments/assets/dc3fb195-5816-4d92-88f4-5914b8ce4455)](https://www.figma.com/design/Y6gwYWBepPRNpY430a2Z3N/%EC%9A%B0%EB%81%BC%EB%81%BC-?node-id=84-2)

---

## 🛠 사용된 기술 스택

### 🖥️ Frontend
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zustand](https://img.shields.io/badge/Zustand-8DD6F9?style=flat&logo=zustand&logoColor=black)](https://github.com/pmndrs/zustand)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

### 🛠 Backend
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![OpenVidu](https://img.shields.io/badge/OpenVidu-0E76A8?style=flat&logo=webrtc&logoColor=white)](https://openvidu.io/)

### 💾 Database
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)

### ⚙ DevOps & Infra
[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![GitLab](https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=gitlab&logoColor=white)](https://gitlab.com/)
[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white)](https://www.jenkins.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Mattermost](https://img.shields.io/badge/Mattermost-0058CC?style=flat&logo=mattermost&logoColor=white)](https://mattermost.com/)



