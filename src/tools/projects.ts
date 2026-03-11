import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerProjectTools(server: McpServer): void {
  // --- List projects ---
  server.tool(
    "kimai-list-projects",
    "List projects. Supports filtering by customer, visibility, date range, and search.",
    {
      customer: z.string().optional().describe("Customer ID to filter by"),
      visible: z
        .enum(["1", "2", "3"])
        .optional()
        .describe("Visibility: 1=visible, 2=hidden, 3=all (default: 1)"),
      start: z
        .string()
        .optional()
        .describe("Only projects that started before this date"),
      end: z
        .string()
        .optional()
        .describe("Only projects that ended after this date"),
      ignoreDates: z
        .enum(["1"])
        .optional()
        .describe("Set to '1' to ignore start/end date filtering"),
      globalActivities: z
        .enum(["0", "1"])
        .optional()
        .describe("Filter by global activity support: 1=yes, 0=no"),
      order: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction (default: ASC)"),
      orderBy: z
        .enum(["id", "name", "customer"])
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
        const response = await getClient().get("/api/projects", { params });
        return response.data;
      });
    }
  );

  // --- Get project ---
  server.tool(
    "kimai-get-project",
    "Get a single project by ID with full details.",
    {
      id: z.string().describe("Project ID"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().get(`/api/projects/${args.id}`);
        return response.data;
      });
    }
  );

  // --- Create project ---
  server.tool(
    "kimai-create-project",
    "Create a new project. Requires name and customer ID.",
    {
      name: z.string().describe("Project name (required)"),
      customer: z.number().describe("Customer ID (required)"),
      comment: z.string().optional().describe("Description/comment"),
      orderNumber: z.string().optional().describe("Order number"),
      orderDate: z.string().optional().describe("Order date (YYYY-MM-DD)"),
      start: z.string().optional().describe("Project start date (YYYY-MM-DD)"),
      end: z.string().optional().describe("Project end date (YYYY-MM-DD)"),
      color: z.string().optional().describe("Hex color code"),
      visible: z.boolean().optional().describe("Is visible (default: true)"),
      billable: z.boolean().optional().describe("Is billable (default: true)"),
      globalActivities: z
        .boolean()
        .optional()
        .describe("Allow global activities (default: true)"),
      number: z.string().optional().describe("Project number"),
      budget: z.number().optional().describe("Monetary budget"),
      timeBudget: z.string().optional().describe("Time budget (e.g. '100:00')"),
      budgetType: z
        .enum(["month"])
        .optional()
        .describe("Budget type: 'month' for monthly budget"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post("/api/projects", args);
        return response.data;
      });
    }
  );

  // --- Update project ---
  server.tool(
    "kimai-update-project",
    "Update an existing project. Pass only the fields you want to change.",
    {
      id: z.string().describe("Project ID to update"),
      name: z.string().optional().describe("Project name"),
      customer: z.number().optional().describe("Customer ID"),
      comment: z.string().optional().describe("Description/comment"),
      orderNumber: z.string().optional().describe("Order number"),
      orderDate: z.string().optional().describe("Order date"),
      start: z.string().optional().describe("Start date"),
      end: z.string().optional().describe("End date"),
      color: z.string().optional().describe("Hex color code"),
      visible: z.boolean().optional().describe("Is visible"),
      billable: z.boolean().optional().describe("Is billable"),
      globalActivities: z.boolean().optional().describe("Allow global activities"),
      number: z.string().optional().describe("Project number"),
      budget: z.number().optional().describe("Monetary budget"),
      timeBudget: z.string().optional().describe("Time budget"),
      budgetType: z.enum(["month"]).optional().describe("Budget type"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const { id, ...body } = args;
        const response = await getClient().patch(`/api/projects/${id}`, body);
        return response.data;
      });
    }
  );
}
