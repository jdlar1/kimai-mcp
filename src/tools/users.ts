import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerUserTools(server: McpServer): void {
  // --- List users ---
  server.tool(
    "kimai-list-users",
    "List users. Requires 'view_user' permission. Supports filtering by visibility, search, and sorting.",
    {
      visible: z
        .enum(["1", "2", "3"])
        .optional()
        .describe("Visibility: 1=visible, 2=hidden, 3=all (default: 1)"),
      orderBy: z
        .enum(["id", "username", "alias", "email"])
        .optional()
        .describe("Sort field (default: username)"),
      order: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction (default: ASC)"),
      term: z.string().optional().describe("Free search term"),
      full: z
        .enum(["true", "false"])
        .optional()
        .describe("Fetch full objects including subresources"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const params: Record<string, string> = {};
        for (const [key, value] of Object.entries(args)) {
          if (value !== undefined) params[key] = value;
        }
        const response = await getClient().get("/api/users", { params });
        return response.data;
      });
    }
  );

  // --- Get user ---
  server.tool(
    "kimai-get-user",
    "Get a single user by ID. Requires 'view_user' permission.",
    {
      id: z.string().describe("User ID"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().get(`/api/users/${args.id}`);
        return response.data;
      });
    }
  );

  // --- Get current user ---
  server.tool(
    "kimai-get-me",
    "Get the currently authenticated user's profile. Useful to check your identity, permissions, and preferences.",
    {},
    async () => {
      return handleApiCall(async () => {
        const response = await getClient().get("/api/users/me");
        return response.data;
      });
    }
  );
}
