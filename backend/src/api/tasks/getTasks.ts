import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Optionally filter by assignedTo (for team members)
    const assignedTo = event.queryStringParameters?.assignedTo;

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.TASKS_TABLE!,
    };

    const data = await dynamoDb.scan(params).promise();
    let tasks = data.Items || [];

    // If assignedTo is provided, filter tasks
    if (assignedTo) {
      tasks = tasks.filter((task: any) => task.assignedTo === assignedTo);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch tasks' }),
    };
  }
};