// services/taskService.ts
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const TASKS_TABLE = process.env.TASKS_TABLE!;

export const createTask = async (task: any) => {
  const params = {
    TableName: TASKS_TABLE,
    Item: task,
  };
  await dynamoDb.put(params).promise();
  return task;
};

export const getTasks = async () => {
  const params = { TableName: TASKS_TABLE };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
};

export const updateTask = async (id: string, updates: any) => {
  const updateExp: string[] = [];
  const expAttrNames: Record<string, string> = {};
  const expAttrValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value], i) => {
    const attrName = `#attr${i}`;
    const attrValue = `:val${i}`;
    updateExp.push(`${attrName} = ${attrValue}`);
    expAttrNames[attrName] = key;
    expAttrValues[attrValue] = value;
  });

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: TASKS_TABLE,
    Key: { id },
    UpdateExpression: `set ${updateExp.join(', ')}, updatedAt = :updatedAt`,
    ExpressionAttributeNames: expAttrNames,
    ExpressionAttributeValues: {
      ...expAttrValues,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
};

export const deleteTask = async (id: string) => {
  const params = {
    TableName: TASKS_TABLE,
    Key: { id },
  };
  await dynamoDb.delete(params).promise();
};

export const saveTask = async (task: any) => {
    await dynamoDb.put({
      TableName: process.env.TASKS_TABLE!,
      Item: task,
    }).promise();
  };

export const getTaskById = async (id: string) => {
  const params = {
    TableName: TASKS_TABLE,
    Key: { id },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
}

export const updateAssignedTo = async (id: string, assignedTo: string) => {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.TASKS_TABLE!,
      Key: { id },
      UpdateExpression: 'set #assignedTo = :assignedTo, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#assignedTo': 'assignedTo',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':assignedTo': assignedTo,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };
  
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  };