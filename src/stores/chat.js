import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { chatApi } from '@/services/chatApi';

// WebSocket URL 설정 통일
const getWebSocketUrl = () => {
  // 환경별 WebSocket URL 사용
  const wsUrl = import.meta.env.VITE_WS_URL;
  if (wsUrl) {
    return `${wsUrl}/ws/chat`;
  }
  
  // fallback: API URL에서 WebSocket URL 생성
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const protocol = apiUrl.startsWith('https:') ? 'wss:' : 'ws:';
  const cleanUrl = apiUrl.replace(/^https?:\/\//, '').replace('/api', '');
  return `${protocol}//${cleanUrl}/ws/chat`;
};

export const useChatStore = defineStore('chat', () => {
  // State
  const socket = ref(null);
  const stompClient = ref(null);
  const isConnected = ref(false);
  const isConnecting = ref(false);

  const messages = ref([]);
  const userCount = ref(0);
  const challengeId = ref(null);
  const challengeInfo = ref({}); // 챌린지 정보 저장
  const currentUser = ref({
    userId: null,
    userName: null,
  });

  const error = ref(null);
  const isLoading = ref(false); // 이력 로드 상태

  // Getters
  const sortedMessages = computed(() => {
    return messages.value.sort(
      (a, b) =>
        new Date(getTimestampFromMessage(a)) -
        new Date(getTimestampFromMessage(b))
    );
  });

  const isMyMessage = computed(() => (message) => {
    return message.userId === currentUser.value.userId;
  });

  // 메시지에서 타임스탬프 추출하는 헬퍼 함수
  const getTimestampFromMessage = (message) => {
    const timestamp = message.sentAt || message.time;

    if (Array.isArray(timestamp)) {
      // 백엔드 배열 형식: [year, month, day, hour, minute, second]
      return new Date(
        timestamp[0], // year
        timestamp[1] - 1, // month (0-based)
        timestamp[2], // day
        timestamp[3] || 0, // hour
        timestamp[4] || 0, // minute
        timestamp[5] || 0 // second
      );
    } else if (timestamp) {
      return new Date(timestamp);
    } else {
      return new Date();
    }
  };

  // Actions
  const setCurrentUser = (userId, userName = null) => {
    currentUser.value = {
      userId,
      userName: userName || `사용자${userId}`,
    };
  };

  /**
   * 현재 로그인한 사용자의 챌린지 상태 확인 (JWT 기반)
   */
  const checkUserChallengeStatus = async () => {
    try {
      console.log('🔍 사용자 챌린지 상태 확인 (JWT 기반)');
      clearError(); // 이전 에러 클리어

      const status = await chatApi.getUserChallengeStatus();
      console.log('📊 챌린지 상태:', status);

      // 현재 사용자 정보 업데이트
      if (status.userId) {
        setCurrentUser(
          status.userId,
          status.userName || `사용자${status.userId}`
        );
      }

      return status;
    } catch (error) {
      console.error('❌ 챌린지 상태 확인 실패:', error);
      setError(error.message);
      throw error;
    }
  };

  /**
   * 채팅방 이력 로드
   */
  const loadChatHistory = async (chatChallengeId, limit = 50) => {
    try {
      isLoading.value = true;
      clearError(); // 이전 에러 클리어

      console.log(`📚 채팅 이력 로드 시작: challengeId=${chatChallengeId}`);

      const history = await chatApi.getChatHistory(chatChallengeId, limit);

      // 기존 메시지 초기화 후 이력 로드
      messages.value = [];

      // 이력 메시지들을 순서대로 추가
      history.forEach((message) => {
        addMessage(message, false); // false = 중복 체크 안함 (이력 메시지)
      });

      console.log(`✅ 채팅 이력 ${history.length}개 로드 완료`);
      return history.length;
    } catch (error) {
      console.error('❌ 채팅 이력 로드 실패:', error);
      // 이력 로드 실패는 치명적이지 않으므로 에러를 store에 설정하지 않음
      console.warn('⚠️ 이력 로드 실패했지만 채팅은 계속 진행합니다.');
      return 0;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 채팅방 연결 (메인 메서드) - 자동으로 현재 사용자 정보 가져옴
   */
  const connectToChat = async (chatChallengeId) => {
    if (isConnected.value || isConnecting.value) {
      console.log('🔄 이미 연결되어 있거나 연결 중입니다.');
      return;
    }

    try {
      isConnecting.value = true;
      clearError(); // 연결 시도 전 에러 클리어
      challengeId.value = chatChallengeId;

      // 1. 채팅 이력 로드 (현재 사용자 정보는 이미 확인됨)
      const historyCount = await loadChatHistory(chatChallengeId);

      // 2. 채팅방 정보 로드
      try {
        challengeInfo.value = await chatApi.getChatRoomInfo(chatChallengeId);
        userCount.value = challengeInfo.value.participantCount || 0;
        console.log('📋 채팅방 정보 로드 완료:', challengeInfo.value);
      } catch (error) {
        console.warn(
          '⚠️ 채팅방 정보 로드 실패 (무시하고 계속):',
          error.message
        );
      }

      // 3. WebSocket 연결
      await connectWebSocket();

      // 4. 입장 메시지 처리 (이력이 없거나 최근 입장 메시지가 없을 때만)
      if (historyCount === 0 || !hasRecentJoinMessage()) {
        joinChatRoom();
      } else {
        console.log('🔇 입장 메시지 생략 (이전 이력 존재)');
      }

      console.log('✅ 채팅방 연결 완료');
    } catch (err) {
      console.error('❌ 채팅방 연결 중 오류:', err);
      isConnecting.value = false;
      setError(err.message || '채팅방 연결 중 오류가 발생했습니다.');
      throw err;
    }
  };

  /**
   * WebSocket 연결 (내부 메서드)
   */
  const connectWebSocket = async () => {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = getWebSocketUrl();

        socket.value = new SockJS(wsUrl);
        stompClient.value = Stomp.over(socket.value);

        // 디버그 비활성화 (프로덕션용)
        stompClient.value.debug = () => {};

        // 연결 타임아웃 설정
        const connectionTimeout = setTimeout(() => {
          if (!isConnected.value) {
            console.error('❌ WebSocket 연결 타임아웃');
            isConnected.value = false;
            isConnecting.value = false;
            setError('채팅방 연결 시간이 초과되었습니다.');
            reject(new Error('Connection timeout'));
          }
        }, 10000);

        stompClient.value.connect(
          {},
          // 연결 성공
          (frame) => {
            clearTimeout(connectionTimeout);
            console.log('🔌 WebSocket 연결 성공:', frame);
            isConnected.value = true;
            isConnecting.value = false;
            clearError(); // 연결 성공 시 에러 클리어

            // 메시지 구독
            subscribeToMessages();
            // 사용자 수 구독
            subscribeToUserCount();

            resolve();
          },
          // 연결 실패
          (error) => {
            clearTimeout(connectionTimeout);
            console.error('❌ WebSocket 연결 실패:', error);
            isConnected.value = false;
            isConnecting.value = false;

            let errorMessage = '채팅방 연결에 실패했습니다.';

            if (error.includes && error.includes('timeout')) {
              const errorStr = error.toString();
              if (errorStr.includes('timeout')) {
                errorMessage = '연결 시간이 초과되었습니다.';
              } else if (errorStr.includes('refused')) {
                errorMessage = '서버에 연결할 수 없습니다.';
              }
            }

            setError(errorMessage);
            reject(new Error(errorMessage));
          }
        );
      } catch (error) {
        console.error('❌ WebSocket 초기화 오류:', error);
        isConnected.value = false;
        isConnecting.value = false;
        setError('채팅방 연결 초기화에 실패했습니다.');
        reject(error);
      }
    });
  };

  /**
   * 최근에 입장 메시지가 있는지 확인 (중복 입장 메시지 방지)
   */
  const hasRecentJoinMessage = () => {
    const recentMessages = messages.value.slice(-5);
    return recentMessages.some(
      (msg) =>
        msg.messageType === 'SYSTEM' &&
        msg.userId === currentUser.value.userId &&
        msg.message &&
        msg.message.includes('입장했습니다')
    );
  };

  const subscribeToMessages = () => {
    if (!stompClient.value || !challengeId.value) {
      console.warn(
        '⚠️ 메시지 구독 실패: STOMP 클라이언트 또는 challengeId가 없음'
      );
      return;
    }

    const topic = `/topic/chat/${challengeId.value}`;
    console.log(`📡 메시지 구독 시작: ${topic}`);

    try {
      stompClient.value.subscribe(
        topic,
        (message) => {
          try {
            const data = JSON.parse(message.body);

            // 접속자 수 업데이트 메시지인지 확인
            if (data.type === 'PARTICIPANT_COUNT') {
              userCount.value = data.count;
              console.log(`👥 접속자 수 업데이트: ${data.count}명`);
              return;
            }

            // 일반 채팅 메시지 처리
            console.log('💬 새 메시지 수신:', data);
            addMessage(data, true); // true = 중복 체크 함 (실시간 메시지)
          } catch (err) {
            console.error(
              '❌ 메시지 파싱 오류:',
              err,
              '원본 메시지:',
              message.body
            );
          }
        },
        (error) => {
          console.error('❌ 메시지 구독 오류:', error);
        }
      );
    } catch (error) {
      console.error('❌ 메시지 구독 설정 실패:', error);
    }
  };

  const subscribeToUserCount = () => {
    if (!stompClient.value || !challengeId.value) return;
  };

  const joinChatRoom = () => {
    if (!stompClient.value || !challengeId.value || !currentUser.value.userId)
      return;

    const joinMessage = {
      challengeId: challengeId.value,
      userId: currentUser.value.userId,
      userName: currentUser.value.userName,
      messageType: 'JOIN',
    };

    console.log('🚪 입장 메시지 전송:', joinMessage);
    stompClient.value.send(
      `/app/chat/${challengeId.value}/join`,
      {},
      JSON.stringify(joinMessage)
    );
  };

  const sendMessage = (content) => {
    if (!stompClient.value || !isConnected.value || !content.trim()) {
      console.warn('⚠️ 메시지 전송 불가: 연결되지 않았거나 내용이 비어있음');
      return false;
    }

    try {
      // 한국 시간(KST) 생성 - UTC + 9시간
      const now = new Date();
      const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

      const message = {
        challengeId: challengeId.value,
        userId: currentUser.value.userId,
        userName: currentUser.value.userName,
        message: content.trim(),
        messageType: 'MESSAGE',
        sentAt: kstTime.toISOString(),
      };

      const destination = `/app/chat/${challengeId.value}/send`;
      console.log('📤 메시지 전송 시도:', { destination, message });

      stompClient.value.send(destination, {}, JSON.stringify(message));

      console.log('✅ 메시지 전송 완료');
      return true;
    } catch (err) {
      console.error('❌ 메시지 전송 오류:', err);
      setError('메시지 전송에 실패했습니다.');
      return false;
    }
  };

  /**
   * 메시지 추가 (중복 체크 옵션)
   */
  const addMessage = (message, checkDuplicate = true) => {
    // 중복 메시지 방지 (실시간 메시지만)
    if (
      checkDuplicate &&
      message.messageId &&
      messages.value.some((m) => m.messageId === message.messageId)
    ) {
      console.log('🔄 중복 메시지 무시:', message.messageId);
      return;
    }

    // 메시지 형식 통일 - sentAt 원본 데이터 보존
    const formattedMessage = {
      ...message,
      id: message.messageId || Date.now() + Math.random(),
      username: message.userName || `사용자${message.userId}`,
      content: message.message || message.content,
      time: formatTimeForDisplay(message.sentAt || new Date().toISOString()),
      sentAt: message.sentAt, // 원본 타임스탬프 보존 (날짜 구분용)
    };

    messages.value.push(formattedMessage);
  };

  /**
   * 빠른 연결 상태 체크 (API 호출 없이)
   */
  const isAlreadyConnectedTo = (targetChallengeId) => {
    const connected =
      isConnected.value &&
      challengeId.value === targetChallengeId &&
      currentUser.value?.userId &&
      stompClient.value?.connected;

    console.log('⚡ 빠른 연결 체크:', {
      isConnected: isConnected.value,
      challengeMatch: challengeId.value === targetChallengeId,
      hasUser: !!currentUser.value?.userId,
      stompConnected: stompClient.value?.connected,
      result: connected,
    });

    return connected;
  };

  // 화면 표시용 시간 포맷 (HH:MM)
  const formatTimeForDisplay = (timestamp) => {
    try {
      let date;

      // 백엔드에서 배열 형태로 오는 경우 처리
      if (Array.isArray(timestamp)) {
        date = new Date(
          timestamp[0], // year
          timestamp[1] - 1, // month (0-based)
          timestamp[2], // day
          timestamp[3] || 0, // hour
          timestamp[4] || 0, // minute
          timestamp[5] || 0 // second
        );
      } else {
        date = new Date(timestamp);
      }

      // 유효하지 않은 날짜 체크
      if (isNaN(date.getTime())) {
        console.error('❌ 유효하지 않은 날짜:', timestamp);
        return getCurrentTime();
      }

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (err) {
      console.error('❌ 시간 형식 변환 오류:', err, 'timestamp:', timestamp);
      return getCurrentTime();
    }
  };

  // 현재 시간 반환 (폴백용)
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const disconnect = () => {
    try {
      if (stompClient.value && isConnected.value) {
        console.log('🔌 WebSocket 연결 해제');
        stompClient.value.disconnect();
      }
    } catch (err) {
      console.error('연결 해제 중 오류:', err);
    } finally {
      // 상태 초기화
      isConnected.value = false;
      isConnecting.value = false;
      stompClient.value = null;
      socket.value = null;

      // messages는 초기화하지 않음 (이력 유지)
      userCount.value = 0;
      challengeId.value = null;
      challengeInfo.value = {};
      currentUser.value = { userId: null, userName: null };
      clearError();
    }
  };

  const setError = (message) => {
    error.value = message;
    console.error('💥 Chat Store Error:', message);
  };

  const clearError = () => {
    error.value = null;
  };

  // 완전 초기화 (다른 채팅방으로 이동 시)
  const reset = () => {
    disconnect();
    messages.value = [];
    userCount.value = 0;
    challengeId.value = null;
    challengeInfo.value = {};
    currentUser.value = { userId: null, userName: null };
    clearError();
    console.log('🧹 Chat Store 완전 초기화 완료');
  };

  // 사용자 변경 시 호출할 메서드
  const resetForNewUser = () => {
    console.log('👤 사용자 변경 감지 - Chat Store 초기화');
    reset();
  };

  // 컴포넌트 언마운트 시 자동 정리
  const cleanup = () => {
    disconnect();
  };

  return {
    // State
    isConnected,
    isConnecting,
    messages,
    userCount,
    challengeId,
    challengeInfo,
    currentUser,
    error,
    isLoading,

    // Getters
    sortedMessages,
    isMyMessage,

    // Actions
    setCurrentUser,
    checkUserChallengeStatus,
    loadChatHistory,
    connectToChat,
    sendMessage,
    isAlreadyConnectedTo,
    disconnect,
    reset,
    resetForNewUser,
    setError,
    clearError,
    cleanup,

    // Helper functions
    getTimestampFromMessage,
    formatTimeForDisplay,
  };
});
