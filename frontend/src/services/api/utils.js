export const DOMAIN = import.meta.env.VITE_DOMAIN ?? "https://oykus.ovh";
export const API_URL = import.meta.env.VITE_API  ?? "https://oykus.ovh/api";

export const API_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export const oykEncode = (data) => {
  return JSON.stringify(data);
};

export const oykDecode = (encoded) => {
  return JSON.parse(encoded);
};