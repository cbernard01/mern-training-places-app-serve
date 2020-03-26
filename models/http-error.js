class HttpError extends Error{
  constructor(message, code, payload) {
    super();
    this.message = message;
    this.code = code;
    this.payload = payload;
  }
}

module.exports = HttpError;
