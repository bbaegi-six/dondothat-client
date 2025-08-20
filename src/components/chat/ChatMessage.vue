<template>
  <!-- 날짜 구분선 (새로운 날짜일 때만 표시) -->
  <div v-if="showDateSeparator" class="flex justify-center py-2 my-2">
    <div class="bg-[#555555] text-[#C9C9C9] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium">
      {{ formatDateSeparator(sentAt) }}
    </div>
  </div>

  <!-- 시스템 메시지 (입장/퇴장 등) - 날짜가 아닌 시스템 메시지만 표시 -->
  <div
    v-if="messageType === 'SYSTEM' || messageType === 'JOIN'"
    class="flex justify-center py-1.5 my-2"
  >
    <div class="bg-[#555555] text-[#C9C9C9] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-light">
      {{ content }}
    </div>
  </div>

  <!-- 받은 메시지 (다른 사용자) -->
  <div v-else-if="!isMyMessage" class="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
    <!-- Profile Picture -->
    <div
      class="w-7 h-7 sm:w-9 sm:h-9 bg-white rounded-full flex-shrink-0 flex items-center justify-center"
    >
      <i class="fas fa-user text-gray-600 text-sm sm:text-base"></i>
    </div>

    <!-- Message Content -->
    <div class="flex-1 min-w-0">
      <!-- Username -->
      <div class="mb-1.5">
        <span class="text-white text-xs sm:text-sm font-medium">{{ username }}</span>
      </div>

      <div class="flex items-end gap-1.5 sm:gap-2">
        <!-- Message Bubble -->
        <div
          class="bg-[#414141] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 inline-block max-w-[75%] sm:max-w-[70%] min-w-[2rem]"
        >
          <p
            class="text-white text-sm sm:text-base font-normal leading-5 sm:leading-6 whitespace-pre-line break-words"
          >
            {{ content }}
          </p>
        </div>

        <!-- Time -->
        <span class="text-[#C9C9C9] text-xs sm:text-sm font-light flex-shrink-0">{{
          formatTimeOnly(sentAt || time)
        }}</span>
      </div>
    </div>
  </div>

  <!-- 보낸 메시지 (내가 보낸 것) -->
  <div v-else class="flex justify-end mb-3 sm:mb-4">
    <div class="flex items-end gap-1.5 sm:gap-2 max-w-[80%] sm:max-w-[75%]">
      <!-- Time -->
      <span class="text-[#C9C9C9] text-xs sm:text-sm font-light flex-shrink-0">{{
        formatTimeOnly(time || sentAt)
      }}</span>

      <!-- Message Bubble -->
      <div
        class="bg-[#FF5555] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 inline-block max-w-full min-w-[2rem]"
      >
        <p class="text-white text-sm sm:text-base font-normal leading-5 sm:leading-6 whitespace-pre-line break-words">
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
  return props.userId === props.currentUserId;
});

// 시간만 표시하는 함수 (HH:MM 형식)
const formatTimeOnly = (timestamp) => {
  if (!timestamp) return getCurrentTime();
  
  try {
    let date;
    
    // 백엔드에서 배열 형태로 오는 경우 처리
    if (Array.isArray(timestamp) && timestamp.length >= 5) {
      // [year, month, day, hour, minute, second, nanosecond] 형태
      date = new Date(
        timestamp[0], // year
        timestamp[1] - 1, // month (0-based)
        timestamp[2], // day
        timestamp[3] || 0, // hour
        timestamp[4] || 0, // minute
        timestamp[5] || 0, // second
        Math.floor((timestamp[6] || 0) / 1000000) // nanosecond to millisecond
      );
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return getCurrentTime();
    }
    
    // 유효한 날짜인지 확인
    if (!date || isNaN(date.getTime())) {
      return getCurrentTime();
    }
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    return getCurrentTime();
  }
};

// 날짜 구분선 포맷 함수
const formatDateSeparator = (timestamp) => {
  if (!timestamp) return getCurrentDateString();

  try {
    let date;

    // 백엔드에서 배열 형태로 오는 경우 처리
    if (Array.isArray(timestamp) && timestamp.length >= 5) {
      date = new Date(
        timestamp[0], // year
        timestamp[1] - 1, // month (0-based)
        timestamp[2], // day
        timestamp[3] || 0, // hour
        timestamp[4] || 0, // minute
        timestamp[5] || 0, // second
        Math.floor((timestamp[6] || 0) / 1000000) // nanosecond to millisecond
      );
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return getCurrentDateString();
    }

    // 유효한 날짜인지 확인
    if (!date || isNaN(date.getTime())) {
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
/* Responsive message styling */
@media (max-width: 639px) {
  /* 모바일에서 더 컴팩트한 스타일 */
  .message-bubble {
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
  }
}

@media (min-width: 640px) {
  /* 데스크톱에서 더 넉넉한 스타일 */
  .message-bubble {
    font-size: 1rem; /* 16px */
    line-height: 1.5rem; /* 24px */
  }
}

/* Message bubble 호버 효과 */
.bg-\[\#414141\]:hover {
  background-color: #4a4a4a;
}

.bg-\[\#FF5555\]:hover {
  background-color: #ff6666;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease;
}
</style>
