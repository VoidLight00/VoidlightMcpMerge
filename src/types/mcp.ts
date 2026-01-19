export interface McpServerBase {
  env?: Record<string, string>;
}

export interface StdioServer extends McpServerBase {
  command: string;
  args?: string[];
}

export interface SseServer extends McpServerBase {
  url: string;
}

export type McpServer = StdioServer | SseServer;

export interface McpConfig {
  mcpServers: Record<string, McpServer>;
}

export interface ServerEntry {
  key: string;
  type: 'stdio' | 'sse';
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
}

export function isStdioServer(server: McpServer): server is StdioServer {
  return 'command' in server;
}

export function isSseServer(server: McpServer): server is SseServer {
  return 'url' in server;
}

export function serverEntryToMcpServer(entry: ServerEntry): McpServer {
  if (entry.type === 'stdio') {
    const server: StdioServer = {
      command: entry.command || '',
    };
    if (entry.args && entry.args.length > 0) {
      server.args = entry.args;
    }
    if (entry.env && Object.keys(entry.env).length > 0) {
      server.env = entry.env;
    }
    return server;
  } else {
    const server: SseServer = {
      url: entry.url || '',
    };
    if (entry.env && Object.keys(entry.env).length > 0) {
      server.env = entry.env;
    }
    return server;
  }
}

export function mcpServerToEntry(key: string, server: McpServer): ServerEntry {
  if (isStdioServer(server)) {
    return {
      key,
      type: 'stdio',
      command: server.command,
      args: server.args || [],
      env: server.env || {},
    };
  } else {
    return {
      key,
      type: 'sse',
      url: server.url,
      env: server.env || {},
    };
  }
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMcpJson(json: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof json !== 'object' || json === null) {
    return { valid: false, errors: ['JSON must be an object'] };
  }

  const obj = json as Record<string, unknown>;

  if (!('mcpServers' in obj)) {
    return { valid: false, errors: ['Missing "mcpServers" property'] };
  }

  if (typeof obj.mcpServers !== 'object' || obj.mcpServers === null) {
    return { valid: false, errors: ['"mcpServers" must be an object'] };
  }

  const servers = obj.mcpServers as Record<string, unknown>;

  for (const [key, server] of Object.entries(servers)) {
    if (typeof server !== 'object' || server === null) {
      errors.push(`Server "${key}" must be an object`);
      continue;
    }

    const serverObj = server as Record<string, unknown>;
    const hasCommand = 'command' in serverObj;
    const hasUrl = 'url' in serverObj;

    if (!hasCommand && !hasUrl) {
      errors.push(`Server "${key}" must have either "command" or "url" property`);
    }

    if (hasCommand && hasUrl) {
      errors.push(`Server "${key}" cannot have both "command" and "url" properties`);
    }

    if (hasCommand && typeof serverObj.command !== 'string') {
      errors.push(`Server "${key}": "command" must be a string`);
    }

    if (hasUrl && typeof serverObj.url !== 'string') {
      errors.push(`Server "${key}": "url" must be a string`);
    }

    if ('args' in serverObj && !Array.isArray(serverObj.args)) {
      errors.push(`Server "${key}": "args" must be an array`);
    }

    if ('env' in serverObj && (typeof serverObj.env !== 'object' || serverObj.env === null)) {
      errors.push(`Server "${key}": "env" must be an object`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function parseMcpJson(jsonString: string): McpConfig | Error {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateMcpJson(parsed);
    if (!validation.valid) {
      return new Error(validation.errors.join('\n'));
    }
    return parsed as McpConfig;
  } catch (e) {
    return new Error(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export function stringifyMcpJson(config: McpConfig): string {
  return JSON.stringify(config, null, 2);
}
