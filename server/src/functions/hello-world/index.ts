import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello, world!",
        input: event,
      },
      null,
      2,
    ),
  };
};
