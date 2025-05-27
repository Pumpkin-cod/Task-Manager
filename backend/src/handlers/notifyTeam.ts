import { APIGatewayProxyHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';

const sns = new SNS();
const topicArn = process.env.NOTIFICATION_TOPIC_ARN;
if (!topicArn) {
  throw new Error('NOTIFICATION_TOPIC_ARN environment variable is not set');
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { message, subject, topicArn } = JSON.parse(event.body || '{}');

    if (!message || !topicArn) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message and topicArn are required' }),
      };
    }

    await sns
      .publish({
        Message: message,
        Subject: subject || 'Task Notification',
        TopicArn: topicArn,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not send notification' }),
    };
  }
};