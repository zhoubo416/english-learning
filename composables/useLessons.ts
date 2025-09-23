export const useLessons = () => {
  const lessons = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const fetchLessons = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch('/api/lessons')
      lessons.value = data
    } catch (err) {
      error.value = err
      console.error('获取课程列表失败:', err)
    } finally {
      loading.value = false
    }
  }
  
  return {
    lessons: readonly(lessons),
    loading: readonly(loading),
    error: readonly(error),
    fetchLessons
  }
}