import { Client } from "@common/types";
import { Schema, model } from "mongoose";

export const ClientSchema = new Schema<Client>({
  id: {
    type: String,
    required: true,
  },
  wsConnectionId: {
    type: String,
    required: true,
  },
});

export const ClientModel = model("Client", ClientSchema);
