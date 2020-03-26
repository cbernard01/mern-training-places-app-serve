class HttpResponse {
  constructor(res, payload) {
    this.response = res;
    this.payload = payload;
    this.err = "";
    this.code = 200;
  }

  error(code, error) {
   this.code = code;
   this.err = error;
  }

  send() {
    this.response.status(this.code).json({status: 200, error: this.err, payload: this.payload});
  }
}

module.exports = HttpResponse;
