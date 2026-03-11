import axios, { AxiosInstance, AxiosError } from "axios";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

let _client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  if (_client) return _client;

  const baseURL = process.env.KIMAI_API_URL;
  const token = process.env.KIMAI_API_TOKEN;

  if (!baseURL || !token) {
    throw new Error(
      "Missing required environment variables: KIMAI_API_URL and KIMAI_API_TOKEN must be set."
    );
  }

  _client = axios.create({
    baseURL: baseURL.replace(/\/+$/, ""),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 30_000,
  });

  return _client;
}

/**
 * Wraps an async function that returns data into a CallToolResult.
 * Handles Kimai API errors gracefully (403 permission denied, 404 not found, etc.)
 */
export async function handleApiCall<T>(
  fn: () => Promise<T>
): Promise<CallToolResult> {
  try {
    const data = await fn();
    return {
      content: [
        { type: "text", text: JSON.stringify(data, null, 2) },
      ],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError;
      const status = axiosErr.response?.status;
      const responseData = axiosErr.response?.data;

      let message: string;

      switch (status) {
        case 403:
          message = `Permission denied (403): Your Kimai API token does not have access to this endpoint. Check your user role and permissions in Kimai.`;
          break;
        case 404:
          message = `Not found (404): The requested resource does not exist.`;
          break;
        case 400:
          message = `Bad request (400): ${formatErrorData(responseData)}`;
          break;
        case 401:
          message = `Authentication failed (401): Your KIMAI_API_TOKEN is invalid or expired.`;
          break;
        case 500:
          message = `Kimai server error (500): ${formatErrorData(responseData)}`;
          break;
        default:
          message = `Kimai API error (${status ?? "unknown"}): ${axiosErr.message}`;
          if (responseData) {
            message += `\n${formatErrorData(responseData)}`;
          }
      }

      return {
        content: [{ type: "text", text: message }],
        isError: true,
      };
    }

    // Non-Axios error
    const errMsg =
      error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Unexpected error: ${errMsg}` }],
      isError: true,
    };
  }
}

function formatErrorData(data: unknown): string {
  if (!data) return "No additional details.";
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}
