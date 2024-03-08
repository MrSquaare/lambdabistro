import { APIResponse, Dish } from "@common/types";
import { ProxyHandler } from "aws-lambda";

import dishes from "./dishes.json";

export const handler: ProxyHandler = async () => {
  const response: APIResponse<Dish[]> = {
    statusCode: 200,
    data: dishes,
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};
