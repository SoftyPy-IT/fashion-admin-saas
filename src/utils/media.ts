import { configureMediaService, getMediaService } from "softypy-media-service";

configureMediaService({
  baseUrl: "https://media.neelabh.com.bd/api/v1/media",
  apiKey: "27630336ccbaa1c735968a35471c6f4a5df7810f536314140ceb7d1eeec0b77b",
});

export const mediaService = getMediaService();
