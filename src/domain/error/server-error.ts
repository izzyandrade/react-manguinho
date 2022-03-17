export class ServerError extends Error {
  constructor() {
    super("500 - Internal Server Error");
    this.name = "ServerError";
  }
}
