export function createApiResponse(
  statusCode,
  data = null,
  message = "Success",
) {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400,
  };
}

export const ApiResponse = {
  create: createApiResponse,
  ok: (data = null, message = "Success") =>
    createApiResponse(200, data, message),
  created: (data = null, message = "Created successfully") =>
    createApiResponse(201, data, message),
  noContent: (message = "No content") => createApiResponse(204, null, message),
};

export default ApiResponse;
