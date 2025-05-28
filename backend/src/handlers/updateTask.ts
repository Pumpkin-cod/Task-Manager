import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH,PUT,DELETE',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const { id, title, description, assignedTo, deadline, status } = JSON.parse(event.body || '{}');

    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Task ID is required' }),
      };
    }

    // Dynamically build the update expression depending on which fields are provided
    let updateExpression = 'set ';
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (title !== undefined) {
      updateExpression += '#title = :title, ';
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeValues[':title'] = title;
    }
    if (description !== undefined) {
      updateExpression += '#description = :description, ';
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = description;
    }
    if (assignedTo !== undefined) {
      updateExpression += '#assignedTo = :assignedTo, ';
      expressionAttributeNames['#assignedTo'] = 'assignedTo';
      expressionAttributeValues[':assignedTo'] = assignedTo;
    }
    if (deadline !== undefined) {
      updateExpression += '#deadline = :deadline, ';
      expressionAttributeNames['#deadline'] = 'deadline';
      expressionAttributeValues[':deadline'] = deadline;
    }
    if (status !== undefined) {
      updateExpression += '#status = :status, ';
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }

    // Always update updatedAt
    updateExpression += '#updatedAt = :updatedAt';
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.TASKS_TABLE!,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Update error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Could not update task' }),
    };
  }
};
