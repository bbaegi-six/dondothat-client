<template>
  <div class="flex flex-col h-screen bg-default max-w-[390px] mx-auto">
    <!-- 공통 헤더 컴포넌트 사용 -->
    <Header
      :title="challengeName"
      :show-back="false"
      :show-logo="false"
      :show-points="false"
      :show-add-button="false"
      :show-user-count="true"
      :user-count="chatStore.userCount"
    />

    <!-- Body Content with proper top margin for fixed header -->
    <div class="flex flex-col flex-1 mt-[60px]">
      <!-- 🚀 채팅 메인 화면 (우선순위 1 - 가장 먼저 체크) -->
      <div
        v-if="shouldShowChatUI"
        class="flex-1 px-[31px] py-4 overflow-y-auto space-y-2"
        ref="chatContainer"
      >
        <!-- 메시지 목록 with 날짜 구분 -->
        <template
          v-for="(message, index) in chatStore.sortedMessages"
          :key="message.messageId || message.id || Math.random()"
        >
          <ChatMessage
            :username="
              message.userName || message.username || '사용자' + message.userId
            "
            :content="message.message || message.content"
            :time="message.time"
            :sentAt="message.sentAt"
            :messageType="message.messageType || 'MESSAGE'"
            :userId="message.userId"
            :currentUserId="chatStore.currentUser?.userId"
            :showDateSeparator="shouldShowDateSeparator(message, index)"
          />
        </template>

        <!-- 메시지가 없을 때 -->
        <div
          v-if="
            chatStore.messages.length === 0 &&
            chatStore.isConnected &&
            !chatStore.isLoading
          "
          class="flex justify-center py-8"
        >
          <div class="text-center">
            <i class="fas fa-comments text-4xl text-[#414141] mb-4"></i>
            <p class="text-[#C9C9C9] text-sm">첫 메시지를 보내보세요!</p>
          </div>
        </div>
      </div>

      <!-- 🚀 로딩 상태들 (우선순위 2 - 채팅 UI가 없을 때만) -->
      <!-- 챌린지 상태 확인 중 -->
      <div
        v-else-if="isCheckingStatus"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-white text-center">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>챌린지 상태 확인 중...</p>
          <p class="text-xs text-gray-400 mt-2">
            현재 로그인한 사용자의 챌린지 상태를 확인하고 있습니다.
          </p>
        </div>
      </div>

      <!-- Loading Indicator (이력 로드 + 연결) -->
      <div
        v-else-if="chatStore.isConnecting || chatStore.isLoading"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-white text-center">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p v-if="chatStore.isLoading">이전 채팅 내용 불러오는 중...</p>
          <p v-else>채팅방에 연결 중...</p>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-else-if="chatStore.error"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-center px-6">
          <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
          <p class="text-white mb-4">{{ chatStore.error }}</p>
          <div class="space-y-2">
            <button
              @click="reconnect"
              class="block w-full px-4 py-2 bg-[#FF5555] text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              다시 연결
            </button>
            <button
              @click="goBack"
              class="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div
        v-else-if="
          !chatStore.isConnected &&
          !chatStore.isConnecting &&
          !chatStore.error &&
          !chatStore.isLoading
        "
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-center text-gray-400">
          <i class="fas fa-wifi-slash text-xl mb-2"></i>
          <p>연결이 끊어졌습니다</p>
          <button
            @click="reconnect"
            class="mt-2 px-4 py-2 bg-[#FF5555] text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            다시 연결
          </button>
        </div>
      </div>

      <!-- Input Area -->
      <div v-if="shouldShowInputArea" class="px-6 pb-4">
        <div class="flex gap-2 items-center">
          <div class="flex-1 relative">
            <input
              v-model="newMessage"
              @keypress.enter="sendMessage"
              :disabled="!chatStore.isConnected"
              type="text"
              placeholder="채팅을 입력하세요"
              class="w-full h-12 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || !chatStore.isConnected"
            class="w-12 h-12 text-white rounded-xl flex items-center justify-center transition-colors duration-200"
            :class="
              newMessage.trim() && chatStore.isConnected
                ? 'bg-[#FF5555] hover:bg-red-600'
                : 'bg-gray-400 cursor-not-allowed'
            "
          >
            <i class="fas fa-arrow-up text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Bottom Navigation Space -->
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import ChatMessage from '@/components/chat/ChatMessage.vue';
import Header from '@/components/layout/Header.vue';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const authStore = useAuthStore();

// Reactive data
const newMessage = ref('');
const chatContainer = ref(null);
const challengeName = ref('챌린지 채팅방');
const isCheckingStatus = ref(false);
const hasHistoryMessages = ref(false);
const challengeId = ref(null);
const isInitialized = ref(false);

