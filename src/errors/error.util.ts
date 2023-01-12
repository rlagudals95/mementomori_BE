export function isClientError(httpStatus: number) {
  return 400 <= httpStatus && httpStatus < 500;
}

export function isServerError(httpStatus: number) {
  return 500 <= httpStatus && httpStatus < 600;
}
