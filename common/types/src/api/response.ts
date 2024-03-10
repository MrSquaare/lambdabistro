export type APIDataResponse<T = unknown> = {
  data: T;
  error?: undefined;
};

export type APIErrorResponse = {
  data?: undefined;
  error: string;
};

export type APIResponse<T = unknown> = {
  statusCode: number;
} & (APIDataResponse<T> | APIErrorResponse);

export type APIWSResponse<T = unknown> = {
  action: string;
} & (APIDataResponse<T> | APIErrorResponse);
