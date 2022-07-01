export class EmailInUseError extends Error {
  constructor() {
    super("O email já está sendo utilizado");
    this.name = "EmailInUseError";
  }
}
