#!/usr/bin/env node

import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerTimesheetTools } from "./tools/timesheets.js";
import { registerCustomerTools } from "./tools/customers.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerActivityTools } from "./tools/activities.js";
import { registerUserTools } from "./tools/users.js";
import { registerTagTools } from "./tools/tags.js";
import { registerTeamTools } from "./tools/teams.js";
import { registerSystemTools } from "./tools/system.js";

const server = new McpServer({
  name: "kimai-mcp",
  version: "1.0.0",
});

// Register all tool groups
registerTimesheetTools(server);
registerCustomerTools(server);
registerProjectTools(server);
registerActivityTools(server);
registerUserTools(server);
registerTagTools(server);
registerTeamTools(server);
registerSystemTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting kimai-mcp server:", error);
  process.exit(1);
});
