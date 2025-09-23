<template>
  <!-- 移动端汉堡菜单按钮 -->
  <button
    @click="$emit('toggleMobileMenu')"
    class="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 touch-manipulation"
  >
    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </button>

  <!-- 左侧目录 -->
  <div :class="[
    'lg:w-1/3 bg-black/30 backdrop-blur-xl border-r border-white/10 overflow-y-auto absolute z-40 transition-transform duration-300',
    'lg:translate-x-0',
    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
    'fixed lg:relative inset-y-0 left-0 w-80 lg:w-auto'
  ]">
    <div class="p-4 lg:p-6 border-b border-white/10">
      <div class="flex items-center justify-between lg:block">
        <div>
          <h1 class="text-xl lg:text-2xl font-bold text-white">新概念英语</h1>
          <p class="text-gray-300 mt-1 lg:mt-2 text-sm lg:text-base">选择课程开始学习</p>
        </div>
        <!-- 移动端关闭按钮 -->
        <button
          @click="$emit('toggleMobileMenu')"
          class="lg:hidden w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white touch-manipulation"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="p-3 lg:p-4">
      <div v-if="booksLoading" class="text-center py-8">
        <p class="text-gray-400 text-sm lg:text-base">正在加载课程...</p>
      </div>
      
      <div v-else-if="books.length === 0" class="text-center py-8">
        <p class="text-gray-400 text-sm lg:text-base">未找到课程文件</p>
      </div>
      
      <div v-else v-for="book in books" :key="book.id" class="mb-4 lg:mb-6">
        <div 
          @click="$emit('toggleBook', book.id)"
          class="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 cursor-pointer hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm touch-manipulation"
        >
          <h2 class="text-base lg:text-lg font-semibold text-white">
            {{ book.title }}
          </h2>
          <svg 
            :class="['w-5 h-5 text-gray-300 transition-transform duration-200', { 'rotate-90': expandedBooks.includes(book.id) }]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        
        <div v-show="expandedBooks.includes(book.id)" class="space-y-1 lg:space-y-2 mt-2 lg:mt-3 ml-2 lg:ml-4">
          <div
            v-for="lesson in book.lessons"
            :key="lesson.id"
            @click="$emit('selectLesson', lesson, book); $emit('closeMobileMenu')"
            :class="[
              'px-3 lg:px-4 py-2 lg:py-3 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation',
              selectedLesson?.id === lesson.id && selectedBook?.id === book.id
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 text-white'
                : 'hover:bg-white/5 text-gray-300 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-sm lg:text-base truncate pr-2">{{ lesson.title }}</span>
              <span class="text-xs lg:text-sm opacity-70 flex-shrink-0">{{ lesson.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  books: {
    type: Array,
    required: true
  },
  booksLoading: {
    type: Boolean,
    required: true
  },
  selectedLesson: {
    type: Object,
    default: null
  },
  selectedBook: {
    type: Object,
    default: null
  },
  expandedBooks: {
    type: Array,
    required: true
  },
  mobileMenuOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggleBook', 'selectLesson', 'toggleMobileMenu', 'closeMobileMenu'])
</script>