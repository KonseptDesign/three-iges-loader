export class IGESParseError extends Error {
  readonly code: string;
  readonly line?: number;
  readonly context?: string;

  constructor(
    message: string,
    options?: { code?: string; line?: number; context?: string; cause?: unknown }
  ) {
    super(message);
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
    this.name = "IGESParseError";
    this.code = options?.code ?? "IGES_PARSE_ERROR";
    this.line = options?.line;
    this.context = options?.context;
  }
}
