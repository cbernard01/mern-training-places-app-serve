class HttpResponse {
  constructor(payload) {
    this.error = "";
    this.payload = payload;
  }

  data() {
    return {error: this.error, payload: this.payload}
  }
}

module.exports = HttpResponse;
