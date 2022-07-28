import { RemoteAddAccount } from "@/data/usecases";
import { makeApiUrl } from "../../http/api-url-factory";
import { makeHttpClient } from "../../http/axios-http-client-factory";

export const makeRemoteAddAccount = (): RemoteAddAccount => {
  return new RemoteAddAccount(makeApiUrl("/signup"), makeHttpClient());
};
