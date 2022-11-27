import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate'
// import * as createError from 'http-errors'

// implement logi

const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET

//implement get todos function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Get todos for user function')
  return todosAccess.getAllTodos(userId)
}

//write create todo fucntion

export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Create todo funnction called')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const attachmentUrl = ''
  logger.info('s3AttachmentUrl', s3AttachmentUrl)
  const newItem = {
    userId,
    todoId,
    attachmentUrl,
    createdAt,
    done: false,
    ...newTodo
  }
  return await todosAccess.createTodoItem(newItem)
}

//implement updateTodo logic

export async function updateTodo(
  todoId: string,
  todoUpdate: UpdateTodoRequest,
  userId: string
): Promise<TodoUpdate> {
  logger.info('logger todo function')
  const updateAction = await todosAccess.updateTodoItem(
    todoId,
    userId,
    todoUpdate
  )
  return updateAction
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  logger.info('Delete todo function invoked')
  return await todosAccess.deleteTodoItem(todoId, userId)
}

//wrrite upload url logic

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('get attcahment url function invoked', userId)
  return attachmentUtils.getUploadUrl(todoId) as string
}

//write update attachment function
export async function updateAttachmentUrl(
  todoId: string,
  userId: string
): Promise<void> {
  logger.info('Update dynamo db with attachment Url')
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  return await todosAccess.updateTodoAttachmentUrl(
    todoId,
    userId,
    attachmentUrl
  )
}
