import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerTimesheetTools(server: McpServer): void {
  // --- List timesheets ---
  server.tool(
    "kimai-list-timesheets",
    "List and filter timesheet entries. Supports filtering by user, customer, project, activity, date range, running/stopped state, billable status, tags, and full text search. Results are paginated.",
    {
      user: z.string().optional().describe("User ID to filter by"),
      customer: z.string().optional().describe("Customer ID to filter by"),
      project: z.string().optional().describe("Project ID to filter by"),
      activity: z.string().optional().describe("Activity ID to filter by"),
      active: z
        .enum(["1", "0"])
        .optional()
        .describe("Filter: 1=running, 0=stopped"),
      billable: z
        .enum(["1", "0"])
        .optional()
        .describe("Filter: 1=billable, 0=not billable"),
      exported: z
        .enum(["1", "0"])
        .optional()
        .describe("Filter: 1=exported, 0=not exported"),
      begin: z
        .string()
        .optional()
        .describe("Only entries after this date-time (YYYY-MM-DDThh:mm:ss)"),
      end: z
        .string()
        .optional()
        .describe("Only entries before this date-time (YYYY-MM-DDThh:mm:ss)"),
      page: z.string().optional().describe("Page number (default: 1)"),
      size: z
        .string()
        .optional()
        .describe("Entries per page (default: 50)"),
      tags: z
        .string()
        .optional()
        .describe("Comma-separated list of tag names"),
      orderBy: z
        .enum(["id", "begin", "end", "rate"])
        .optional()
        .describe("Field to order by (default: begin)"),
      order: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction (default: DESC)"),
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
        const response = await getClient().get("/api/timesheets", { params });
        return response.data;
      });
    }
  );

  // --- Get single timesheet ---
  server.tool(
    "kimai-get-timesheet",
    "Get a single timesheet entry by ID.",
    {
      id: z.string().describe("Timesheet ID"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().get(`/api/timesheets/${args.id}`);
        return response.data;
      });
    }
  );

  // --- Create timesheet ---
  server.tool(
    "kimai-create-timesheet",
    "Create a new timesheet entry. Requires project and activity. If no begin is set, starts now. If no end is set, the timesheet will be running (active timer).",
    {
      project: z.number().describe("Project ID (required)"),
      activity: z.number().describe("Activity ID (required)"),
      begin: z
        .string()
        .optional()
        .describe("Start date-time (YYYY-MM-DDThh:mm:ss). Defaults to now."),
      end: z
        .string()
        .optional()
        .describe(
          "End date-time (YYYY-MM-DDThh:mm:ss). Omit to start a running timer."
        ),
      description: z.string().optional().describe("Description of the work"),
      tags: z
        .string()
        .optional()
        .describe("Comma-separated list of tags"),
      user: z
        .number()
        .optional()
        .describe("User ID (admin only, defaults to current user)"),
      fixedRate: z.number().optional().describe("Fixed rate override"),
      hourlyRate: z.number().optional().describe("Hourly rate override"),
      exported: z.boolean().optional().describe("Mark as exported"),
      billable: z.boolean().optional().describe("Mark as billable"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post("/api/timesheets", args);
        return response.data;
      });
    }
  );

  // --- Update timesheet ---
  server.tool(
    "kimai-update-timesheet",
    "Update an existing timesheet entry. Pass only the fields you want to change.",
    {
      id: z.string().describe("Timesheet ID to update"),
      project: z.number().optional().describe("Project ID"),
      activity: z.number().optional().describe("Activity ID"),
      begin: z.string().optional().describe("Start date-time"),
      end: z.string().optional().describe("End date-time"),
      description: z.string().optional().describe("Description"),
      tags: z.string().optional().describe("Comma-separated tags"),
      user: z.number().optional().describe("User ID (admin only)"),
      fixedRate: z.number().optional().describe("Fixed rate"),
      hourlyRate: z.number().optional().describe("Hourly rate"),
      exported: z.boolean().optional().describe("Export state"),
      billable: z.boolean().optional().describe("Billable state"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const { id, ...body } = args;
        const response = await getClient().patch(
          `/api/timesheets/${id}`,
          body
        );
        return response.data;
      });
    }
  );

  // --- Delete timesheet ---
  server.tool(
    "kimai-delete-timesheet",
    "Delete a timesheet entry by ID. This action is irreversible.",
    {
      id: z.string().describe("Timesheet ID to delete"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(`/api/timesheets/${args.id}`);
        return { success: true, message: `Timesheet ${args.id} deleted.` };
      });
    }
  );

  // --- Get active (running) timesheets ---
  server.tool(
    "kimai-get-active-timesheets",
    "Get all currently running (active) timesheet entries for the current user.",
    {},
    async () => {
      return handleApiCall(async () => {
        const response = await getClient().get("/api/timesheets/active");
        return response.data;
      });
    }
  );

  // --- Stop a running timesheet ---
  server.tool(
    "kimai-stop-timesheet",
    "Stop a currently running timesheet entry. Sets the end time to now.",
    {
      id: z.string().describe("Timesheet ID to stop"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().patch(
          `/api/timesheets/${args.id}/stop`
        );
        return response.data;
      });
    }
  );

  // --- Restart a timesheet ---
  server.tool(
    "kimai-restart-timesheet",
    "Restart a previously stopped timesheet entry. Creates a new running timesheet based on the original.",
    {
      id: z.string().describe("Timesheet ID to restart"),
      copy: z
        .enum(["all"])
        .optional()
        .describe("Set to 'all' to copy all fields from the original entry"),
      begin: z
        .string()
        .optional()
        .describe("Custom begin date-time for the restarted entry"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const { id, ...body } = args;
        const response = await getClient().patch(
          `/api/timesheets/${id}/restart`,
          body
        );
        return response.data;
      });
    }
  );

  // --- Duplicate a timesheet ---
  server.tool(
    "kimai-duplicate-timesheet",
    "Duplicate a timesheet entry. Creates a copy with export state reset.",
    {
      id: z.string().describe("Timesheet ID to duplicate"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().patch(
          `/api/timesheets/${args.id}/duplicate`
        );
        return response.data;
      });
    }
  );

  // --- Get recent timesheet activities ---
  server.tool(
    "kimai-get-recent-timesheets",
    "Get the most recent timesheet entries (useful for quick time entry). Returns a short list of recent activity combinations.",
    {
      user: z
        .string()
        .optional()
        .describe("User ID (admin only, defaults to current user)"),
      begin: z.string().optional().describe("Filter by start date"),
      size: z
        .string()
        .optional()
        .describe("Number of recent entries to return (default: 10)"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const params: Record<string, string> = {};
        for (const [key, value] of Object.entries(args)) {
          if (value !== undefined) params[key] = value;
        }
        const response = await getClient().get("/api/timesheets/recent", {
          params,
        });
        return response.data;
      });
    }
  );
}
