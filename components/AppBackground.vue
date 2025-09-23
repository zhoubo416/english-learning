<template>
  <!-- 动态背景 -->
  <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
  <div class="absolute inset-0 opacity-20">
    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
  </div>
  
  <!-- 浮动音符动画 -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="floating-note note-1">♪</div>
    <div class="floating-note note-2">♫</div>
    <div class="floating-note note-3">♪</div>
    <div class="floating-note note-4">♬</div>
    <div class="floating-note note-5">♩</div>
  </div>
</template>

<style scoped>
/* 浮动音符动画 */
.floating-note {
  position: absolute;
  font-size: 2rem;
  color: rgba(139, 92, 246, 0.3);
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

.note-1 {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.note-2 {
  top: 20%;
  right: 20%;
  animation-delay: 2s;
  animation-duration: 10s;
}

.note-3 {
  top: 60%;
  left: 10%;
  animation-delay: 4s;
  animation-duration: 7s;
}

.note-4 {
  top: 70%;
  right: 15%;
  animation-delay: 1s;
  animation-duration: 9s;
}

.note-5 {
  top: 40%;
  left: 50%;
  animation-delay: 3s;
  animation-duration: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) rotate(2deg);
    opacity: 0.6;
  }
}

/* 移动端优化 */
@media (max-width: 1024px) {
  .floating-note {
    font-size: 1.5rem;
  }
}
</style>