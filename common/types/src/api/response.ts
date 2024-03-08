export type APIResponse<T = unknown> = {
  statusCode: number;
  data: T;
};
