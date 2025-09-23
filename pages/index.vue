<template>
  <div class="flex flex-col lg:flex-row h-screen pb-24 lg:pb-32 relative overflow-hidden">
    <AppBackground />

    <AppSidebar
      :books="books"
      :booksLoading="booksLoading"
      :selectedLesson="selectedLesson"
      :selectedBook="selectedBook"
      :expandedBooks="expandedBooks"
      :mobileMenuOpen="mobileMenuOpen"
      @toggleBook="toggleBook"
      @selectLesson="selectLesson"
      @toggleMobileMenu="toggleMobileMenu"
      @closeMobileMenu="closeMobileMenu"
    />

    <AppMobileMenuOverlay
      :mobileMenuOpen="mobileMenuOpen"
      @closeMobileMenu="closeMobileMenu"
    />

    <AppMainContent
      :selectedLesson="selectedLesson"
      :lrcLines="lrcLines"
      :currentLineIndex="currentLineIndex"
      :lessonText="lessonText"
      :lyricContainer="lyricContainer"
      :lineRefs="lineRefs"
      @seekTo="seekTo"
    />

    <AppAudioPlayer
      :selectedLesson="selectedLesson"
      :isPlaying="isPlaying"
      :currentTime="currentTime"
      :duration="duration"
      :volume="volume"
      :playbackMode="playbackMode"
      @togglePlay="togglePlay"
      @seekAudio="seekAudio"
      @updateVolume="updateVolume"
      @onAudioLoaded="onAudioLoaded"
      @onTimeUpdate="onTimeUpdate"
      @onAudioEnded="onAudioEnded"
      @onAudioError="onAudioError"
      @updatePlaybackMode="updatePlaybackMode"
      ref="audioPlayerRef"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import AppBackground from '~/components/AppBackground.vue'
import AppMobileMenuOverlay from '~/components/AppMobileMenuOverlay.vue'
import AppSidebar from '~/components/AppSidebar.vue'
import AppMainContent from '~/components/AppMainContent.vue'
import AppAudioPlayer from '~/components/AppAudioPlayer.vue'

// 响应式数据
const selectedLesson = ref(null)
const selectedBook = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const playbackMode = ref('sequential') // 'sequential', 'loop', 'random'
const audioPlayerRef = ref(null) // 用于访问 AppAudioPlayer 内部的 audioPlayer 元素
const lessonText = ref('')
const expandedBooks = ref([])
const lrcLines = ref([])
const currentLineIndex = ref(-1)
const lineRefs = ref([])
const lyricContainer = ref(null)
const mobileMenuOpen = ref(false)

// 使用组合式函数加载课程数据
const { lessons: books, loading: booksLoading, fetchLessons } = useLessons()

// 计算属性
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 移动端菜单控制
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 方法
const toggleBook = (bookId) => {
  const index = expandedBooks.value.indexOf(bookId)
  if (index > -1) {
    expandedBooks.value.splice(index, 1)
  } else {
    expandedBooks.value.push(bookId)
  }
}

const selectLesson = (lesson, book) => {
  selectedLesson.value = lesson
  selectedBook.value = book
  isPlaying.value = false
  currentTime.value = 0
  loadLessonText(lesson, book)
  
  // 自动播放
  nextTick(() => {
    const audioPlayer = audioPlayerRef.value?.audioPlayer
    if (audioPlayer) {
      audioPlayer.play().catch(e => console.error("自动播放失败:", e))
      isPlaying.value = true
    }
  })
}

const togglePlay = () => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (!audioPlayer) return
  
  if (isPlaying.value) {
    audioPlayer.pause()
  } else {
    audioPlayer.play()
  }
  isPlaying.value = !isPlaying.value
}

const seekAudio = (event) => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (!audioPlayer || duration.value === 0) return
  
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  
  audioPlayer.currentTime = newTime
  currentTime.value = newTime
}

const updateVolume = (newVolume) => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (audioPlayer) {
    volume.value = parseFloat(newVolume)
    audioPlayer.volume = volume.value
  }
}

const updatePlaybackMode = (mode) => {
  playbackMode.value = mode
}

const onAudioLoaded = () => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (audioPlayer) {
    duration.value = audioPlayer.duration || 0
    audioPlayer.volume = volume.value
    // 如果是自动播放，确保在loadedmetadata后开始播放
    if (isPlaying.value && audioPlayer.paused) {
      audioPlayer.play().catch(e => console.error("自动播放失败:", e))
    }
  }
}

const onTimeUpdate = () => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (audioPlayer) {
    currentTime.value = audioPlayer.currentTime || 0
    updateCurrentLine()
  }
}

const onAudioEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  currentLineIndex.value = -1

  if (playbackMode.value === 'loop') {
    // 单曲循环
    const audioPlayer = audioPlayerRef.value?.audioPlayer
    if (audioPlayer) {
      audioPlayer.currentTime = 0
      audioPlayer.play()
      isPlaying.value = true
    }
  } else if (playbackMode.value === 'sequential') {
    // 顺序播放
    playNextLesson()
  } else if (playbackMode.value === 'random') {
    // 随机播放
    playRandomLesson()
  }
}

const onAudioError = (error) => {
  console.error('音频加载错误:', error)
  duration.value = 0
  currentTime.value = 0
  isPlaying.value = false // 播放错误时停止播放状态
}

