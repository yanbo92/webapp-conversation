import type { AppInfo } from '@/types/app'

export const APP_ID = process.env.APP_ID || ''
export const API_KEY = process.env.API_KEY || ''
export const API_URL = process.env.API_URL || ''

export const APP_INFO: AppInfo = {
  title: process.env.APP_TITLE || 'Chat APP',
  description: process.env.APP_DESCRIPTION || '',
  copyright: process.env.APP_COPYRIGHT || '',
  privacy_policy: process.env.APP_PRIVACY_POLICY || '',
  default_language: process.env.DEFAULT_LANGUAGE || 'en',
}

export const isShowPrompt = process.env.SHOW_PROMPT === 'true'
export const promptTemplate = process.env.PROMPT_TEMPLATE || 'I want you to act as a javascript console.'

export const API_PREFIX = process.env.API_PREFIX || '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = parseInt(process.env.DEFAULT_VALUE_MAX_LEN || '48', 10)
