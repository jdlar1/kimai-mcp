# @jdlar/kimai-mcp

MCP (Model Context Protocol) server for [Kimai](https://www.kimai.org/) time-tracking. Exposes your Kimai instance as **44 tools** that any MCP-compatible AI client can use — Claude Desktop, OpenCode, Cursor, etc.

## Prerequisites

- Node.js >= 18
- A running Kimai instance with API access
- An API token (generate one in your Kimai user profile under **API Access / API Token**)

## Quick Start

### Option 1: NPX (Recommended - No Installation Required)
```bash
KIMAI_API_URL=https://your-kimai.example.com KIMAI_API_TOKEN=your-token npx @jdlar/kimai-mcp
```

### Option 2: Global Installation
```bash
# 1. Install globally
npm install -g @jdlar/kimai-mcp

# 2. Set environment variables and run
KIMAI_API_URL=https://your-kimai.example.com KIMAI_API_TOKEN=your-token kimai-mcp
```

### Option 3: Environment File
```bash
# Create .env file with your credentials
echo "KIMAI_API_URL=https://your-kimai.example.com" > .env
echo "KIMAI_API_TOKEN=your-token" >> .env

# Run with npx
npx @jdlar/kimai-mcp

# Or run with global installation
kimai-mcp
```

## MCP Client Configuration

### Claude Desktop

Add to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Option A: Using NPX (Recommended)
```json
{
  "mcpServers": {
    "kimai": {
      "command": "npx",
      "args": ["-y", "@jdlar/kimai-mcp"],
      "env": {
        "KIMAI_API_URL": "https://your-kimai.example.com",
        "KIMAI_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

#### Option B: Using Global Installation
```json
{
  "mcpServers": {
    "kimai": {
      "command": "kimai-mcp",
      "env": {
        "KIMAI_API_URL": "https://your-kimai.example.com",
        "KIMAI_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### OpenCode

Add to your `opencode.json`:

```json
{
  "mcp": {
    "kimai": {
      "type": "local",
      "command": ["npx", "-y", "@jdlar/kimai-mcp"],
      "env": {
        "KIMAI_API_URL": "https://your-kimai.example.com",
        "KIMAI_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "kimai": {
      "command": "npx",
      "args": ["-y", "@jdlar/kimai-mcp"],
      "env": {
        "KIMAI_API_URL": "https://your-kimai.example.com",
        "KIMAI_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Other MCP Clients

For any MCP-compatible client, configure:

- **Command**: `npx` (or `kimai-mcp` if installed globally)
- **Args**: `["-y", "@jdlar/kimai-mcp"]` (only when using npx)
- **Transport**: stdio
- **Environment variables**:
  - `KIMAI_API_URL` — Your Kimai instance URL (without trailing slash)
  - `KIMAI_API_TOKEN` — API token from your Kimai user profile

## Available Tools

### Timesheets (10 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-timesheets` | List/filter timesheet entries (by user, project, customer, date range, active state, tags, etc.) |
| `kimai-get-timesheet` | Get a single timesheet by ID |
| `kimai-create-timesheet` | Create a new timesheet entry (start a timer or log completed work) |
| `kimai-update-timesheet` | Update an existing timesheet |
| `kimai-delete-timesheet` | Delete a timesheet entry |
| `kimai-get-active-timesheets` | Get currently running timesheets |
| `kimai-stop-timesheet` | Stop a running timesheet |
| `kimai-restart-timesheet` | Restart a stopped timesheet |
| `kimai-duplicate-timesheet` | Duplicate a timesheet entry |
| `kimai-get-recent-timesheets` | Get recent timesheet entries |

### Customers (4 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-customers` | List/filter customers |
| `kimai-get-customer` | Get customer by ID |
| `kimai-create-customer` | Create a new customer |
| `kimai-update-customer` | Update an existing customer |

### Projects (4 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-projects` | List/filter projects |
| `kimai-get-project` | Get project by ID |
| `kimai-create-project` | Create a new project |
| `kimai-update-project` | Update an existing project |

### Activities (4 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-activities` | List/filter activities |
| `kimai-get-activity` | Get activity by ID |
| `kimai-create-activity` | Create a new activity (project-scoped or global) |
| `kimai-update-activity` | Update an existing activity |

### Users (3 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-users` | List users (requires `view_user` permission) |
| `kimai-get-user` | Get user by ID |
| `kimai-get-me` | Get current authenticated user |

### Tags (3 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-tags` | List/filter tags |
| `kimai-create-tag` | Create a new tag |
| `kimai-delete-tag` | Delete a tag |

### Teams (13 tools)

| Tool | Description |
|------|-------------|
| `kimai-list-teams` | List all teams |
| `kimai-get-team` | Get team by ID |
| `kimai-create-team` | Create a new team |
| `kimai-update-team` | Update an existing team |
| `kimai-delete-team` | Delete a team |
| `kimai-add-team-member` | Add a user to a team |
| `kimai-remove-team-member` | Remove a user from a team |
| `kimai-add-team-customer` | Grant team access to a customer |
| `kimai-remove-team-customer` | Revoke team access to a customer |
| `kimai-add-team-project` | Grant team access to a project |
| `kimai-remove-team-project` | Revoke team access to a project |
| `kimai-add-team-activity` | Grant team access to an activity |
| `kimai-remove-team-activity` | Revoke team access to an activity |

### System (3 tools)

| Tool | Description |
|------|-------------|
| `kimai-ping` | Test API connection |
| `kimai-get-version` | Get Kimai version info |
| `kimai-get-timesheet-config` | Get timesheet configuration |

## Example Prompts

Once connected, you can ask your AI assistant things like:

### Time Tracking
```
Start a timer on project "Website Redesign", activity "Development"
```
```
What timesheets did I log this week?
```
```
Stop my running timer
```

### Reporting
```
Show me all timesheet entries for customer "Acme Corp" in January 2026
```
```
How many hours did I track on project "Mobile App" this month?
```

### Management
```
List all active projects for customer "Acme Corp"
```
```
Create a new customer called "NewCo" based in the US with USD currency
```
```
Create a project "Q1 Campaign" under the "Marketing Agency" customer
```

## Permissions

All 44 tools are always registered. If your API token lacks a required permission for a specific tool, it returns a clear error message instead of failing silently — for example:

```
Permission denied (403): Your Kimai API token does not have access to this endpoint.
Check your user role and permissions in Kimai.
```

No role configuration is needed. Just use the tools and Kimai's permission system handles the rest.

## Generating an API Token

1. Log in to your Kimai instance
2. Click on your profile icon (top right)
3. Navigate to **API Access** or **API Token**
4. Create a new API token
5. Copy the token and use it as `KIMAI_API_TOKEN`

> The token inherits the permissions of the user who created it. Admin tokens can access all endpoints; regular user tokens are scoped to their own data.

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run the server
pnpm start
```

## License

MIT