const updateCurrentLine = () => {
  if (lrcLines.value.length === 0) return
  
  const currentTimeMs = currentTime.value * 1000
  let activeIndex = -1
  
  for (let i = 0; i < lrcLines.value.length; i++) {
    if (currentTimeMs >= lrcLines.value[i].time) {
      activeIndex = i
    } else {
      break
    }
  }
  
  if (currentLineIndex.value !== activeIndex) {
    currentLineIndex.value = activeIndex
    nextTick(() => {
      const el = lineRefs.value[currentLineIndex.value]
      const container = lyricContainer.value
      if (el && container) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }
}

const seekTo = (sec) => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (!audioPlayer || typeof sec !== 'number') return
  audioPlayer.currentTime = Math.max(0, Math.min(sec, duration.value || 0))
  currentTime.value = audioPlayer.currentTime
}

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const parseLrcContent = (lrcContent) => {
  // 兼容 CRLF 与 LF
  const lines = lrcContent.split(/\r?\n/)
  const parsedLines = []
  
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    // 匹配时间戳格式 [mm:ss.xx] 或 [mm:ss]
    const match = line.match(/^\[(\d{2}):(\d{2})(?:\.(\d{2}))?\](.*)$/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const milliseconds = match[3] ? parseInt(match[3], 10) * 10 : 0
      const text = (match[4] || '').trim()
      
      if (text) {
        const timeInMs = (minutes * 60 + seconds) * 1000 + milliseconds
        parsedLines.push({ time: timeInMs, text })
      }
    }
  }
  
  return parsedLines.sort((a, b) => a.time - b.time)
}

const loadLessonText = async (lesson, book) => {
  try {
    lessonText.value = '正在加载课文内容...'
    lrcLines.value = []
    currentLineIndex.value = -1
    
    const bookNum = book.id
    console.log('Loading text for:', { bookNum, lessonId: lesson.id })
    const response = await $fetch(`/api/text/nce${bookNum}/${lesson.id}`)
    
    if (response.lrcContent) {
      // 如果有LRC内容，解析时间戳
      const parsed = parseLrcContent(response.lrcContent)
      if (parsed && parsed.length > 0) {
        lrcLines.value = parsed
        lessonText.value = ''
      } else {
        // 解析不到有效行，回退到纯文本显示
        lrcLines.value = []
        lessonText.value = response.text || '课文内容暂未加载，请稍后重试。'
      }
    } else {
      // 否则显示纯文本
      lessonText.value = response.text
      lrcLines.value = []
    }
  } catch (error) {
    console.error('加载课文失败:', error)
    lessonText.value = '课文内容加载失败，请稍后重试。'
    lrcLines.value = []
  }
}

// 获取所有课程的扁平化列表
const getAllLessons = computed(() => {
  const allLessons = []
  books.value.forEach(book => {
    book.lessons.forEach(lesson => {
      allLessons.push({ lesson, book })
    })
  })
  return allLessons
})

// 播放下一首课程 (顺序播放)
const playNextLesson = () => {
  const allLessons = getAllLessons.value
  if (!selectedLesson.value || allLessons.length === 0) return

  const currentIndex = allLessons.findIndex(item => item.lesson.id === selectedLesson.value.id)
  const nextIndex = (currentIndex + 1) % allLessons.length
  const nextLessonItem = allLessons[nextIndex]

  if (nextLessonItem) {
    selectLesson(nextLessonItem.lesson, nextLessonItem.book)
  }
}

// 播放随机课程
const playRandomLesson = () => {
  const allLessons = getAllLessons.value
  if (allLessons.length === 0) return

  let randomIndex = Math.floor(Math.random() * allLessons.length)
  // 避免连续播放同一首（如果课程数量大于1）
  if (allLessons.length > 1 && selectedLesson.value && allLessons[randomIndex].lesson.id === selectedLesson.value.id) {
    randomIndex = (randomIndex + 1) % allLessons.length
  }
  const randomLessonItem = allLessons[randomIndex]

  if (randomLessonItem) {
    selectLesson(randomLessonItem.lesson, randomLessonItem.book)
  }
}

// 监听选中课程变化
watch(selectedLesson, (newLesson) => {
  const audioPlayer = audioPlayerRef.value?.audioPlayer
  if (newLesson && audioPlayer) {
    audioPlayer.load()
  }
})

onMounted(async () => {
  // 加载课程数据
  await fetchLessons()
  
  // 默认展开第一册并选择第一个课程
  if (books.value.length > 0) {
    expandedBooks.value.push(books.value[0].id)
    if (books.value[0].lessons.length > 0) {
      selectLesson(books.value[0].lessons[0], books.value[0])
    }
  }
})
</script>

<style>
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #8b5cf6, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #7c3aed, #db2777);
}

/* 移动端滚动条隐藏 */
@media (max-width: 1024px) {
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
}

/* 文字渐变动画 */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background: linear-gradient(-45deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6);
  background-size: 400% 400%;
  animation: gradient-shift 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 毛玻璃效果增强 */
.glass-effect {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 移动端安全区域适配 */
@supports (padding: max(0px)) {
  .fixed.bottom-0 {
    padding-bottom: max(env(safe-area-inset-bottom), 0px);
  }
}

/* 触摸友好的按钮 */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 防止文本选择 */
.touch-manipulation {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>