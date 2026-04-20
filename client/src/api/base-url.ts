const stripWrappingQuotes = (value: string) =>
  value.replace(/^['"]|['"]$/g, "");

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const rawEnvValue = import.meta.env.VITE_API_URL;
  const envValue = rawEnvValue ? normalizeBaseUrl(stripWrappingQuotes(String(rawEnvValue))) : "";

  if (typeof window === "undefined") {
    return envValue || "http://localhost:3000/api/v1";
  }

  const isLocalApp = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const fallbackUrl = isLocalApp
    ? "http://localhost:3000/api/v1"
    : `${window.location.origin}/api/v1`;

  if (!envValue) {
    return fallbackUrl;
  }

  const isLocalApi = /localhost|127\.0\.0\.1/.test(envValue);

  if (!isLocalApp && isLocalApi) {
    return `${window.location.origin}/api/v1`;
  }

  return envValue;
};

export const getSocketBaseUrl = () =>
  getApiBaseUrl()
    .replace(/\/api\/v1\/?$/, "")
    .replace(/\/api\/?$/, "");
