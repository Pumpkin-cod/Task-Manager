import { SNS } from 'aws-sdk';

/**
 * Sends a notification to an SNS topic.
 * @param topicArn - The ARN of the SNS topic.
 * @param message - The message to send.
 * @param subject - The subject of the notification (optional).
 */
export async function sendNotification(
  topicArn: string,
  message: string,
  subject?: string
): Promise<void> {
  const sns = new SNS();
  await sns
    .publish({
      TopicArn: topicArn,
      Message: message,
      Subject: subject || 'Task Notification',
    })
    .promise();
}