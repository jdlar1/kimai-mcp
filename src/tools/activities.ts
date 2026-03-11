import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerActivityTools(server: McpServer): void {
  // --- List activities ---
  server.tool(
    "kimai-list-activities",
    "List activities. Supports filtering by project, visibility, global-only, and search.",
    {
      project: z.string().optional().describe("Project ID to filter by"),
      visible: z
        .enum(["1", "2", "3"])
        .optional()
        .describe("Visibility: 1=visible, 2=hidden, 3=all (default: 1)"),
      globals: z
        .enum(["0", "1"])
        .optional()
        .describe("Fetch only global activities: 1=yes, 0=no"),
      order: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction (default: ASC)"),
      orderBy: z
        .enum(["id", "name", "project"])
        .optional()
        .describe("Sort field (default: name)"),
      term: z.string().optional().describe("Free search term"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const params: Record<string, string> = {};
        for (const [key, value] of Object.entries(args)) {
          if (value !== undefined) params[key] = value;
        }
        const response = await getClient().get("/api/activities", { params });
        return response.data;
      });
    }
  );

  // --- Get activity ---
  server.tool(
    "kimai-get-activity",
    "Get a single activity by ID with full details.",
    {
      id: z.string().describe("Activity ID"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().get(`/api/activities/${args.id}`);
        return response.data;
      });
    }
  );

  // --- Create activity ---
  server.tool(
    "kimai-create-activity",
    "Create a new activity. Requires name. Optionally link to a project (otherwise it becomes a global activity).",
    {
      name: z.string().describe("Activity name (required)"),
      project: z
        .number()
        .optional()
        .describe("Project ID (omit for global activity)"),
      comment: z.string().optional().describe("Description/comment"),
      invoiceText: z.string().optional().describe("Invoice text"),
      color: z.string().optional().describe("Hex color code"),
      visible: z.boolean().optional().describe("Is visible (default: true)"),
      billable: z.boolean().optional().describe("Is billable (default: true)"),
      number: z.string().optional().describe("Activity number"),
      budget: z.number().optional().describe("Monetary budget"),
      timeBudget: z.string().optional().describe("Time budget (e.g. '100:00')"),
      budgetType: z
        .enum(["month"])
        .optional()
        .describe("Budget type: 'month' for monthly budget"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post("/api/activities", args);
        return response.data;
      });
    }
  );

  // --- Update activity ---
  server.tool(
    "kimai-update-activity",
    "Update an existing activity. Pass only the fields you want to change.",
    {
      id: z.string().describe("Activity ID to update"),
      name: z.string().optional().describe("Activity name"),
      project: z.number().optional().describe("Project ID"),
      comment: z.string().optional().describe("Description/comment"),
      invoiceText: z.string().optional().describe("Invoice text"),
      color: z.string().optional().describe("Hex color code"),
      visible: z.boolean().optional().describe("Is visible"),
      billable: z.boolean().optional().describe("Is billable"),
      number: z.string().optional().describe("Activity number"),
      budget: z.number().optional().describe("Monetary budget"),
      timeBudget: z.string().optional().describe("Time budget"),
      budgetType: z.enum(["month"]).optional().describe("Budget type"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const { id, ...body } = args;
        const response = await getClient().patch(`/api/activities/${id}`, body);
        return response.data;
      });
    }
  );
}
