import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const useChatStore = defineStore('chat', () => {
  // State
  const socket = ref(null);
  const stompClient = ref(null);
  const isConnected = ref(false);
  const isConnecting = ref(false);

  const messages = ref([]);
  const userCount = ref(0);
  const challengeId = ref(null);
  const currentUser = ref({
    userId: null,
    userName: null,
  });

  const error = ref(null);
  const isLoading = ref(false);

  // Getters
  const sortedMessages = computed(() => {
    return messages.value.sort(
      (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
    );
  });

  const isMyMessage = computed(() => (message) => {
    return message.userId === currentUser.value.userId;
  });

  // Actions
  const setCurrentUser = (userId, userName = null) => {
    currentUser.value = {
      userId,
      userName: userName || `사용자${userId}`,
    };
  };

  const connectToChat = async (chatChallengeId, userId, userName = null) => {
    if (isConnected.value || isConnecting.value) {
      console.log('이미 연결되어 있거나 연결 중입니다.');
      return;
    }

    try {
      isConnecting.value = true;
      challengeId.value = chatChallengeId;
      setCurrentUser(userId, userName);

      console.log(
        `채팅방 연결 시도: challengeId=${chatChallengeId}, userId=${userId}`
      );

      // SockJS + STOMP 연결
      socket.value = new SockJS(
        // `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws/chat`
        'http://localhost:8080/ws/chat'
      );
      stompClient.value = Stomp.over(socket.value);

      // 디버그 비활성화 (프로덕션용)
      stompClient.value.debug = () => {};

      await new Promise((resolve, reject) => {
        stompClient.value.connect(
          {},
          // 연결 성공
          (frame) => {
            console.log('✅ WebSocket 연결 성공:', frame);
            isConnected.value = true;
            isConnecting.value = false;

            // 메시지 구독
            subscribeToMessages();

            // 사용자 수 구독
            subscribeToUserCount();

            // 입장 메시지 전송
            joinChatRoom();

            resolve();
          },
          // 연결 실패
          (error) => {
            console.error('❌ WebSocket 연결 실패:', error);
            isConnected.value = false;
            isConnecting.value = false;
            setError('채팅방 연결에 실패했습니다.');
            reject(error);
          }
        );
      });
    } catch (err) {
      console.error('채팅방 연결 중 오류:', err);
      isConnecting.value = false;
      setError('채팅방 연결 중 오류가 발생했습니다.');
      throw err;
    }
  };

  const subscribeToMessages = () => {
    if (!stompClient.value || !challengeId.value) return;

    stompClient.value.subscribe(
      `/topic/chat/${challengeId.value}`,
      (message) => {
        try {
          const data = JSON.parse(message.body);

          // 접속자 수 업데이트 메시지인지 확인
          if (data.type === 'PARTICIPANT_COUNT') {
            userCount.value = data.count;
            return;
          }

          // 일반 채팅 메시지 처리
          console.log('💬 새 메시지 수신:', data);
          addMessage(data);
        } catch (err) {
          console.error('메시지 파싱 오류:', err);
        }
      }
    );
  };

  const subscribeToUserCount = () => {
    if (!stompClient.value || !challengeId.value) return;

    stompClient.value.subscribe(
      `/topic/userCount/${challengeId.value}`,
      (message) => {
        try {
          const count = parseInt(message.body);
          console.log('👥 접속자 수 업데이트:', count);
          userCount.value = count;
        } catch (err) {
          console.error('접속자 수 파싱 오류:', err);
        }
      }
    );
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
      console.warn('메시지 전송 불가: 연결되지 않았거나 내용이 비어있음');
      return false;
    }

    try {
      const message = {
        challengeId: challengeId.value,
        userId: currentUser.value.userId,
        userName: currentUser.value.userName,
        message: content.trim(),
        messageType: 'MESSAGE',
      };

      console.log('📤 메시지 전송:', message);
      stompClient.value.send(
        `/app/chat/${challengeId.value}/send`,
        {},
        JSON.stringify(message)
      );
      return true;
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      setError('메시지 전송에 실패했습니다.');
      return false;
    }
  };

  const addMessage = (message) => {
    // 중복 메시지 방지
    if (
      message.messageId &&
      messages.value.some((m) => m.messageId === message.messageId)
    ) {
      return;
    }

    // 시간 형식 변환
    const formattedMessage = {
      ...message,
      id: message.messageId || Date.now(),
      username: message.userName || `사용자${message.userId}`,
      content: message.message,
      time: formatTime(message.sentAt || new Date().toISOString()),
    };

    messages.value.push(formattedMessage);
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (err) {
      console.error('시간 형식 변환 오류:', err);
      return new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
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
      messages.value = [];
      userCount.value = 0;
      challengeId.value = null;
      currentUser.value = { userId: null, userName: null };
      clearError();
    }
  };

  const setError = (message) => {
    error.value = message;
    console.error('Chat Store Error:', message);
  };

  const clearError = () => {
    error.value = null;
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
    currentUser,
    error,
    isLoading,

    // Getters
    sortedMessages,
    isMyMessage,

    // Actions
    setCurrentUser,
    connectToChat,
    sendMessage,
    disconnect,
    setError,
    clearError,
    cleanup,
  };
});
