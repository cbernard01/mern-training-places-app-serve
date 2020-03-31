class HttpResponse {
  constructor(res) {
    this.response = res;
    this.payload = {};
    this.err = [];
    this.code = 200;
  }

  error(code, errors, internalStatus=400) {
    if (!Array.isArray(errors)) errors = [errors];

    return this.response.status(code).json({status: internalStatus, errors: errors, payload: this.payload});
  }

  async validationError(code, errors, internalStatus=400) {
    let errorResult = [];
    await errors.errors.map(error => errorResult.push(`${error.param} has an ${error.msg}, please try again`))
    return this.response.status(code).json({status: internalStatus, errors: errorResult, payload: this.payload});
  }

  send(payload, internalStatus=200) {
    return this.response.status(this.code).json({status: internalStatus, errors: this.err, payload: payload});
  }
}

module.exports = HttpResponse;
