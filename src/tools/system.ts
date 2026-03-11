import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerSystemTools(server: McpServer): void {
  // --- Ping ---
  server.tool(
    "kimai-ping",
    "Test the Kimai API connection. Returns 'pong' if successful.",
    {},
    async () => {
      return handleApiCall(async () => {
        const response = await getClient().get("/api/ping");
        return response.data;
      });
    }
  );

  // --- Get version ---
  server.tool(
    "kimai-get-version",
    "Get the Kimai instance version, environment, and edition information.",
    {},
    async () => {
      return handleApiCall(async () => {
        const response = await getClient().get("/api/version");
        return response.data;
      });
    }
  );

  // --- Get timesheet config ---
  server.tool(
    "kimai-get-timesheet-config",
    "Get the Kimai instance timesheet configuration (tracking mode, rounding rules, defaults, etc.).",
    {},
    async () => {
      return handleApiCall(async () => {
        const response = await getClient().get("/api/config/timesheet");
        return response.data;
      });
    }
  );
}
