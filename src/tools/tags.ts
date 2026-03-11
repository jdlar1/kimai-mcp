import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerTagTools(server: McpServer): void {
  // --- List tags ---
  server.tool(
    "kimai-list-tags",
    "List all tags, optionally filtered by name.",
    {
      name: z.string().optional().describe("Filter tags by name (partial match)"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const params: Record<string, string> = {};
        if (args.name) params.name = args.name;
        const response = await getClient().get("/api/tags", { params });
        return response.data;
      });
    }
  );

  // --- Create tag ---
  server.tool(
    "kimai-create-tag",
    "Create a new tag. The tag name must not contain commas.",
    {
      name: z.string().describe("Tag name (required, no commas)"),
      color: z.string().optional().describe("Hex color code, e.g. '#ff0000'"),
      visible: z.boolean().optional().describe("Is visible (default: true)"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post("/api/tags", args);
        return response.data;
      });
    }
  );

  // --- Delete tag ---
  server.tool(
    "kimai-delete-tag",
    "Delete a tag by ID. This removes the tag from all associated entries.",
    {
      id: z.string().describe("Tag ID to delete"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(`/api/tags/${args.id}`);
        return { success: true, message: `Tag ${args.id} deleted.` };
      });
    }
  );
}
