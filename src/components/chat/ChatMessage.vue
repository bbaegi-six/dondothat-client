<template>
  <!-- 날짜 구분선 (새로운 날짜일 때만 표시) -->
  <div v-if="showDateSeparator" class="flex justify-center py-0.5 mt-1 mb-0.5">
    <div class="bg-[#555555] text-[#C9C9C9] text-2xs sm:text-xs px-2 sm:px-3 py-1 rounded-full">
      {{ formatDateSeparator(sentAt) }}
    </div>
  </div>

  <!-- 시스템 메시지 (입장/퇴장 등) - 날짜가 아닌 시스템 메시지만 표시 -->
  <div
    v-if="messageType === 'SYSTEM' || messageType === 'JOIN'"
    class="flex justify-center py-1 my-1"
  >
    <div class="bg-[#555555] text-[#C9C9C9] text-2xs sm:text-xs px-2 sm:px-3 py-1 rounded-full">
      {{ content }}
    </div>
  </div>

  <!-- 받은 메시지 (다른 사용자) -->
  <div v-else-if="!isMyMessage" class="flex items-start gap-1.5 sm:gap-2 mb-2">
    <!-- Profile Picture -->
    <div
      class="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex-shrink-0 flex items-center justify-center"
    >
      <i class="fas fa-user text-gray-600 text-xs sm:text-sm"></i>
    </div>

    <!-- Message Content -->
    <div class="flex-1">
      <!-- Username -->
      <div class="mb-1">
        <span class="text-white text-2xs sm:text-xs font-extralight">{{ username }}</span>
      </div>

      <div class="flex items-end gap-1">
        <!-- Message Bubble -->
        <div
          class="bg-[#414141] rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 inline-block max-w-60 sm:max-w-70 min-w-8 sm:min-w-10"
        >
          <p
            class="text-white text-2xs sm:text-xs font-light leading-3 sm:leading-4 whitespace-pre-line"
          >
            {{ content }}
          </p>
        </div>

        <!-- Time -->
        <span class="text-white text-[10px] sm:text-2xs font-extralight">{{
          formatTimeOnly(sentAt || time)
        }}</span>
      </div>
    </div>
  </div>

  <!-- 보낸 메시지 (내가 보낸 것) -->
  <div v-else class="flex justify-end mb-2">
    <div class="flex items-end gap-1">
      <!-- Time -->
      <span class="text-white text-[10px] sm:text-2xs font-extralight">{{
        formatTimeOnly(time || sentAt)
      }}</span>

      <!-- Message Bubble -->
      <div
        class="bg-[#FF5555] rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 inline-block max-w-60 sm:max-w-70 min-w-8 sm:min-w-10"
      >
        <p class="text-white text-2xs sm:text-xs font-light leading-3 sm:leading-4 whitespace-pre-line">
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