// 🚀 핵심: 계산된 속성으로 UI 상태 결정
const shouldShowChatUI = computed(() => {
  // 기존 연결이 있거나, 연결되어 있거나, 메시지가 있으면 채팅 UI 표시
  return (
    chatStore.isConnected ||
    chatStore.messages.length > 0 ||
    (isInitialized.value && !isCheckingStatus.value && !chatStore.error)
  );
});

const shouldShowInputArea = computed(() => {
  return (
    shouldShowChatUI.value && chatStore.isConnected && !chatStore.isLoading
  );
});

// 날짜 구분선 표시 여부 결정
const shouldShowDateSeparator = (message, index) => {
  // 시스템 메시지는 날짜 구분선 표시하지 않음
  if (message.messageType === 'SYSTEM' || message.messageType === 'JOIN') {
    return false;
  }

  // 첫 번째 메시지는 항상 날짜 표시
  if (index === 0) {
    return true;
  }

  // 현재 메시지의 날짜
  const currentDate = getDateFromMessage(message);

  // 이전 메시지들을 역순으로 확인하면서 첫 번째 일반 메시지와 비교
  for (let i = index - 1; i >= 0; i--) {
    const prevMsg = chatStore.sortedMessages[i];

    // 시스템 메시지가 아닌 첫 번째 메시지와 비교
    if (prevMsg.messageType !== 'SYSTEM' && prevMsg.messageType !== 'JOIN') {
      const prevDate = getDateFromMessage(prevMsg);

      // 날짜가 다르면 구분선 표시, 같으면 표시하지 않음
      const result = !isSameDay(currentDate, prevDate);
      return result;
    }
  }

  // 이전에 일반 메시지가 없으면 날짜 표시
  return true;
};

// 메시지에서 날짜 추출 (디버깅 로그 포함)
const getDateFromMessage = (message) => {
  const timestamp = message.sentAt || message.time;

  console.log('🕐 날짜 추출 시도:', {
    timestamp,
    messageContent: message.content || message.message,
    messageType: message.messageType,
  });

  if (!timestamp) {
    console.log('⚠️ 타임스탬프 없음 - 현재 날짜 사용');
    return new Date();
  }

  try {
    let date;
    if (Array.isArray(timestamp)) {
      date = new Date(
        timestamp[0], // year
        timestamp[1] - 1, // month (0-based)
        timestamp[2], // day
        timestamp[3] || 0, // hour
        timestamp[4] || 0, // minute
        timestamp[5] || 0 // second
      );
      console.log('📅 배열 형태 날짜 변환:', {
        array: timestamp,
        result: date.toDateString(),
      });
    } else {
      date = new Date(timestamp);
      console.log('📅 문자열 형태 날짜 변환:', {
        string: timestamp,
        result: date.toDateString(),
      });
    }

    if (isNaN(date.getTime())) {
      console.error('❌ 유효하지 않은 날짜:', timestamp);
      return new Date();
    }

    return date;
  } catch (error) {
    console.error('❌ 날짜 추출 오류:', error, 'timestamp:', timestamp);
    return new Date();
  }
};

// 같은 날인지 확인
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Methods
const connectToChat = async () => {
  try {
    console.log(`🚀 채팅방 연결 시작: challengeId=${challengeId.value}`);

    // JWT 기반으로 채팅방 연결 (사용자 정보는 자동으로 백엔드에서 추출)
    await chatStore.connectToChat(challengeId.value);

    // 이력 메시지가 있는지 확인
    hasHistoryMessages.value = chatStore.messages.length > 0;

    console.log('✅ 채팅방 연결 완료');

    // 연결 완료 후 스크롤
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('❌ 채팅방 연결 실패:', error);
    // 에러는 store에서 처리되므로 여기서는 로그만 남김
  }
};

