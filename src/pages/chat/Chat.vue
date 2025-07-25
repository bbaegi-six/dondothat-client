<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- Custom Header -->
    <header
      class="flex justify-between items-center px-5 py-4 bg-dark-bg text-white h-[60px] box-border w-full max-w-[390px] mx-auto fixed top-0 left-0 right-0 z-50"
    >
      <div class="relative w-full flex items-center justify-between">
        <div style="width: 40px"></div>
        <h2
          class="font-pretendard text-xl font-semibold m-0 text-center absolute left-1/2 -translate-x-1/2 w-max"
        >
          배달음식 금지 챌린지
        </h2>
        <div class="flex items-center gap-1 ml-auto">
          <i class="fas fa-user-group text-[#C9C9C9] text-base"></i>
          <span class="text-[#C9C9C9] text-base font-medium">10</span>
        </div>
      </div>
    </header>

    <!-- Header divider -->
    <div class="pt-[60px] border-b border-[#414141]"></div>

    <!-- Chat Messages -->
    <div class="flex-1 px-[31px] py-4 overflow-y-auto space-y-2">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :username="message.username"
        :content="message.content"
        :time="formatTime(message.time)"
      />
    </div>

    <!-- Input Area -->
    <div class="px-6 pb-4">
      <div class="flex gap-2 items-center">
        <div class="flex-1 relative">
          <input
            v-model="newMessage"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="채팅을 입력하세요"
            class="w-full h-12 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="w-12 h-12 text-white rounded-xl flex items-center justify-center transition-colors duration-200"
          :class="
            newMessage.trim()
              ? 'bg-[#FF5555]'
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
</template>

<script setup>
import { ref, nextTick } from 'vue';
import ChatMessage from '@/components/chat/ChatMessage.vue';

// Reactive data
const newMessage = ref('');
const messages = ref([
  {
    id: 1,
    username: '정꾸준',
    time: '09:10',
    content:
      '아 오늘 배달 먹을랬는데 참았다..ㅠ 이거 실화? 레알 배고프다 ㅋㅋ\n너넨 오늘 뭐먹냐',
  },
  {
    id: 2,
    username: '김절약',
    time: '09:12',
    content: '나는 오늘 도시락 먹을라고 ㅋㅋ',
  },
  { id: 3, username: '정꾸준', time: '09:13', content: 'ㄹㅇㅋㅋ' },
  {
    id: 4,
    username: '신입',
    time: '09:15',
    content: '안녕하세요 행님들 신입임니다 ㅎㅎㅎㅎㅎ',
  },
  { id: 5, username: '나', time: '09:16', content: '신입님 환영합니다!' },
  {
    id: 6,
    username: '정꾸준',
    time: '09:17',
    content: '오늘 점심 뭐 먹지 고민된다',
  },
  {
    id: 7,
    username: '나',
    time: '09:18',
    content: '저는 어제 남은 반찬 먹으려구요',
  },
  { id: 8, username: '김절약', time: '09:19', content: '역시 절약왕' },
  { id: 9, username: '나', time: '09:20', content: 'ㅋㅋㅋㅋ' },
  { id: 10, username: '정꾸준', time: '09:21', content: '오늘도 화이팅!' },
  {
    id: 11,
    username: '신입',
    time: '09:22',
    content: '다들 열심히 하시네요!',
  },
  {
    id: 12,
    username: '나',
    time: '09:23',
    content: '우리 다같이 배달음식 참아봐요!',
  },
  { id: 13, username: '김절약', time: '09:24', content: '좋아요~' },
  { id: 14, username: '정꾸준', time: '09:25', content: '배고프다...' },
  { id: 15, username: '나', time: '09:26', content: '참아야죠 ㅎㅎ' },
  {
    id: 16,
    username: '신입',
    time: '09:27',
    content: '저도 오늘은 도시락 싸왔어요!',
  },
  { id: 17, username: '나', time: '09:28', content: '오 멋져요!' },
  { id: 18, username: '정꾸준', time: '09:29', content: '다들 대단하다' },
  { id: 19, username: '나', time: '09:30', content: '우리 모두 화이팅!' },
  { id: 20, username: '김절약', time: '09:31', content: '화이팅!' },
]);

// Methods
const formatTime = (timeString) => {
  return timeString; // 이미 24시간 형식으로 되어있음
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  messages.value.push({
    id: Date.now(),
    username: '나',
    time: timeString,
    content: newMessage.value.trim(),
  });

  newMessage.value = '';

  // Scroll to bottom after message is added
  nextTick(() => {
    const chatContainer = document.querySelector('.overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};
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
