import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = "Teams"; // ✅ Replace with your actual DynamoDB table name

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const result = await dynamoDb.scan({
      TableName: TABLE_NAME,
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ teams: result.Items }),
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Failed to fetch teams" }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
  };
}