const reconnect = async () => {
  console.log('🔄 재연결 시도');
  chatStore.clearError();
  await connectToChat();
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !chatStore.isConnected) {
    return;
  }

  const success = chatStore.sendMessage(newMessage.value.trim());
  if (success) {
    newMessage.value = '';

    nextTick(() => {
      scrollToBottom();
    });
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const goBack = () => {
  // 🔑 핵심: 채팅방에서 나갈 때 연결을 끊지 않음
  console.log('🔙 채팅방에서 나가기 (연결 유지)');
  router.push('/');
};

// 🚨 새로 추가: 사용자 변경 감지 로직
const initializeChat = async () => {
  if (isInitialized.value) {
    console.log('🔄 이미 초기화됨, 스킵');
    return;
  }

  try {
    // 🚀 즉시 기존 연결 상태부터 체크 (API 호출 전)
    const routeChallengeId =
      parseInt(route.query.challengeId) || parseInt(route.params.challengeId);

    // Store의 빠른 체크 메서드 사용
    if (
      routeChallengeId &&
      chatStore.isAlreadyConnectedTo &&
      chatStore.isAlreadyConnectedTo(routeChallengeId)
    ) {
      console.log('⚡ 기존 연결 즉시 재사용 (0ms)');
      challengeId.value = routeChallengeId;
      challengeName.value = route.query.challengeName || '챌린지 채팅방';
      hasHistoryMessages.value = chatStore.messages.length > 0;
      isInitialized.value = true;
      // isCheckingStatus는 건드리지 않음 (이미 false)

      nextTick(() => {
        scrollToBottom();
      });
      return;
    }

    // 기존 연결이 없거나 다른 채팅방일 때만 상태 확인
    isCheckingStatus.value = true;
    console.log('🚀 Chat 컴포넌트 초기화 시작');

    // 1. 사용자의 챌린지 상태 확인 (JWT 기반)
    console.log('🔍 사용자 챌린지 상태 확인 중...');
    const status = await chatStore.checkUserChallengeStatus();

    // 🚨 핵심: 사용자가 실제로 바뀌었는지 확인
    if (
      chatStore.currentUser?.userId &&
      chatStore.currentUser.userId !== status.userId
    ) {
      console.log('👤 사용자 변경 감지 - Chat Store 초기화');
      console.log(
        `이전 사용자: ${chatStore.currentUser.userId}, 새 사용자: ${status.userId}`
      );
      chatStore.resetForNewUser();
    }

    if (!status.hasActiveChallenge) {
      console.log('❌ 활성 챌린지가 없음, NoChat 페이지로 이동');
      router.push('/no-chat');
      return;
    }

    console.log('✅ 활성 챌린지 확인:', status.challengeName);

    // 2. challengeId 설정
    challengeId.value = status.challengeId;
    challengeName.value = status.challengeName || '챌린지 채팅방';

    // 3. URL 파라미터와 실제 챌린지 ID가 다른 경우에만 replace
    if (routeChallengeId && routeChallengeId !== status.challengeId) {
      console.log(
        `🔄 URL 업데이트: ${routeChallengeId} -> ${status.challengeId}`
      );
      await router.replace({
        path: '/chat',
        query: {
          challengeId: status.challengeId,
          challengeName: status.challengeName,
        },
      });
      return;
    }

    // 4. 초기화 완료 표시
    isInitialized.value = true;
    isCheckingStatus.value = false;

    // 🔑 API 호출 후 다시 한번 기존 연결 상태 확인
    if (chatStore.isConnected && chatStore.challengeId === status.challengeId) {
      console.log('✅ API 확인 후 기존 연결 재사용');
      hasHistoryMessages.value = chatStore.messages.length > 0;
      nextTick(() => {
        scrollToBottom();
      });
      return;
    }

    console.log('✅ 챌린지 상태 확인 완료, 채팅방 연결 시작');

    // 5. 채팅방 연결 (기존 연결이 없거나 다른 채팅방인 경우에만)
    await connectToChat();
  } catch (error) {
    console.error('❌ 채팅방 초기화 실패:', error);
    isCheckingStatus.value = false;

    // 에러 발생 시 NoChat으로 이동
    setTimeout(() => {
      router.push('/no-chat');
    }, 2000);
  }
};

// 새 메시지가 추가될 때마다 자동 스크롤
watch(
  () => chatStore.messages.length,
  (newLength, oldLength) => {
    console.log('📊 메시지 개수 변화:', { oldLength, newLength });
    nextTick(() => {
      scrollToBottom();
    });
  }
);

// 연결 상태 변화 감지
watch(
  () => chatStore.isConnected,
  (isConnected) => {
    if (isConnected) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  }
);

// Lifecycle
onMounted(async () => {
  console.log('🚀 Chat 컴포넌트 마운트됨');
  await initializeChat();
});

onUnmounted(() => {
  console.log('🔌 Chat 컴포넌트 언마운트됨');
  // 🔑 핵심: 언마운트 시에도 연결을 끊지 않음 (cleanup 호출하지 않음)
  console.log('🔄 연결 유지됨 (cleanup 생략)');

  // 초기화 상태만 리셋
  isInitialized.value = false;
});

// 🔑 완전히 다른 페이지로 이동할 때만 연결 해제
// 브라우저 탭 종료나 새로고침 시에만 해제
window.addEventListener('beforeunload', () => {
  console.log('🌐 브라우저 종료/새로고침 - 연결 해제');
  chatStore.disconnect();
});
</script>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #414141;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Loading spinner animation */
.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Message animation */
.space-y-2 > * {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth transitions */
.transition-colors {
  transition: background-color 0.2s ease-in-out;
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
