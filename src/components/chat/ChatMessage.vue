<template>
  <!-- 날짜 구분선 (새로운 날짜일 때만 표시) -->
  <div v-if="showDateSeparator" class="flex justify-center py-2 mt-4 mb-2">
    <div class="bg-[#414141] text-[#C9C9C9] text-xs px-3 py-1 rounded-full">
      {{ formatDateSeparator(sentAt) }}
    </div>
  </div>

  <!-- 시스템 메시지 (입장/퇴장 등) - 날짜가 아닌 시스템 메시지만 표시 -->
  <div
    v-if="messageType === 'SYSTEM' || messageType === 'JOIN'"
    class="flex justify-center py-1 my-1"
  >
    <div class="bg-[#555555] text-[#C9C9C9] text-xs px-3 py-1 rounded-full">
      {{ content }}
    </div>
  </div>

  <!-- 받은 메시지 (다른 사용자) -->
  <div v-else-if="!isMyMessage" class="flex items-start gap-2 mb-2">
    <!-- Profile Picture -->
    <div
      class="w-8 h-8 bg-white rounded-full flex-shrink-0 flex items-center justify-center"
    >
      <i class="fas fa-user text-gray-600 text-sm"></i>
    </div>

    <!-- Message Content -->
    <div class="flex-1">
      <!-- Username -->
      <div class="mb-1">
        <span class="text-white text-xs font-extralight">{{ username }}</span>
      </div>

      <div class="flex items-end gap-1">
        <!-- Message Bubble -->
        <div
          class="bg-[#414141] rounded-lg px-3 py-2 inline-block max-w-[280px] min-w-[40px]"
        >
          <p
            class="text-white text-xs font-light leading-4 whitespace-pre-line"
          >
            {{ content }}
          </p>
        </div>

        <!-- Time -->
        <span class="text-white text-[8px] font-extralight">{{
          formatTimeOnly(time || sentAt)
        }}</span>
      </div>
    </div>
  </div>

  <!-- 보낸 메시지 (내가 보낸 것) -->
  <div v-else class="flex justify-end mb-2">
    <div class="flex items-end gap-1">
      <!-- Time -->
      <span class="text-white text-[8px] font-extralight">{{
        formatTimeOnly(time || sentAt)
      }}</span>

      <!-- Message Bubble -->
      <div
        class="bg-[#FF5555] rounded-lg px-3 py-2 inline-block max-w-[280px] min-w-[40px]"
      >
        <p class="text-white text-xs font-light leading-4 whitespace-pre-line">
          {{ content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: false,
  },
  sentAt: {
    type: [String, Array],
    required: false,
  },
  messageType: {
    type: String,
    default: 'MESSAGE',
  },
  userId: {
    type: Number,
    required: true,
  },
  currentUserId: {
    type: Number,
    required: true,
  },
  showDateSeparator: {
    type: Boolean,
    default: false,
  },
});

// 내가 보낸 메시지인지 확인 - userId로 판단
const isMyMessage = computed(() => {
  const result = props.userId === props.currentUserId;
  console.log('🔍 메시지 소유자 확인:', {
    messageUserId: props.userId,
    currentUserId: props.currentUserId,
    isMyMessage: result,
    username: props.username,
    content: props.content,
  });
  return result;
});

// 시간만 표시하는 함수 (HH:MM 형식)
const formatTimeOnly = (timestamp) => {
  if (!timestamp) return '';
  try {
    let date;
    // 백엔드에서 배열 형태로 오는 경우 처리
    if (Array.isArray(timestamp)) {
      // [year, month, day, hour, minute, second] 형태
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
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', timestamp);
      return getCurrentTime();
    }
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('시간 형식 변환 오류:', error, 'timestamp:', timestamp);
    return getCurrentTime();
  }
};

// 날짜 구분선 포맷 함수
const formatDateSeparator = (timestamp) => {
  if (!timestamp) return '';

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

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.error('Invalid date for separator:', timestamp);
      return getCurrentDateString();
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 오늘인지 확인
    if (isSameDay(date, today)) {
      return '오늘';
    }

    // 어제인지 확인
    if (isSameDay(date, yesterday)) {
      return '어제';
    }

    // 올해인지 확인
    if (date.getFullYear() === today.getFullYear()) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

      console.log('month', month);
      console.log('day', day);
      console.log('weekDay', weekDay);

      return `${month}월 ${day}일 ${weekDay}요일`;
    } else {
      // 다른 년도
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
    }
  } catch (error) {
    console.error(
      '날짜 구분선 형식 변환 오류:',
      error,
      'timestamp:',
      timestamp
    );
    return getCurrentDateString();
  }
};

// 같은 날인지 확인하는 함수
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// 현재 시간 반환 (fallback)
const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 현재 날짜 문자열 반환 (fallback)
const getCurrentDateString = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  return `${month}월 ${day}일 ${weekDay}요일`;
};
</script>

<style scoped>
/* Message animation */
div {
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
