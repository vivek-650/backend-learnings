class ApiError extends Error {
  /**
   * ApiError constructor is flexible and accepts either:
   * - new ApiError(code, message, errors, stack)
   * - new ApiError(message, code, errors, stack)
   * This keeps existing call sites working regardless of parameter order.
   */
  constructor(codeOrMessage = 500, messageOrCode, errors = [], stack = "") {
    // Determine which argument is the numeric HTTP status code
    let code;
    let message;
    if (typeof codeOrMessage === "number") {
      code = codeOrMessage;
      message =
        typeof messageOrCode === "string"
          ? messageOrCode
          : "Something went wrong";
    } else {
      // first arg is message
      message = codeOrMessage || "Something went wrong";
      code = typeof messageOrCode === "number" ? messageOrCode : 500;
    }

    super(message);
    this.code = code;
    this.data = null;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
