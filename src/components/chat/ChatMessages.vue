<template>
  <div
    class="flex-1 px-[31px] py-4 overflow-y-auto space-y-2 pb-[140px]"
    ref="chatContainer"
  >
    <!-- 메시지 목록 with 날짜 구분 -->
    <template
      v-for="(message, index) in messages"
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
        :currentUserId="currentUserId"
        :showDateSeparator="shouldShowDateSeparator(message, index)"
      />
    </template>

    <!-- 메시지가 없을 때 -->
    <div
      v-if="messages.length === 0 && isConnected && !isLoading"
      class="flex justify-center py-8"
    >
      <div class="text-center">
        <i class="fas fa-comments text-4xl text-[#414141] mb-4"></i>
        <p class="text-[#C9C9C9] text-sm">첫 메시지를 보내보세요!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import ChatMessage from './ChatMessage.vue';

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  currentUserId: {
    type: [String, Number],
    default: null,
  },
  isConnected: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const chatContainer = ref(null);

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
    const prevMsg = props.messages[i];

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

  if (!timestamp) {
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
    } else {
      date = new Date(timestamp);
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

// 스크롤을 하단으로 이동
const scrollToBottom = () => {
  if (!chatContainer.value) return;

  const container = chatContainer.value;

  const performScroll = () => {
    container.scrollTop = container.scrollHeight;
  };

  // 즉시 실행
  performScroll();

  // DOM 업데이트 후 한번 더
  nextTick(() => {
    performScroll();
  });
};

// 새 메시지가 추가될 때마다 자동 스크롤
watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

// 연결 상태 변화 감지
watch(
  () => props.isConnected,
  (isConnected) => {
    if (isConnected) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  }
);

onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

// 외부에서 스크롤 제어를 위한 메서드 노출
defineExpose({
  scrollToBottom,
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
