import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = "Teams"; // ✅ Replace with your actual DynamoDB table name

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name, description, members } = body;

    if (!name || !Array.isArray(members)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Invalid input" }),
      };
    }

    const newTeam = {
      id: uuidv4(),
      name,
      description,
      members,
      createdAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: TABLE_NAME,
        Item: newTeam,
      })
      .promise();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Team created", team: newTeam }),
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Failed to create team" }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };
}
