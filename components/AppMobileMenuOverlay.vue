<template>
  <!-- 移动端遮罩 -->
  <div 
    v-if="mobileMenuOpen"
    @click="$emit('closeMobileMenu')"
    class="lg:hidden fixed inset-0 bg-black/50 z-30"
  ></div>
</template>

<script setup>
defineProps({
  mobileMenuOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['closeMobileMenu'])
</script>