export const makeApiUrl = (path: string): string => {
  const baseURL = process.env.API_URL.replaceAll('"', "");
  const apiURL = baseURL + path;
  return apiURL;
};
