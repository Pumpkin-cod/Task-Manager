// handlers/getTeams.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as teamController from '../controllers/teamController';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (id) {
      const team = await teamController.getTeamById(id);
      return {
        statusCode: 200,
        body: JSON.stringify(team),
      };
    }

    const teams = await teamController.getTeams();

    return {
      statusCode: 200,
      body: JSON.stringify(teams),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch team(s)' }),
    };
  }
};
