import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || 'Users';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const params = {
      TableName: USERS_TABLE,
      FilterExpression: "#role = :roleVal",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":roleVal": "member",
      },
    };

    const data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ users: data.Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Failed to get users',
        error: (error as Error).message,
      }),
    };
  }
};
