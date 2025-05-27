// services/teamService.ts
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TEAMS_TABLE!;

interface Team {
  id: string;
  name: string;
  members: string[];
}

// Save a new team
export const saveTeam = async (team: Team): Promise<void> => {
  await dynamoDb.put({
    TableName: TABLE_NAME,
    Item: team,
  }).promise();
};

// Get all teams
export const getTeams = async (): Promise<Team[]> => {
  const result = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
  return (result.Items as Team[]) || [];
};

// Get team by ID
export const getTeamById = async (id: string): Promise<Team | undefined> => {
  const result = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: { id },
  }).promise();

  return result.Item as Team | undefined;
};

// Update team name and/or members
export const updateTeam = async (
  id: string,
  updates: Partial<Pick<Team, 'name' | 'members'>>
): Promise<Team | undefined> => {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  if (updates.name) {
    updateExpressions.push('#name = :name');
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = updates.name;
  }

  if (updates.members) {
    updateExpressions.push('#members = :members');
    expressionAttributeNames['#members'] = 'members';
    expressionAttributeValues[':members'] = updates.members;
  }

  if (updateExpressions.length === 0) {
    throw new Error('No valid fields provided for update');
  }

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET ' + updateExpressions.join(', '),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes as Team;
};

// Delete a team
export const deleteTeam = async (id: string): Promise<void> => {
  await dynamoDb.delete({
    TableName: TABLE_NAME,
    Key: { id },
  }).promise();
};
