export type ApiErrorKind =
  | 'cancelled'
  | 'client'
  | 'network'
  | 'server'
  | 'timeout'
  | 'unauthorized'
  | 'unknown'
  | 'validation';

type ApiErrorOptions = {
  fields?: Record<string, string>;
  retryable?: boolean;
  status?: number;
};

/** Transport-agnostic failure exposed to queries and product features. */
export class ApiError extends Error {
  readonly fields?: Record<string, string>;
  readonly kind: ApiErrorKind;
  readonly name = 'ApiError';
  readonly retryable: boolean;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.kind = kind;
    this.fields = options.fields;
    this.retryable = options.retryable ?? false;
    this.status = options.status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
