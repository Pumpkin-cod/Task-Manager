// handlers/updateTeam.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as teamController from '../controllers/teamController';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team ID is required in the path' }),
      };
    }

    const updates = JSON.parse(event.body || '{}');

    const updatedTeam = await teamController.updateTeam(id, updates);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedTeam),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Could not update team' }),
    };
  }
};
