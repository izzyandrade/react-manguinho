export class UnexpectedError extends Error {
  constructor() {
    super("Ocorreu um erro inesperado. Tente novamente.");
    this.name = "UnexpectedError";
  }
}
