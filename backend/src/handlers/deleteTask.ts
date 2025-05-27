import { APIGatewayProxyHandler } from 'aws-lambda';
import * as taskController from '../controllers/taskController';

// Helper to generate CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or restrict to 'http://localhost:5173'
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight OK' }),
    };
  }

  try {
    const taskId = event.pathParameters?.id;
    if (!taskId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Task ID is required' }),
      };
    }

    await taskController.deleteTask(taskId);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Task deleted successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Failed to delete task' }),
    };
  }
};
