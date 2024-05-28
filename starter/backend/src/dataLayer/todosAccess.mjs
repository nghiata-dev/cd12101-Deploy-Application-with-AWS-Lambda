import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const dynamoDB = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDB)
const dynamodbClient = DynamoDBDocument.from(dynamoDbXRay)

export const todosTable = process.env.TODOS_TABLE

export const getTodos = async (userId) => {
  createLogger('Get all todos')
  const result = await dynamodbClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :i',
    ExpressionAttributeValues: {
      ':i': userId
    },
    ScanIndexForward: false
  })
  const items = result.Items
  return items
}

export const createTodo = async (item) => {
  createLogger(`Create todo with todoId ${item.todoId}`)

  await dynamodbClient.put({
    TableName: todosTable,
    Item: item
  })
  return item
}

export const updateTodo = async (userId, todoId, item) => {
  createLogger(`Update a todo with todoId ${todoId}`)

  await dynamodbClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': item.name,
      ':dueDate': item.dueDate,
      ':done': item.done
    }
  })
}

export const deleteTodo = async (userId, todoId) => {
  createLogger(`Delete a todo with todoId ${todoId}`)

  await dynamodbClient.delete({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    }
  })
}

export const updateTodoImage = async (userId, todoId, uploadUrl) => {
  await dynamodbClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
    ExpressionAttributeNames: {
      '#attachmentUrl': 'attachmentUrl'
    },
    ExpressionAttributeValues: {
      ':attachmentUrl': uploadUrl
    }
  })
}
