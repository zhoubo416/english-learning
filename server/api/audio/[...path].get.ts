import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required'
    })
  }
  
  // 构建音频文件路径
  const audioPath = join(process.cwd(), 'assert', decodeURIComponent(path))
  
  if (!existsSync(audioPath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Audio file not found'
    })
  }
  
  // 设置响应头
  setHeader(event, 'Content-Type', 'audio/mpeg')
  setHeader(event, 'Accept-Ranges', 'bytes')
  
  // 返回音频流
  return sendStream(event, createReadStream(audioPath))
})