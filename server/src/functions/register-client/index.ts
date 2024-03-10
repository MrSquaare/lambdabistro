import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayEvent, ProxyHandler, ProxyResult } from "aws-lambda";
import mongoose from "mongoose";
import { getEnvs } from "../../utilities/env";
import { ClientModel } from "../../models/client";
import { v4 } from "uuid";

const mandatoryEnvs = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "APIGATEWAY_ENDPOINT",
  "MONGODB_URI",
] as const;

const handleConnect = async (
  apiGMAPI: ApiGatewayManagementApi,
  event: APIGatewayEvent,
): Promise<ProxyResult> => {
  const client = new ClientModel({
    id: v4(),
    wsConnectionId: event.requestContext.connectionId,
  });

  try {
    await client.save();
  } catch (error) {
    console.error("Error saving client", error);

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  console.log("Client connected", client);

  const response = {
    action: "connect",
    data: { client },
  };

  apiGMAPI.postToConnection({
    ConnectionId: event.requestContext.connectionId,
    Data: JSON.stringify(response),
  });

  return {
    statusCode: 200,
    body: "Connected",
  };
};

const handleDisconnect = async (
  event: APIGatewayEvent,
): Promise<ProxyResult> => {
  const client = await ClientModel.findOne({
    wsConnectionId: event.requestContext.connectionId,
  });

  if (!client) {
    return {
      statusCode: 404,
      body: "Client not found",
    };
  }

  try {
    await client.deleteOne();
  } catch (error) {
    console.error("Error removing client", error);

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  console.log("Client disconnected", client);

  return {
    statusCode: 200,
    body: "Disconnected",
  };
};

export const handler: ProxyHandler = async (event) => {
  const env = getEnvs(mandatoryEnvs);

  if (!env) {
    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  const apiGMAPI = new ApiGatewayManagementApi({
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.APIGATEWAY_ENDPOINT,
  });

  switch (event.requestContext.routeKey) {
    case "$connect": {
      return handleConnect(apiGMAPI, event);
    }
    case "$disconnect":
      return handleDisconnect(event);
    default:
      return {
        statusCode: 200,
        body: "Message processed",
      };
  }
};
