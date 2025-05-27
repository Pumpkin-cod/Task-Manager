import { APIGatewayProxyHandler } from 'aws-lambda';
// Update the import path if the file is located elsewhere, for example:
import * as taskController from '../controllers/taskController';
// Or, if the file does not exist, create 'taskController.ts' in the correct directory.

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const assignedTo = event.queryStringParameters?.assignedTo;
    const tasks = await taskController.getTasks();

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Could not fetch tasks' }),
    };
  }
};
