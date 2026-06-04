import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Swal 추가
import { OpenVidu } from 'openvidu-browser';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function MeetingPage() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isHost = searchParams.get('isHost') === 'true';

  const [session, setSession] = useState(null);
  const [OV, setOV] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [screenPublisher, setScreenPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [screenSharing, setScreenSharing] = useState(false);

  // (1) 호스트 닉네임
  const [hostNickname, setHostNickname] = useState('');

  // “방송 종료” 혹은 “나가기”를 눌렀을 때만 disconnect
  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  useEffect(() => {
    if (!token) {
      console.error('No token provided. Cannot connect to session.');
      return;
    }

    // 1) OpenVidu 인스턴스 생성
    const newOV = new OpenVidu();
    setOV(newOV);

    // 2) 세션 초기화
    const newSession = newOV.initSession();

    // 스트림 생성 시 subscribe
    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);

      // (1-1) 일반 사용자: 호스트 스트림 닉네임 추론
      if (!isHost && !hostNickname) {
        const maybeHostName = subscriber.stream.connection.data;
        setHostNickname(maybeHostName);
      }
    });

    // 스트림 파괴 시 unsubscribe
    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    // 세션 연결
    newSession
      .connect(token)
      .then(() => {
        const pubOptions = isHost
          ? {
              videoSource: undefined, // 카메라
              audioSource: undefined, // 마이크
              publishVideo: true,
              publishAudio: true,
              resolution: '640x480',
              frameRate: 30,
            }
          : {
              videoSource: false,
              audioSource: true,
              publishVideo: false,
              publishAudio: true,
            };

        const localPublisher = newOV.initPublisher(undefined, pubOptions, (error) => {
          if (error) {
            console.error('Error initializing publisher:', error);
            return;
          }
          newSession.publish(localPublisher);
          setPublisher(localPublisher);
          setSession(newSession);

          // (1-2) 호스트라면 닉네임 세팅
          if (isHost) {
            const myName = localPublisher.stream.connection.data;
            setHostNickname(myName);
          }
        });
      })
      .catch((err) => {
        console.error('Error connecting to the session:', err);
      });

    // **onbeforeunload**: 페이지 닫힐 때 경고 (호스트/사용자 구분 없이)
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 언마운트(페이지 이탈) 시 disconnect할지 여부 체크
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (newSession && shouldDisconnect) {
        newSession.disconnect();
      }
    };
  }, [token, isHost, hostNickname, shouldDisconnect]);

  // “나가기” (호스트일 땐 방송 종료, 일반 사용자에겐 단순 나가기)
  const leaveSession = async () => {
    if (!session) return;

    const question = isHost
      ? '방송을 종료하시겠습니까?'
      : '회의에서 나가시겠습니까?';
    const confirmText = isHost ? '네, 종료합니다' : '네, 나가기';
    const result = await Swal.fire({
      title: question,
      text: '확인하면 세션 연결이 해제됩니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: '취소',
    });
    if (result.isConfirmed) {
      setShouldDisconnect(true);
      // 예시: 메인/목록 페이지로 이동 (마음대로 수정 가능)
      navigate('/user-vote/:travelPlanId');
    }
  };

  // 화면 공유 토글
  const toggleScreenShare = () => {
    if (!session || !OV) {
      console.error('Session or OV is not initialized.');
      return;
    }

    if (screenSharing) {
      // 화면 공유 중지
      if (screenPublisher) {
        session.unpublish(screenPublisher);
        if (isHost && publisher) {
          session.publish(publisher);
        }
        setScreenSharing(false);
        setScreenPublisher(null);
      }
    } else {
      // 화면 공유 시작
      if (isHost && publisher) {
        session.unpublish(publisher);
      }

      const newScreenPub = OV.initPublisher(
        undefined,
        {
          videoSource: 'screen',
          publishAudio: false,
          publishVideo: true,
          resolution: '1280x720',
          frameRate: 30,
        },
        (error) => {
          if (error) {
            console.error('Error during screen sharing initialization:', error);
            return;
          }

          newScreenPub.once('accessAllowed', () => {
            session.publish(newScreenPub);
            setScreenPublisher(newScreenPub);
            setScreenSharing(true);
            console.log('Screen sharing started successfully.');

            newScreenPub.stream
              .getMediaStream()
              .getVideoTracks()[0]
              .addEventListener('ended', () => {
                console.log('Screen sharing ended by user.');
                toggleScreenShare();
              });
          });

          newScreenPub.once('accessDenied', () => {
            console.warn('Screen sharing access denied by the user.');
          });
        }
      );
    }
  };

  // (3) 현재 참가자 수: 호스트(1) + 구독자 수
  const participantCount = subscribers.length + 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-start p-4">
        {/* 제목: 호스트 닉네임 or proposalId */}
        <h2 className="text-2xl font-bold mb-2">
          {hostNickname
            ? `[${hostNickname}]의 홍보 라이브 방송`
            : `Meeting Page (proposalId: ${proposalId})`}
        </h2>

        {/* 호스트: 현재 인원 수 표시 */}
        {isHost && (
          <p className="text-md text-gray-600 mb-2">
            참여 인원 수: {participantCount}명
          </p>
        )}

        <p className="mb-4">{isHost ? '호스트 모드' : '참가자 모드'}</p>

        {/* 호스트 전용: 화면 공유, 방송 종료 버튼 */}
        {isHost ? (
          <div className="flex gap-3 mb-4">
            <button
              onClick={toggleScreenShare}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {screenSharing ? '화면 공유 중지' : '화면 공유 시작'}
            </button>
            <button
              onClick={leaveSession}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              방송 종료
            </button>
          </div>
        ) : (
          // 일반 사용자도 나가기 버튼이 필요하다면:
          <button
            onClick={leaveSession}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            나가기
          </button>
        )}

        {/* 호스트 카메라 (화면 공유 중 아닐 때만) */}
        {isHost && publisher && !screenSharing && (
          <div className="mb-4">
            <video
              autoPlay
              className="border border-gray-300 w-full"
              ref={(ref) => {
                if (ref && publisher) {
                  publisher.addVideoElement(ref);
                }
              }}
            />
          </div>
        )}

        {/* 화면 공유 영역 */}
        {screenSharing && screenPublisher && (
          <div className="w-full flex flex-col items-center mb-4">
            <h3 className="text-lg font-semibold mb-2">여행사 화면 공유</h3>
            <video
              autoPlay
              className="border border-gray-300 w-full max-w-screen-xl"
              ref={(ref) => {
                if (ref && screenPublisher) {
                  screenPublisher.addVideoElement(ref);
                }
              }}
            />
          </div>
        )}

        {/* Other Streams 영역: 구독된 참가자 스트림들 */}
        <div className="w-full flex flex-wrap justify-center gap-4">
          {subscribers.map((sub, i) => (
            <div key={i} className="flex flex-col items-center">
              <video
                autoPlay
                className="border border-gray-300 w-full max-w-sm"
                ref={(ref) => {
                  if (ref) sub.addVideoElement(ref);
                }}
              />
              <p className="mt-2 text-sm text-gray-700">
                {sub.stream.connection.data}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MeetingPage;
