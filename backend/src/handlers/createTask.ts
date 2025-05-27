import { APIGatewayProxyHandler } from 'aws-lambda';
import * as taskController from '../controllers/taskController';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const taskData = JSON.parse(event.body || '{}');
    const newTask = await taskController.createTask(taskData);

    return {
      statusCode: 201,
      body: JSON.stringify(newTask),
    };
  } catch (error: any) {
    return {
      statusCode: error.message === 'Title, assignedTo, and deadline are required' ? 400 : 500,
      body: JSON.stringify({ error: error.message || 'Could not create task' }),
    };
  }
};
