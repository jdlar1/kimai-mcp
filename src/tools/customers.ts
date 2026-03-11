import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, handleApiCall } from "../api/client.js";

export function registerCustomerTools(server: McpServer): void {
  // --- List customers ---
  server.tool(
    "kimai-list-customers",
    "List all customers. Supports filtering by visibility, search term, and sorting.",
    {
      visible: z
        .enum(["1", "2", "3"])
        .optional()
        .describe("Visibility filter: 1=visible, 2=hidden, 3=all (default: 1)"),
      order: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction (default: ASC)"),
      orderBy: z
        .enum(["id", "name"])
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
        const response = await getClient().get("/api/customers", { params });
        return response.data;
      });
    }
  );

  // --- Get customer ---
  server.tool(
    "kimai-get-customer",
    "Get a single customer by ID with full details.",
    {
      id: z.string().describe("Customer ID"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().get(`/api/customers/${args.id}`);
        return response.data;
      });
    }
  );

  // --- Create customer ---
  server.tool(
    "kimai-create-customer",
    "Create a new customer. Requires name, country (2-letter ISO code), currency (3-letter code), and timezone.",
    {
      name: z.string().describe("Customer name (required)"),
      country: z.string().describe("Country code, e.g. 'US', 'DE' (required)"),
      currency: z.string().describe("Currency code, e.g. 'USD', 'EUR' (required)"),
      timezone: z.string().describe("Timezone, e.g. 'America/New_York' (required)"),
      company: z.string().optional().describe("Company name"),
      contact: z.string().optional().describe("Contact person name"),
      email: z.string().optional().describe("Contact email"),
      phone: z.string().optional().describe("Phone number"),
      homepage: z.string().optional().describe("Website URL"),
      addressLine1: z.string().optional().describe("Address line 1"),
      addressLine2: z.string().optional().describe("Address line 2"),
      city: z.string().optional().describe("City"),
      postCode: z.string().optional().describe("Postal code"),
      comment: z.string().optional().describe("Internal comment"),
      color: z.string().optional().describe("Hex color code, e.g. '#ff0000'"),
      visible: z.boolean().optional().describe("Is visible (default: true)"),
      billable: z.boolean().optional().describe("Is billable (default: true)"),
      vatId: z.string().optional().describe("VAT ID"),
      number: z.string().optional().describe("Customer number"),
      budget: z.number().optional().describe("Monetary budget"),
      timeBudget: z.string().optional().describe("Time budget (e.g. '100:00')"),
      budgetType: z
        .enum(["month"])
        .optional()
        .describe("Budget type: 'month' for monthly budget"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const response = await getClient().post("/api/customers", args);
        return response.data;
      });
    }
  );

  // --- Update customer ---
  server.tool(
    "kimai-update-customer",
    "Update an existing customer. Pass only the fields you want to change.",
    {
      id: z.string().describe("Customer ID to update"),
      name: z.string().optional().describe("Customer name"),
      country: z.string().optional().describe("Country code"),
      currency: z.string().optional().describe("Currency code"),
      timezone: z.string().optional().describe("Timezone"),
      company: z.string().optional().describe("Company name"),
      contact: z.string().optional().describe("Contact person name"),
      email: z.string().optional().describe("Contact email"),
      phone: z.string().optional().describe("Phone number"),
      homepage: z.string().optional().describe("Website URL"),
      addressLine1: z.string().optional().describe("Address line 1"),
      addressLine2: z.string().optional().describe("Address line 2"),
      city: z.string().optional().describe("City"),
      postCode: z.string().optional().describe("Postal code"),
      comment: z.string().optional().describe("Internal comment"),
      color: z.string().optional().describe("Hex color code"),
      visible: z.boolean().optional().describe("Is visible"),
      billable: z.boolean().optional().describe("Is billable"),
      vatId: z.string().optional().describe("VAT ID"),
      number: z.string().optional().describe("Customer number"),
      budget: z.number().optional().describe("Monetary budget"),
      timeBudget: z.string().optional().describe("Time budget"),
      budgetType: z.enum(["month"]).optional().describe("Budget type"),
    },
    async (args) => {
      return handleApiCall(async () => {
        const { id, ...body } = args;
        const response = await getClient().patch(`/api/customers/${id}`, body);
        return response.data;
      });
    }
  );
}
