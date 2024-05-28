import { v4 as uuidv4 } from 'uuid'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoImage
} from '../dataLayer/todosAccess.mjs'
import { generateImageUrl } from '../fileStorage/attachmentUtils.mjs'

export const getTodosBusiness = async (userId) => {
  const result = await getTodos(userId)
  return result
}

export const createTodoBusiness = async (userId, item) => {
  const createdAt = new Date().toISOString()
  const newTodo = {
    ...item,
    userId,
    todoId: uuidv4(),
    createdAt
  }
  const result = await createTodo(newTodo)
  return result
}

export const updateTodoBusiness = async (userId, todoId, item) => {
  await updateTodo(userId, todoId, item)
}

export const deleteTodoBusiness = async (userId, todoId) => {
  await deleteTodo(userId, todoId)
}

export const generateImageUrlBusiness = async (userId, todoId) => {
  const imageId = uuidv4()
  const { presignedUrl, imageUrl } = await generateImageUrl(imageId)
  await updateTodoImage(userId, todoId, imageUrl)
  return presignedUrl
}
