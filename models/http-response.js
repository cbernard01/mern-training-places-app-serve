class HttpResponse {
  constructor(res) {
    this.response = res;
    this.payload = {};
    this.err = "";
    this.code = 200;
  }

  error(code, error, internalStatus=400) {
    this.response.status(code).json({status: internalStatus, error: error, payload: this.payload});
  }

  send(payload, internalStatus=200) {
    this.response.status(this.code).json({status: internalStatus, error: this.err, payload: payload});
  }
}

module.exports = HttpResponse;
