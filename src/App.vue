<template>
  <div id="app" class="w-full min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
// App component using Composition API
</script>

<style>
#app {
  width: 390px;
  height: 839px;
  margin: 0 auto; /* 가운데 정렬 (필요하면) */
  overflow: hidden; /* 넘치는 부분 숨김 */
  background-color: #2f2f2f; /* 배경 (원하면 지정) */
  position: relative;
}
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
