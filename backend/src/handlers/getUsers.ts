import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || 'Users';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const params = {
            TableName: USERS_TABLE,
        };

        const data = await dynamoDb.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ users: data.Items }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to get users', error: (error as Error).message }),
        };
    }
};