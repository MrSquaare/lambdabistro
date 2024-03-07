import { API_BASE_URL } from "~/constants/api";

export type HelloWorldResponse = {
  message: string;
  input: Record<string, unknown>;
};

export const fetchHelloWorld = async (): Promise<HelloWorldResponse> => {
  const response = await fetch(`${API_BASE_URL}/hello-world`);

  return response.json();
};
