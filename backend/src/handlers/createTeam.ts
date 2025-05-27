// handlers/createTeam.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as teamController from '../controllers/teamController';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { name, members } = JSON.parse(event.body || '{}');

    if (!name || !Array.isArray(members)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team name and members array are required' }),
      };
    }

    const createdTeam = await teamController.createTeam({ name, members });

    return {
      statusCode: 201,
      body: JSON.stringify(createdTeam),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Could not create team' }),
    };
  }
};
