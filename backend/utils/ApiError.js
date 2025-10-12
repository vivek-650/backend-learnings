class ApiError extends Error {
  constructor(
    message="Something went wrong", 
    code, 
    errors=[], 
    stack=""
) {
    super(message);
    this.code = code;
    this.data = null;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if(stack){
        this.stack = stack;
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
