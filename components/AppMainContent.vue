<template>
  <!-- 右侧内容区域 -->
  <div id='right-area' class="flex-1 overflow-y-auto relative z-10 pt-4 lg:pt-0">
    <!-- 文本显示区域 -->
    <div class="p-4 lg:p-6 h-full">
      <div v-if="selectedLesson" class="max-w-4xl mx-auto h-full">
        <div class="bg-black/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/10 p-4 lg:p-8 shadow-2xl h-full flex flex-col">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-8 space-y-3 lg:space-y-0">
            <div class="flex-1 min-w-0">
              <h2 class="text-lg lg:text-2xl font-bold text-white mb-2 lg:mb-1 truncate">
                {{ selectedLesson.title }}
              </h2>
              <span class="text-xs lg:text-sm text-purple-300 bg-purple-500/20 px-2 lg:px-3 py-1 rounded-full">
                {{ selectedLesson.book }}
              </span>
            </div>
            <div class="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          </div>
          <div class="prose prose-base lg:prose-lg max-w-none flex-1 overflow-hidden">
            <div v-if="lrcLines.length > 0" class="relative">
              <div class="pointer-events-none absolute top-0 left-0 right-0 h-3 lg:h-16 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10"></div>
              <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-3 lg:h-16 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>

              <div
                ref="lyricContainer"
                class="max-h-[65vh] lg:max-h-[60vh] overflow-y-auto px-2 lg:px-4 flex flex-col items-center space-y-2 lg:space-y-4 py-2 lg:py-4 h-full"
              >
                <div
                  v-for="(line, index) in props.lrcLines"
                  :key="index"
                  :ref="el => lineRefs[index] = el"
                  @click="$emit('seekTo', line.time / 1000)"
                  :class="[
                    'transition-all duration-500 cursor-pointer text-center px-2 lg:px-6 py-1 lg:py-3 rounded-lg lg:rounded-xl touch-manipulation',
                    props.currentLineIndex === index
                      ? 'text-lg lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transform scale-105'
                      : 'text-sm lg:text-xl text-gray-400 hover:text-gray-200'
                  ]"
                  :style="{ 
                    opacity: props.currentLineIndex === index ? 1 : 0.6,
                    transform: props.currentLineIndex === index ? 'scale(1.05)' : 'scale(1)'
                  }"
                >
                  {{ line.text }}
                </div>
              </div>
            </div>
            <div v-else-if="lessonText" class="whitespace-pre-line leading-relaxed text-gray-300 text-sm lg:text-lg px-2 lg:px-0 py-4 flex-1 overflow-y-auto">
              {{ lessonText }}
            </div>
            <div v-else class="text-gray-400 italic text-center py-8 lg:py-12 text-sm lg:text-base min-h-[200px] flex items-center justify-center">
              正在加载课文内容...
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 lg:py-16 h-full flex items-center justify-center">
        <div class="bg-black/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/10 p-6 lg:p-12 max-w-sm lg:max-w-md mx-auto">
          <div class="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
            <svg class="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p class="text-gray-300 text-base lg:text-lg">请选择一个课程开始学习</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  selectedLesson: {
    type: Object,
    default: null
  },
  lrcLines: {
    type: Array,
    default: () => []
  },
  currentLineIndex: {
    type: Number,
    default: -1
  },
  lessonText: {
    type: String,
    default: ''
  }
})

// 定义 lyricContainer 和 lineRefs 为 ref
const lyricContainer = ref(null)
const lineRefs = ref([])

watch(() => props.currentLineIndex, (newIndex) => {
  if (newIndex > -1 && lyricContainer.value && lineRefs.value[newIndex]) {
    nextTick(() => {
      const currentLineEl = lineRefs.value[newIndex]
      const containerEl = lyricContainer.value

      if (currentLineEl && containerEl) {
        const containerHeight = containerEl.offsetHeight
        const lineOffsetTop = currentLineEl.offsetTop
        const lineHeight = currentLineEl.offsetHeight

        // 计算滚动位置，使当前行居中
        const scrollTop = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2)

        containerEl.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        })
      }
    })
  }
}, { immediate: true })

defineEmits(['seekTo'])
</script>