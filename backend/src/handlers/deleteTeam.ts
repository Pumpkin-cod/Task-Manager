// handlers/deleteTeam.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as teamController from '../controllers/teamController';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const teamId = event.pathParameters?.id;
    if (!teamId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team ID is required' }),
      };
    }

    await teamController.deleteTeam(teamId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Team deleted successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to delete team' }),
    };
  }
};
