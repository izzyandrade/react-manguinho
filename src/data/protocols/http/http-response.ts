export enum HttpStatusCode {
  ok = 200,
  unauthorized = 401,
  noContent = 204,
  badRequest = 400,
  serverError = 500,
  notFound = 404,
  forbidden = 403,
}

export type HttpResponse<T> = {
  statusCode: number;
  body?: T;
};
