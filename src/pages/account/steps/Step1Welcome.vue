<!-- step1welcome.vue -->
<template>
  <div class="flex flex-col h-full px-5 relative">
    <!-- Top Section - Icon and Text -->
    <div class="flex flex-col items-center justify-center pt-64 pb-16">
      <!-- Bank Building Icon -->
      <div class="mb-8">
        <div class="relative w-48 h-24">
          <!-- Bank Building -->
          <div class="absolute right-4 top-0">
            <!-- Building Base -->
            <div class="w-24 h-16 bg-white rounded-sm relative shadow-lg">
              <!-- Roof -->
              <div
                class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[12px] border-l-transparent border-r-transparent border-b-blue-500"
              ></div>

              <!-- Dollar Sign on Roof -->
              <div
                class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <span class="text-xs font-bold text-blue-900">$</span>
              </div>

              <!-- Columns -->
              <div
                class="absolute top-1 left-2 w-1.5 h-12 bg-gray-300 rounded-sm"
              ></div>
              <div
                class="absolute top-1 left-6 w-1.5 h-12 bg-gray-300 rounded-sm"
              ></div>
              <div
                class="absolute top-1 right-6 w-1.5 h-12 bg-gray-300 rounded-sm"
              ></div>
              <div
                class="absolute top-1 right-2 w-1.5 h-12 bg-gray-300 rounded-sm"
              ></div>

              <!-- Base Steps -->
              <div
                class="absolute -bottom-1 left-0 right-0 h-1.5 bg-gray-200 rounded-sm"
              ></div>
              <div
                class="absolute -bottom-2 -left-1 right-0 w-full h-1.5 bg-gray-300 rounded-sm"
              ></div>
            </div>
          </div>

          <!-- Person -->
          <div class="absolute left-4 bottom-0">
            <!-- Person Body -->
            <div class="w-10 h-14 relative">
              <!-- Head -->
              <div
                class="w-6 h-6 bg-orange-300 rounded-full mx-auto mb-1"
              ></div>

              <!-- Body -->
              <div class="w-8 h-10 bg-blue-500 rounded-sm mx-auto relative">
                <!-- Left Arm -->
                <div
                  class="absolute -left-1 top-1 w-1.5 h-5 bg-orange-300 rounded-sm"
                ></div>
                <!-- Right Arm (holding key) -->
                <div
                  class="absolute -right-1 top-1 w-1.5 h-3 bg-orange-300 rounded-sm"
                ></div>
                <div
                  class="absolute -right-2 top-4 w-3 h-1.5 bg-orange-300 rounded-sm"
                ></div>

                <!-- Legs -->
                <div
                  class="absolute -bottom-1 left-1 w-1.5 h-3 bg-gray-800 rounded-sm"
                ></div>
                <div
                  class="absolute -bottom-1 right-1 w-1.5 h-3 bg-gray-800 rounded-sm"
                ></div>
              </div>
            </div>

            <!-- Briefcase -->
            <div
              class="absolute -left-2 bottom-1 w-3 h-2 bg-amber-600 rounded-sm"
            ></div>
          </div>

          <!-- Key (held naturally) -->
          <div class="absolute left-16 bottom-8">
            <!-- Key Handle -->
            <div
              class="w-4 h-4 border-2 border-yellow-400 rounded-full relative"
            >
              <div
                class="absolute inset-1 border border-yellow-400 rounded-full"
              ></div>
            </div>

            <!-- Key Shaft -->
            <div
              class="w-6 h-1.5 bg-yellow-400 rounded-sm ml-4 -mt-0.5 relative"
            >
              <!-- Key Teeth -->
              <div
                class="absolute right-0 -top-0.5 w-1 h-0.5 bg-yellow-400"
              ></div>
              <div
                class="absolute right-1 top-1.5 w-0.5 h-0.5 bg-yellow-400"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Content -->
      <div class="text-center">
        <h2 class="text-xl font-bold mb-1 text-white">서비스 이용을 위해</h2>
        <h2 class="text-xl font-bold mb-6 text-white">
          계좌 연결이 필요합니다
        </h2>
      </div>
    </div>

    <!-- Bottom Section - Button -->
    <div class="absolute bottom-5 left-5 right-5 z-10">
      <div class="flex justify-center">
        <div class="w-[328px]">
          <Button
            label="계좌 연결하러 가기"
            :disabled="false"
            @click="$emit('next')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../../../components/Button.vue';

defineEmits(['next']);
</script>
