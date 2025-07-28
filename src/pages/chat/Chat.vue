<template>
  <div class="flex flex-col h-screen bg-default max-w-[390px] mx-auto">
    <!-- Custom Header -->
    <header
      class="flex items-center px-5 py-4 bg-default text-white h-[60px] box-border w-full fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[390px] z-50"
    >
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
      <!-- Loading Indicator -->
      <div
        v-if="chatStore.isConnecting"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-white text-center">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>채팅방에 연결 중...</p>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-else-if="chatStore.error"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
          <p class="text-white">{{ chatStore.error }}</p>
          <button
            @click="reconnect"
            class="mt-4 px-4 py-2 bg-[#FF5555] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            다시 연결
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div
        v-else-if="chatStore.isConnected"
        class="flex-1 px-[31px] py-4 overflow-y-auto space-y-2"
        ref="chatContainer"
      >
        <ChatMessage
          v-for="message in chatStore.sortedMessages"
          :key="message.messageId || message.id || Math.random()"
          :username="
            message.userName || message.username || '사용자' + message.userId
          "
          :content="message.message || message.content"
          :time="formatTime(message.sentAt || message.time)"
          :messageType="message.messageType || 'MESSAGE'"
          :userId="message.userId"
          :currentUserId="currentUserId"
        />
      </div>

      <!-- Input Area -->
      <div v-if="chatStore.isConnected" class="px-6 pb-4">
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
          !chatStore.isConnected && !chatStore.isConnecting && !chatStore.error
        "
        class="px-6 pb-4"
      >
        <div class="text-center text-gray-400">
          <i class="fas fa-wifi-slash text-xl mb-2"></i>
          <p>연결이 끊어졌습니다</p>
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
const challengeName = ref('배달음식 금지 챌린지');

// 사용자 정보 - 쿼리 파라미터에서 userId 가져오기 (테스트용)
const currentUserId = ref(
  parseInt(route.query.userId) || authStore.user?.id || 1
);
const currentUserName = ref(
  route.query.userName || authStore.user?.name || '나'
);

// Methods
const connectToChat = async () => {
  try {
    const challengeId = route.params.challengeId || 1;

    await chatStore.connectToChat(
      parseInt(challengeId),
      currentUserId.value,
      currentUserName.value
    );

    console.log('✅ 채팅방 연결 완료');
  } catch (error) {
    console.error('❌ 채팅방 연결 실패:', error);
  }
};

const reconnect = async () => {
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

// 시간 포맷팅 함수
const formatTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? '오후' : '오전';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes.toString().padStart(2, '0');

  return `${period} ${hour12}:${minuteStr}`;
};

// 새 메시지가 추가될 때마다 자동 스크롤
watch(
  () => chatStore.messages.length,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

// Lifecycle
onMounted(() => {
  console.log('🚀 Chat 컴포넌트 마운트됨');
  connectToChat();
});

onUnmounted(() => {
  console.log('🔌 Chat 컴포넌트 언마운트됨');
  chatStore.cleanup();
});

// 페이지를 벗어날 때 연결 해제
window.addEventListener('beforeunload', () => {
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
</style>
