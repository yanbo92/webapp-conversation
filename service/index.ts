import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'
import { post } from './base'
import { difyService } from './dify'
import type { Feedbacktype } from '@/types/app'

export const sendChatMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
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
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  const { conversation_id, query, inputs } = body
  return difyService.createMessage(
    conversation_id,
    query,
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
    },
    inputs,
  )
}

export const fetchConversations = async () => {
  return difyService.getConversations()
}

export const fetchChatList = async (conversationId: string) => {
  return difyService.getConversationMessages(conversationId)
}

// init value. wait for server update
export const fetchAppParams = async () => {
  return difyService.getParameters()
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  // TODO: Implement feedback in difyService if needed
  return post(url, { body })
}

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } })
}
