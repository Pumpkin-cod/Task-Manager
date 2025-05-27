import { APIGatewayProxyHandler } from 'aws-lambda';
import * as taskController from '../controllers/taskController';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const updatedTask = await taskController.assignTask(body);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedTask),
    };
  } catch (error: any) {
    return {
      statusCode: error.message === 'Task ID and assignedTo are required' ? 400 : 500,
      body: JSON.stringify({ error: error.message || 'Could not assign task' }),
    };
  }
};
