import { RemoteAuthentication } from "@/data/usecases/authentication/remote-authentication";
import { makeApiUrl } from "../../http/api-url-factory";
import { makeHttpClient } from "../../http/axios-http-client-factory";

export const makeRemoteAuthentication = (): RemoteAuthentication => {
  return new RemoteAuthentication(makeApiUrl("/login"), makeHttpClient());
};
