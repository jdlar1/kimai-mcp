import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerTeamTools(server: McpServer): void {
  // --- List teams ---
  server.tool(
    "kimai-list-teams",
    "List all teams. Requires 'view_team' permission.",
    {},
    async () => {
      return handleApiCall(async () => {
        const response = await getClient().get("/api/teams");
        return response.data;
      });
    }
  );

  // --- Get team ---
  server.tool(
    "kimai-get-team",
    "Get a single team by ID with full details including members and assigned entities.",
    {
      id: z.string().describe("Team ID"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().get(`/api/teams/${args.id}`);
        return response.data;
      });
    }
  );

  // --- Create team ---
  server.tool(
    "kimai-create-team",
    "Create a new team. Requires a name and at least one member.",
    {
      name: z.string().describe("Team name (required)"),
      color: z.string().optional().describe("Hex color code"),
      members: z
        .array(
          z.object({
            user: z.number().describe("User ID"),
            teamlead: z
              .boolean()
              .optional()
              .describe("Whether this user is a team lead"),
          })
        )
        .describe("Array of team members (at least one required)"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post("/api/teams", args);
        return response.data;
      });
    }
  );

  // --- Update team ---
  server.tool(
    "kimai-update-team",
    "Update an existing team. Pass name, color, and/or the full members list. Note: members array replaces all existing members.",
    {
      id: z.string().describe("Team ID to update"),
      name: z.string().optional().describe("Team name"),
      color: z.string().optional().describe("Hex color code"),
      members: z
        .array(
          z.object({
            user: z.number().describe("User ID"),
            teamlead: z.boolean().optional().describe("Is team lead"),
          })
        )
        .optional()
        .describe("Full members list (replaces existing)"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const { id, ...body } = args;
        const response = await getClient().patch(`/api/teams/${id}`, body);
        return response.data;
      });
    }
  );

  // --- Delete team ---
  server.tool(
    "kimai-delete-team",
    "Delete a team by ID.",
    {
      id: z.string().describe("Team ID to delete"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(`/api/teams/${args.id}`);
        return { success: true, message: `Team ${args.id} deleted.` };
      });
    }
  );

  // --- Add member to team ---
  server.tool(
    "kimai-add-team-member",
    "Add a user to an existing team.",
    {
      id: z.string().describe("Team ID"),
      userId: z.string().describe("User ID to add"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post(
          `/api/teams/${args.id}/members/${args.userId}`
        );
        return response.data;
      });
    }
  );

  // --- Remove member from team ---
  server.tool(
    "kimai-remove-team-member",
    "Remove a user from an existing team.",
    {
      id: z.string().describe("Team ID"),
      userId: z.string().describe("User ID to remove"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(
          `/api/teams/${args.id}/members/${args.userId}`
        );
        return {
          success: true,
          message: `User ${args.userId} removed from team ${args.id}.`,
        };
      });
    }
  );

  // --- Grant team access to customer ---
  server.tool(
    "kimai-add-team-customer",
    "Grant a team access to a customer.",
    {
      id: z.string().describe("Team ID"),
      customerId: z.string().describe("Customer ID to grant access to"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post(
          `/api/teams/${args.id}/customers/${args.customerId}`
        );
        return response.data;
      });
    }
  );

  // --- Revoke team access to customer ---
  server.tool(
    "kimai-remove-team-customer",
    "Revoke a team's access to a customer.",
    {
      id: z.string().describe("Team ID"),
      customerId: z.string().describe("Customer ID to revoke access from"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(
          `/api/teams/${args.id}/customers/${args.customerId}`
        );
        return {
          success: true,
          message: `Team ${args.id} access revoked from customer ${args.customerId}.`,
        };
      });
    }
  );

  // --- Grant team access to project ---
  server.tool(
    "kimai-add-team-project",
    "Grant a team access to a project.",
    {
      id: z.string().describe("Team ID"),
      projectId: z.string().describe("Project ID to grant access to"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post(
          `/api/teams/${args.id}/projects/${args.projectId}`
        );
        return response.data;
      });
    }
  );

  // --- Revoke team access to project ---
  server.tool(
    "kimai-remove-team-project",
    "Revoke a team's access to a project.",
    {
      id: z.string().describe("Team ID"),
      projectId: z.string().describe("Project ID to revoke access from"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(
          `/api/teams/${args.id}/projects/${args.projectId}`
        );
        return {
          success: true,
          message: `Team ${args.id} access revoked from project ${args.projectId}.`,
        };
      });
    }
  );

  // --- Grant team access to activity ---
  server.tool(
    "kimai-add-team-activity",
    "Grant a team access to an activity.",
    {
      id: z.string().describe("Team ID"),
      activityId: z.string().describe("Activity ID to grant access to"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post(
          `/api/teams/${args.id}/activities/${args.activityId}`
        );
        return response.data;
      });
    }
  );

  // --- Revoke team access to activity ---
  server.tool(
    "kimai-remove-team-activity",
    "Revoke a team's access to an activity.",
    {
      id: z.string().describe("Team ID"),
      activityId: z.string().describe("Activity ID to revoke access from"),
    },
    async (args) => {
      return handleApiCall(async () => {
        await getClient().delete(
          `/api/teams/${args.id}/activities/${args.activityId}`
        );
        return {
          success: true,
          message: `Team ${args.id} access revoked from activity ${args.activityId}.`,
        };
      });
    }
  );
}
