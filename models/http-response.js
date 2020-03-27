class HttpResponse {
  constructor(res) {
    this.response = res;
    this.payload = {};
    this.err = [];
    this.code = 200;
  }

  error(code, errors, internalStatus=400) {
    if (!Array.isArray(errors)) errors = [errors];

    this.response.status(code).json({status: internalStatus, errors: errors, payload: this.payload});
  }

  send(payload, internalStatus=200) {
    this.response.status(this.code).json({status: internalStatus, errors: this.err, payload: payload});
  }
}

module.exports = HttpResponse;
