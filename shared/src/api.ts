/** Response envelopes every endpoint shares. */

export interface ApiError {
  error: {
    code: string;
    message: string;
    /** Field-level messages, keyed by form field name. */
    details?: Record<string, string>;
  };
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Endpoints that return a whole collection without paging. */
export interface Collection<T> {
  items: T[];
}

/** Largest page a list endpoint returns; the dashboards ask for exactly this to get "everything". */
export const MAX_PAGE_SIZE = 200;
