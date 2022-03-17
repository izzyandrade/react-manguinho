export class NotFoundError extends Error {
  constructor() {
    super("404 - Not Found");
    this.name = "NotFoundError";
  }
}
