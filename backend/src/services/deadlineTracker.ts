import { DynamoDB } from 'aws-sdk';
import { Task } from '../models/task';

const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Finds tasks that are overdue (deadline before today and not completed).
 */
export async function getOverdueTasks(tableName: string): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0];

  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
    FilterExpression: '#deadline < :today AND #status <> :completed',
    ExpressionAttributeNames: {
      '#deadline': 'deadline',
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':today': today,
      ':completed': 'Completed',
    },
  };

  const data = await dynamoDb.scan(params).promise();
  return (data.Items as Task[]) || [];
}