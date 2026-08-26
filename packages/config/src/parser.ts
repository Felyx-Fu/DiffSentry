export type ConfigParseErrorCode = "invalid-json";

export class ConfigParseError extends Error {
  readonly code: ConfigParseErrorCode;

  constructor(message = "Configuration must be valid JSON") {
    super(message);
    this.name = "ConfigParseError";
    this.code = "invalid-json";
  }
}

export function parseConfigJson(contents: string): unknown {
  try {
    return JSON.parse(contents) as unknown;
  } catch {
    throw new ConfigParseError();
  }
}
