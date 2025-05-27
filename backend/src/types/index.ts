export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ApiResponse<T = any> {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
  isBase64Encoded?: boolean;
  data?: T;
}