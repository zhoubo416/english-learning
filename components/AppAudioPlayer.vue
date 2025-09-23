<template>
  <!-- 固定在底部的音频播放器 -->
  <div class="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-2xl border-t border-white/10 z-50">
    <div v-if="selectedLesson" class="p-2 lg:p-6">
      <!-- 移动端播放器布局 -->
      <div class="lg:hidden">
        <!-- 紧凑的歌曲信息和控制 -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center flex-1 min-w-0 mr-4">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-white text-xs font-medium truncate">{{ selectedLesson.title }}</h3>
              <p class="text-gray-400 text-xs">{{ selectedLesson.book }}</p>
            </div>
          </div>
          
          <!-- 播放按钮 -->
          <button
            @click="$emit('togglePlay')"
            class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center touch-manipulation"
          >
            <PlayIcon v-if="!isPlaying" class="w-5 h-5 text-white ml-0.5" />
            <PauseIcon v-else class="w-5 h-5 text-white" />
          </button>
        </div>
        
        <!-- 进度条 -->
        <div class="mb-2">
          <div class="relative">
            <div 
              class="h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden touch-manipulation"
              @click="$emit('seekAudio', $event)"
            >
              <div 
                class="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-100"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-300 mt-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
        
        <!-- 音量控制 -->
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="$emit('updateVolume', $event.target.value)"
            class="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider touch-manipulation"
          />
        </div>
        
        <!-- 播放模式控制 (移动端) -->
        <div class="flex items-center justify-center space-x-2 mt-2">
          <button @click="$emit('updatePlaybackMode', 'sequential')" :class="['p-1 rounded-full', playbackMode === 'sequential' ? 'bg-purple-500/50 text-white' : 'text-gray-400 hover:bg-white/10']">顺序</button>
          <button @click="$emit('updatePlaybackMode', 'loop')" :class="['p-1 rounded-full', playbackMode === 'loop' ? 'bg-purple-500/50 text-white' : 'text-gray-400 hover:bg-white/10']">单曲</button>
          <button @click="$emit('updatePlaybackMode', 'random')" :class="['p-1 rounded-full', playbackMode === 'random' ? 'bg-purple-500/50 text-white' : 'text-gray-400 hover:bg-white/10']">随机</button>
        </div>
      </div>

      <!-- 桌面端播放器布局 -->
      <div class="hidden lg:flex items-center space-x-6">
        <!-- 播放按钮 -->
        <button
          @click="$emit('togglePlay')"
          class="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          <PlayIcon v-if="!isPlaying" class="w-7 h-7 text-white ml-1" />
          <PauseIcon v-else class="w-7 h-7 text-white" />
        </button>
        
        <!-- 进度条区域 -->
        <div class="flex-1 space-y-3">
          <div class="relative">
            <div 
              class="h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
              @click="$emit('seekAudio', $event)"
            >
              <div 
                class="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-100"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray-300">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
        
        <!-- 音量控制 -->
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="$emit('updateVolume', $event.target.value)"
            class="w-24 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
          />
        </div>

        <!-- 播放模式控制 (桌面端) -->
        <div class="flex items-center space-x-3">
          <button @click="$emit('updatePlaybackMode', 'sequential')" :class="['p-2 rounded-full', playbackMode === 'sequential' ? 'bg-purple-500/50 text-white' : 'text-gray-400 hover:bg-white/10']">顺序</button>
          <button @click="$emit('updatePlaybackMode', 'loop')" :class="['p-2 rounded-full', playbackMode === 'loop' ? 'bg-purple-500/50 text-white' : 'text-gray-400 hover:bg-white/10']">单曲</button>
          <button @click="$emit('updatePlaybackMode', 'random')" :class="['p-2 rounded-full', playbackMode === 'random' ? 'bg-purple-500/50 text-white' : 'text-gray-400 hover:bg-white/10']">随机</button>
        </div>
      </div>
      
      <audio
        ref="audioPlayer"
        :src="selectedLesson.audioUrl"
        @loadedmetadata="$emit('onAudioLoaded')"
        @timeupdate="$emit('onTimeUpdate')"
        @ended="$emit('onAudioEnded')"
        @error="$emit('onAudioError', $event)"
        preload="metadata"
      ></audio>
    </div>
    
    <div v-else class="p-2 lg:p-6 text-center">
      <p class="text-gray-400 text-sm lg:text-base">请选择一个课程开始学习</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  selectedLesson: {
    type: Object,
    default: null
  },
  isPlaying: {
    type: Boolean,
    required: true
  },
  currentTime: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  playbackMode: {
    type: String,
    default: 'sequential' // 新增播放模式prop
  }
})

const emit = defineEmits(['togglePlay', 'seekAudio', 'updateVolume', 'onAudioLoaded', 'onTimeUpdate', 'onAudioEnded', 'onAudioError', 'updatePlaybackMode'])

const audioPlayer = ref(null)

const progress = computed(() => {
  if (props.duration === 0) return 0
  return (props.currentTime / props.duration) * 100
})

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

defineExpose({
  audioPlayer
})
</script>

<style scoped>
/* 自定义滑块样式 */
.slider {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #ec4899);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #ec4899);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* 移动端滑块样式调整 */
@media (max-width: 1024px) {
  .slider::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
  }
  
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
  }
}
</style>