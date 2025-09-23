import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

/**
 * 获取课文内容与原始 LRC 内容
 * 路由: /api/text/[book]/[lesson]
 * - book: nce1 | nce2 | nce3 | nce4
 * - lesson: 课程编号（与文件名中的编号匹配）
 */
export default defineEventHandler(async (event) => {
  const book = getRouterParam(event, 'book')
  const lesson = getRouterParam(event, 'lesson')

  if (!book || !lesson) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book and lesson parameters are required'
    })
  }

  try {
    const bookNum = book.replace('nce', '')
    const bookDir = join(
      process.cwd(),
      'assert',
      `新概念英语第${bookNum}册美音（MP3+LRC）`,
      `NCE${bookNum}-美音-(MP3+LRC)`
    )

    if (!existsSync(bookDir)) {
      return { text: getSampleText(book, lesson) }
    }

    // 扫描目录查找匹配的 LRC 文件
    const files = readdirSync(bookDir)
    const lrcFiles = files.filter((file) => file.toLowerCase().endsWith('.lrc'))

    const matchedFile = findMatchingLrcFile(lrcFiles, lesson)

    if (matchedFile) {
      const lrcPath = join(bookDir, matchedFile)
      const lrcContent = readFileSync(lrcPath, 'utf-8')
      const text = parseLrcToText(lrcContent)

      return {
        text: text || getSampleText(book, lesson),
        lrcContent
      }
    }

    // 未匹配到 LRC 文件，返回示例文本
    return { text: getSampleText(book, lesson) }
  } catch (error) {
    console.error('读取课文失败:', error)
    return { text: getSampleText(book as string, lesson as string) }
  }
})

/** 尝试按多种规则匹配课程编号对应的 LRC 文件名 */
function findMatchingLrcFile(lrcFiles: string[], lesson: string): string | null {
  const lessonNum = parseInt(lesson, 10)
  if (Number.isNaN(lessonNum)) return null

  // 常见命名模式举例：
  // - "001&002－Excuse Me.lrc"
  // - "01－A Private Conversation.lrc"
  // - "07－Are You a Teacher.lrc"
  // - "099&100－Ow.lrc"
  const patterns = [
    new RegExp(`^${lessonNum.toString().padStart(3, '0')}&\\d{3}－`, 'i'),
    new RegExp(`^${lessonNum.toString().padStart(2, '0')}－`, 'i'),
    new RegExp(`^${lessonNum}－`, 'i'),
    new RegExp(`^0*${lessonNum}\\D`, 'i'),
    // 有些文件可能写作 "001&002－..." 或 "001＆002－..."（全角＆），兼容一下
    new RegExp(`^${lessonNum.toString().padStart(3, '0')}[&＆]\\d{3}－`, 'i')
  ]

  for (const file of lrcFiles) {
    if (patterns.some((p) => p.test(file))) {
      return file
    }
  }

  // 兜底：如果课程是奇数，尝试在组合文件中找到 "NNN&NNN+1"
  if (lessonNum % 2 === 1) {
    const pairPrefix = `${lessonNum.toString().padStart(3, '0')}&${(lessonNum + 1)
      .toString()
      .padStart(3, '0')}`
    const candidate = lrcFiles.find((f) => f.startsWith(pairPrefix))
    if (candidate) return candidate
  }

  return null
}

/** 将 LRC 内容解析为纯文本（按时间顺序拼接） */
function parseLrcToText(lrcContent: string): string {
  const lines = lrcContent.split('\n')
  const textLines: string[] = []

  for (const line of lines) {
    const match = line.match(/^\[\d{2}:\d{2}(?:\.\d{2})?\](.*)$/)
    if (match) {
      const text = match[1].trim()
      if (text) textLines.push(text)
    }
  }

  return textLines.join('\n')
}

/** 示例课文，用于找不到 LRC 文件时的兜底显示 */
function getSampleText(book: string, lesson: string): string {
  const sampleTexts: Record<string, Record<string, string>> = {
    nce1: {
      '1': `Excuse me!

Excuse me. Yes?
Is this your handbag? Pardon?
Is this your handbag? Yes, it is.
Thank you very much.`,
      '3': `Sorry, sir.

My coat and my umbrella please.
Here is my ticket. Thank you, sir.
Number five. Here's your umbrella and your coat.
This is not my umbrella. Sorry sir.
Is this your umbrella? No, it isn't.
Is this it? Yes, it is. Thank you very much.`
    },
    nce2: {
      '1': `A private conversation

Last week I went to the theatre. I had a very good seat. The play was very interesting...`,
      '2': `Breakfast or lunch?

It was Sunday. I never get up early on Sundays...`
    }
  }

  return sampleTexts[book]?.[lesson] || '课文内容暂未加载，请稍后重试。'
}