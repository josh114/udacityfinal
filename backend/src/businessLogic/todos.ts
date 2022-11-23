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
  logger.info('s3AttachmentUrl', s3AttachmentUrl)
  const newItem = {
    userId,
    todoId,
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
  userId: string,
  todoId: string
): Promise<void> {
  logger.info('Delete todo function invoked')
  return await todosAccess.deleteTodoItem(userId, todoId)
}

//wrrite upload url logic

export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<string> {
  logger.info('get attcahment url function invoked')
  return attachmentUtils.getUploadUrl(todoId) as string
}
