/**
 * Standard API response shape returned by all server endpoints.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
}

/**
 * Creates a standardized API response object.
 */
export const createResponse = <T = unknown>(
  success: boolean,
  data: T | null = null,
  message = ''
): ApiResponse<T> => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Creates a success response.
 */
export const successResponse = <T = unknown>(data: T, message = 'Success'): ApiResponse<T> =>
  createResponse(true, data, message);

/**
 * Creates an error response.
 */
export const errorResponse = <T = unknown>(
  message = 'Error',
  data: T | null = null
): ApiResponse<T> => createResponse(false, data, message);
