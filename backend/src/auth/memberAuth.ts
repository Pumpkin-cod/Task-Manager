import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Checks if the user is a team member based on a custom claim or group in the JWT token.
 * Assumes JWT claims are available in event.requestContext.authorizer.claims.
 */
export function isMember(event: APIGatewayProxyEvent): boolean {
  // Example: Cognito group claim
  const claims = (event.requestContext.authorizer as any)?.claims;
  const groups: string[] = claims?.['cognito:groups'] || [];

  // Adjust the group name as per your Cognito setup
  return groups.includes('member');
}