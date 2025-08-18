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
      <ChatMessages
        v-if="shouldShowChatUI"
        :messages="chatStore.sortedMessages"
        :current-user-id="chatStore.currentUser?.userId"
        :is-connected="chatStore.isConnected"
        :is-loading="chatStore.isLoading"
        ref="chatMessagesRef"
      />

      <!-- 🚀 로딩 상태들 (우선순위 2 - 채팅 UI가 없을 때만) -->
      <!-- 챌린지 상태 확인 중 -->
      <ChatChecking v-else-if="isCheckingStatus" />

      <!-- Loading Indicator (이력 로드 + 연결) -->
      <ChatLoading
        v-else-if="chatStore.isConnecting || chatStore.isLoading"
        :is-loading="chatStore.isLoading"
      />

      <!-- Error Message -->
      <ChatError
        v-else-if="chatStore.error"
        :error="chatStore.error"
        @reconnect="reconnect"
        @go-back="goBack"
      />

      <!-- Connection Status -->
      <ChatStatus
        v-else-if="
          !chatStore.isConnected &&
          !chatStore.isConnecting &&
          !chatStore.error &&
          !chatStore.isLoading
        "
        @reconnect="reconnect"
      />
    </div>

    <!-- Fixed Input Area at Bottom -->
    <ChatInput
      v-if="shouldShowInputArea"
      :is-connected="chatStore.isConnected"
      @send-message="sendMessage"
      ref="chatInputRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import Header from '@/components/layout/Header.vue';
import ChatMessages from '@/components/chat/ChatMessages.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import ChatLoading from '@/components/chat/ChatLoading.vue';
import ChatError from '@/components/chat/ChatError.vue';
import ChatStatus from '@/components/chat/ChatStatus.vue';
import ChatChecking from '@/components/chat/ChatChecking.vue';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const authStore = useAuthStore();

// Store에서 반응성 있는 데이터 가져오기
const { currentChallengeName } = storeToRefs(chatStore);

// Reactive data
const chatMessagesRef = ref(null);
const chatInputRef = ref(null);
const challengeName = computed(() => currentChallengeName.value || '챌린지 채팅방');
const isCheckingStatus = ref(false);
const hasHistoryMessages = ref(false);
const challengeId = ref(null);
const isInitialized = ref(false);

// 🚀 핵심: 계산된 속성으로 UI 상태 결정
const shouldShowChatUI = computed(() => {
  // 초기화되지 않았거나 상태 확인 중이면 채팅 UI 표시하지 않음
  if (!isInitialized.value || isCheckingStatus.value) {
    return false;
  }
  
  // 기존 연결이 있거나, 연결되어 있거나, 메시지가 있으면 채팅 UI 표시
  return (
    chatStore.isConnected ||
    chatStore.messages.length > 0 ||
    !chatStore.error
  );
});

const shouldShowInputArea = computed(() => {
  return (
    shouldShowChatUI.value && chatStore.isConnected && !chatStore.isLoading
  );
});

// 날짜 구분선 관련 함수들은 ChatMessages 컴포넌트로 이동됨

// Methods
const connectToChat = async () => {
  try {
    console.log(`🚀 채팅방 연결 시작: challengeId=${challengeId.value}`);

    // JWT 기반으로 채팅방 연결 (사용자 정보는 자동으로 백엔드에서 추출)
    await chatStore.connectToChat(challengeId.value);

    // 이력 메시지가 있는지 확인
    hasHistoryMessages.value = chatStore.messages.length > 0;


    // 연결 완료 후 스크롤
    nextTick(() => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollToBottom();
      }
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

const sendMessage = (messageText) => {
  if (!messageText.trim() || !chatStore.isConnected) {
    return;
  }

  const success = chatStore.sendMessage(messageText.trim());
  if (success) {
    // 입력창 초기화는 ChatInput 컴포넌트에서 자동으로 처리됨
    nextTick(() => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollToBottom();
      }
    });
  }
};

// scrollToBottom 함수는 ChatMessages 컴포넌트로 이동됨

const goBack = () => {
  // 🔑 핵심: 채팅방에서 나갈 때 연결을 끊지 않음
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
      // URL 쿼리 파라미터가 있으면 Chat Store도 업데이트
      if (route.query.challengeName) {
        chatStore.currentChallengeName = route.query.challengeName;
      }
      hasHistoryMessages.value = chatStore.messages.length > 0;
      isInitialized.value = true;
      // isCheckingStatus는 건드리지 않음 (이미 false)

      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollToBottom();
        }
      });
      return;
    }

    // 기존 연결이 없거나 다른 채팅방일 때만 상태 확인
    isCheckingStatus.value = true;

    // 1. 사용자의 챌린지 상태 확인 (JWT 기반)
    const status = await chatStore.checkUserChallengeStatus();

    // 🚨 핵심: 사용자가 실제로 바뀌었는지 확인
    if (
      chatStore.currentUser?.userId &&
      chatStore.currentUser.userId !== status.userId
    ) {
      chatStore.resetForNewUser();
    }

    if (!status.hasActiveChallenge) {
      isCheckingStatus.value = false;
      isInitialized.value = true;
      await router.replace('/no-chat');
      return;
    }

    // 2. challengeId 설정
    challengeId.value = status.challengeId;
    // Chat Store의 챌린지명도 업데이트 (반응성으로 헤더에 자동 반영)
    chatStore.currentChallengeName = status.challengeName || '챌린지 채팅방';

    // 3. URL 파라미터와 실제 챌린지 ID가 다른 경우에만 replace
    if (routeChallengeId && routeChallengeId !== status.challengeId) {
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
      hasHistoryMessages.value = chatStore.messages.length > 0;
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollToBottom();
        }
      });
      return;
    }

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

// 스크롤 관련 watch들은 ChatMessages 컴포넌트로 이동됨

// Lifecycle
onMounted(async () => {
  await initializeChat();
});

onUnmounted(() => {
  // 🔑 핵심: 언마운트 시에도 연결을 끊지 않음 (cleanup 호출하지 않음)
  // 초기화 상태만 리셋
  isInitialized.value = false;
});

// 🔑 완전히 다른 페이지로 이동할 때만 연결 해제
// 브라우저 탭 종료나 새로고침 시에만 해제
window.addEventListener('beforeunload', () => {
  chatStore.disconnect();
});
</script>

<style scoped>
/* 스타일들은 각 컴포넌트로 이동됨 */
</style>
