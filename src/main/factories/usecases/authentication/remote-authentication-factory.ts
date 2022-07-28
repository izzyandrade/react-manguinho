import { RemoteAuthentication } from "@/data/usecases";
import { makeApiUrl } from "../../http/api-url-factory";
import { makeHttpClient } from "../../http/axios-http-client-factory";

export const makeRemoteAuthentication = (): RemoteAuthentication => {
  return new RemoteAuthentication(makeApiUrl("/login"), makeHttpClient());
};
