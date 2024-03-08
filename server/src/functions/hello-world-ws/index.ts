import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { ProxyHandler } from "aws-lambda";
import mongoose from "mongoose";

export const handler: ProxyHandler = async (event) => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not set");

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  if (!process.env.APIGATEWAY_ENDPOINT) {
    console.error("APIGATEWAY_ENDPOINT is not set");

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  const apiGMAPI = new ApiGatewayManagementApi({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.APIGATEWAY_ENDPOINT,
  });

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set");

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  switch (event.requestContext.routeKey) {
    case "$connect":
      console.log("Connect", event.body);
      break;
    case "$disconnect":
      console.log("Disconnect", event.body);
      break;
    case "$default":
    default:
      console.log("Default", event.body);
      apiGMAPI.postToConnection({
        ConnectionId: event.requestContext.connectionId,
        Data: "Hello, world!",
      });
      break;
  }

  return {
    statusCode: 200,
    body: "Message processed",
  };
};
