<template>
  <nav
    class="w-full absolute bottom-0 left-0 right-0"
    style="background-color: #2f2f2f"
  >
    <div class="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="activeTab = item.id"
        class="flex flex-col items-center justify-center p-3 rounded-lg transition-colors duration-200"
        :class="
          activeTab === item.id
            ? 'text-white'
            : 'text-gray-400 hover:text-gray-300'
        "
      >
        <component
          :is="item.icon"
          class="w-6 h-6 mb-1"
          :class="activeTab === item.id ? 'text-white' : 'text-gray-400'"
        />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { Home, Menu, Trophy, MessageCircle, User } from "lucide-vue-next";

const activeTab = ref("home");

const navItems = [
  {
    id: "home",
    label: "홈",
    icon: Home,
  },
  {
    id: "menu",
    label: "메뉴",
    icon: Menu,
  },
  {
    id: "trophy",
    label: "트로피",
    icon: Trophy,
  },
  {
    id: "chat",
    label: "채팅",
    icon: MessageCircle,
  },
  {
    id: "profile",
    label: "프로필",
    icon: User,
  },
];
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>
