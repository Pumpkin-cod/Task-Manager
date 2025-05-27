import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { title, description, assignedTo, deadline, status } = JSON.parse(event.body || '{}');
    const id = uuidv4();
    const newTask = {
      id,
      title,
      description,
      assignedTo,
      deadline,
      status: status || 'Pending',
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb.put({
      TableName: process.env.TASKS_TABLE!,
      Item: newTask,
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newTask),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create task' }),
    };
  }
};