<template>
  <div class="flex flex-col h-screen bg-default max-w-[390px] mx-auto">
    <!-- Custom Header -->
    <header
      class="flex items-center px-5 py-4 bg-default text-white h-[60px] box-border w-full fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[390px] z-50"
    >
      <!-- 뒤로가기 버튼 -->
      <button @click="goBack" class="mr-3 p-1">
        <i class="fas fa-arrow-left text-white text-lg"></i>
      </button>

      <!-- 채팅방 제목 (헤더 전체 중앙) -->
      <h2
        class="font-pretendard text-xl font-semibold m-0 absolute left-1/2 transform -translate-x-1/2"
      >
        {{ challengeName }}
      </h2>

      <!-- 접속자 수 (우측 정렬) -->
      <div class="flex items-center gap-1 ml-auto">
        <i class="fas fa-user-group text-[#C9C9C9] text-base"></i>
        <span class="text-[#C9C9C9] text-base font-medium">{{
          chatStore.userCount
        }}</span>
      </div>
    </header>

    <!-- Body Content with proper top margin for fixed header -->
    <div class="flex flex-col flex-1 mt-[60px]">
      <!-- 챌린지 상태 확인 중 -->
      <div
        v-if="isCheckingStatus"
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

      <!-- Chat Messages -->
      <div
        v-else-if="chatStore.isConnected || chatStore.messages.length > 0"
        class="flex-1 px-[31px] py-4 overflow-y-auto space-y-2"
        ref="chatContainer"
      >
        <!-- 이전 메시지 안내 (이력이 있을 때만) -->
        <div
          v-if="chatStore.messages.length > 0 && hasHistoryMessages"
          class="flex justify-center py-2 mb-4"
        >
          <div
            class="bg-[#414141] text-[#C9C9C9] text-xs px-3 py-1 rounded-full"
          >
            챌린지 참여 이후의 채팅 내용입니다
          </div>
        </div>

        <!-- 메시지 목록 -->
        <ChatMessage
          v-for="message in chatStore.sortedMessages"
          :key="message.messageId || message.id || Math.random()"
          :username="
            message.userName || message.username || '사용자' + message.userId
          "
          :content="message.message || message.content"
          :time="message.time || formatTime(message.sentAt)"
          :messageType="message.messageType || 'MESSAGE'"
          :userId="message.userId"
          :currentUserId="chatStore.currentUser?.userId"
        />

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

      <!-- Input Area -->
      <div
        v-if="chatStore.isConnected && !chatStore.isLoading"
        class="px-6 pb-4"
      >
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

      <!-- Connection Status -->
      <div
        v-if="
          !chatStore.isConnected &&
          !chatStore.isConnecting &&
          !chatStore.error &&
          !chatStore.isLoading
        "
        class="px-6 pb-4"
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

      <!-- Bottom Navigation Space -->
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import ChatMessage from '@/components/chat/ChatMessage.vue';

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

// Methods
const connectToChat = async () => {
  try {
    isCheckingStatus.value = false;

    // URL에서 challengeId 가져오기
    challengeId.value =
      parseInt(route.query.challengeId) ||
      parseInt(route.params.challengeId) ||
      1;

    // 쿼리에서 챌린지 이름 가져오기
    if (route.query.challengeName) {
      challengeName.value = route.query.challengeName;
    }

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
    isCheckingStatus.value = false;

    // 연결 실패 시 3초 후 NoChat 페이지로 이동
    setTimeout(() => {
      router.push('/no-chat');
    }, 3000);
  }
};

const reconnect = async () => {
  chatStore.clearError();
  isCheckingStatus.value = false;
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
  router.push('/');
};

// 시간 포맷팅 함수 (24시간 형식)
const formatTime = (timestamp) => {
  if (!timestamp) return '';

  try {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('시간 형식 변환 오류:', error);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

  try {
    isCheckingStatus.value = true;

    // 1. 먼저 사용자의 챌린지 상태 확인 (JWT 기반)
    console.log('🔍 사용자 챌린지 상태 확인 중...');
    const status = await chatStore.checkUserChallengeStatus();

    if (!status.hasActiveChallenge) {
      console.log('❌ 활성 챌린지가 없음, NoChat 페이지로 이동');
      router.push('/no-chat');
      return;
    }

    console.log('✅ 활성 챌린지 확인:', status.challengeName);

    // 2. 활성 챌린지가 있으면 해당 채팅방으로 연결
    challengeName.value = status.challengeName || '챌린지 채팅방';

    // 3. 쿼리 파라미터가 없거나 다르면 상태에서 가져온 정보로 업데이트
    const routeChallengeId =
      parseInt(route.query.challengeId) || parseInt(route.params.challengeId);

    if (!routeChallengeId || routeChallengeId !== status.challengeId) {
      await router.replace({
        path: '/chat',
        query: {
          challengeId: status.challengeId,
          challengeName: status.challengeName,
        },
      });
      return; // replace 후 다시 마운트됨
    }

    // 4. 챌린지 상태 확인 완료
    isCheckingStatus.value = false;
    console.log('✅ 챌린지 상태 확인 완료, 채팅방 연결 시작');

    await connectToChat();
  } catch (error) {
    console.error('❌ 채팅방 초기화 실패:', error);
    isCheckingStatus.value = false;

    // 에러 메시지를 store에 설정하지 않고 직접 NoChat으로 이동
    setTimeout(() => {
      router.push('/no-chat');
    }, 2000);
  }
});

onUnmounted(() => {
  console.log('🔌 Chat 컴포넌트 언마운트됨');
  chatStore.cleanup();
});

// 페이지를 벗어날 때 연결 해제
window.addEventListener('beforeunload', () => {
  chatStore.disconnect();
});

// 브라우저 뒤로가기 감지
window.addEventListener('popstate', () => {
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
