import axios from "axios";

export const responseErrorHandler = (
  error: unknown
): { status: number; message: string; data: Record<string, string> } => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected error:", error);
  }

  return { status: 500, message: "Internal server error", data: {} };
};
