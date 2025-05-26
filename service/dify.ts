import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import Cookies from 'js-cookie'
import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'
import { API_KEY, API_URL, APP_ID } from '@/config'

const userPrefix = `user_${APP_ID}:`

// Initialize the Dify client
const apiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
const client = new ChatClient(API_KEY, apiUrl)

// Get or create session ID
const getSessionId = (): string => {
    // Only access cookies on the client side
    if (typeof window === 'undefined') {
        // During static generation or server-side rendering
        return `static-${v4()}`
    }

    try {
        const storedSessionId = Cookies.get('session_id')
        const sessionId = storedSessionId || v4()
        if (!storedSessionId)
            Cookies.set('session_id', sessionId)

        return sessionId
    }
    catch (error) {
        // Fallback if cookie access fails
        return `fallback-${v4()}`
    }
}

// Get user ID from session
const getUserId = () => {
    const sessionId = getSessionId()
    return userPrefix + sessionId
}

// Service functions
export const difyService = {
    // Get conversation messages
    getConversationMessages: async (conversationId: string) => {
        const userId = getUserId()
        const { data } = await client.getConversationMessages(userId, conversationId)
        return data
    },

    // Create new message with streaming support
    createMessage: async (
        conversationId: string,
        message: string,
        {
            onData,
            onCompleted,
            onThought,
            onFile,
            onError,
            onMessageEnd,
            onMessageReplace,
            onWorkflowStarted,
            onNodeStarted,
            onNodeFinished,
            onWorkflowFinished,
        }: {
            onData: IOnData
            onCompleted: IOnCompleted
            onFile: IOnFile
            onThought: IOnThought
            onMessageEnd: IOnMessageEnd
            onMessageReplace: IOnMessageReplace
            onError: IOnError
            onWorkflowStarted: IOnWorkflowStarted
            onNodeStarted: IOnNodeStarted
            onNodeFinished: IOnNodeFinished
            onWorkflowFinished: IOnWorkflowFinished
        },
        query?: Record<string, any>,
    ) => {
        const userId = getUserId()
        try {
            const response = await client.createMessage(userId, {
                conversation_id: conversationId,
                inputs: query || {},
                query: message,
                response_mode: 'streaming',
            }, {
                onData: (data: string, isFirstMessage: boolean, moreInfo: any) => onData(data, isFirstMessage, moreInfo),
                onCompleted,
                onThought,
                onFile,
                onError,
                onMessageEnd,
                onMessageReplace,
                onWorkflowStarted,
                onNodeStarted,
                onNodeFinished,
                onWorkflowFinished,
            })
            return response
        }
        catch (error: any) {
            onError(error.message)
            throw error
        }
    },

    // Get conversation list
    getConversations: async () => {
        const userId = getUserId()
        const { data } = await client.getConversations(userId)
        return data
    },

    // Create new conversation
    createConversation: async () => {
        const userId = getUserId()
        const { data } = await client.createConversation(userId)
        return data
    },

    // Delete conversation
    deleteConversation: async (conversationId: string) => {
        const userId = getUserId()
        await client.deleteConversation(userId, conversationId)
    },

    // Get parameters (if needed)
    getParameters: async () => {
        const { data } = await client.getApplicationParameters()
        return data
    },
}
