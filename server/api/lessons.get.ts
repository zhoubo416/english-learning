import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'

interface Lesson {
  id: string
  title: string
  duration: string
  book: string
  audioUrl: string
  lessonNumber: number
}

interface Book {
  id: number
  title: string
  lessons: Lesson[]
}

export default defineEventHandler(async (event) => {
  const assertPath = join(process.cwd(), 'assert')
  
  if (!existsSync(assertPath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Assert directory not found'
    })
  }
  
  const books: Book[] = []
  
  try {
    const bookDirs = readdirSync(assertPath).filter(dir => {
      const fullPath = join(assertPath, dir)
      return statSync(fullPath).isDirectory() && dir.includes('新概念英语')
    })
    
    for (const bookDir of bookDirs) {
      const bookPath = join(assertPath, bookDir)
      const bookNumber = extractBookNumber(bookDir)
      
      if (!bookNumber) continue
      
      const lessons: Lesson[] = []
      const subDirs = readdirSync(bookPath)
      
      for (const subDir of subDirs) {
        const subDirPath = join(bookPath, subDir)
        if (statSync(subDirPath).isDirectory()) {
          const files = readdirSync(subDirPath)
          const mp3Files = files.filter(file => extname(file).toLowerCase() === '.mp3')
          
          for (const mp3File of mp3Files) {
            const lessonNumber = extractLessonNumber(mp3File)
            if (lessonNumber) {
              // 使用文件名（去掉扩展名）作为标题
              const fileTitle = basename(mp3File, '.mp3')
              lessons.push({
                id: lessonNumber.toString(),
                title: fileTitle,
                duration: '',
                book: `第${bookNumber}册`,
                audioUrl: `/api/audio/${encodeURIComponent(join(bookDir, subDir, mp3File))}`,
                lessonNumber
              })
            }
          }
        }
      }
      
      // 按课程编号排序
      lessons.sort((a, b) => a.lessonNumber - b.lessonNumber)
      
      books.push({
        id: bookNumber,
        title: `新概念英语第${bookNumber}册`,
        lessons
      })
    }
    
    // 按册数排序
    books.sort((a, b) => a.id - b.id)
    
    return books
  } catch (error) {
    console.error('读取课程目录失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read lessons directory'
    })
  }
})

function extractBookNumber(dirName: string): number | null {
  const match = dirName.match(/第(\d+)册/)
  return match ? parseInt(match[1]) : null
}

function extractLessonNumber(fileName: string): number | null {
  // 尝试多种文件名格式
  const patterns = [
    /lesson[\s_-]*(\d+)/i,
    /第(\d+)课/,
    /(\d+)\.mp3$/i,
    /^(\d+)/
  ]
  
  for (const pattern of patterns) {
    const match = fileName.match(pattern)
    if (match) {
      return parseInt(match[1])
    }
  }
  
  return null
}

// 移除 getLessonTitle 函数，直接使用文件名