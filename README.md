# VoidlightMcpMerge

A visual tool for managing Claude Desktop MCP (Model Context Protocol) server configurations. Easily combine, add, edit, and remove MCP servers.

## Features

- **Visual Server Editor** - Add, edit, and remove MCP servers with an intuitive UI
- **Two Server Types** - Support for both `stdio` and `sse` server types
- **Environment Variables** - Easily manage environment variables for each server
- **JSON Preview** - Real-time syntax-highlighted JSON preview
- **Import/Export** - Load and save JSON configuration files
- **Share Configurations** - Generate shareable URLs with LZ-string compression
- **Local Storage** - Auto-save configurations to browser storage
- **Keyboard Shortcuts** - Ctrl/Cmd+S to save, Ctrl/Cmd+N to add server
- **Dark Mode** - Optimized for developers with a beautiful dark theme

## Getting Started

### Online

Visit the deployed site on Netlify.

### Local Development

```bash
git clone https://github.com/VoidLight00/VoidlightMcpMerge.git
cd VoidlightMcpMerge

npm install
npm run dev

npm run build
```

## Usage

1. **Add Server** - Click "Add Server" to create a new MCP server configuration
2. **Configure** - Set the server key, type (stdio/sse), command/URL, arguments, and environment variables
3. **Preview** - See the JSON output in real-time on the right panel
4. **Export** - Click "Save JSON" to download the configuration file
5. **Share** - Click "Share" to generate a shareable URL

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save JSON file |
| `Ctrl/Cmd + N` | Add new server |
| `Ctrl/Cmd + C` | Copy JSON (when not in input field) |

## MCP Server Types

### stdio (Standard I/O)

For local command-line servers:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

### sse (Server-Sent Events)

For remote HTTP servers:

```json
{
  "mcpServers": {
    "remote-api": {
      "url": "https://api.example.com/mcp/sse",
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (State Management)
- Radix UI (Accessible Components)
- LZ-String (URL Compression)

## Configuration File Location

The Claude Desktop configuration file is typically located at:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## License

MIT License

## Credits

Inspired by [cokac.com/mcp](https://cokac.com/mcp)

Made by [VoidLight](https://github.com/VoidLight00)
