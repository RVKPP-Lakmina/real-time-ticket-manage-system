import axios, { Axios } from "axios";
import { responseErrorHandler } from "../error-hanlder/catch-error-hanlder";

export class Api {
  private url: string;
  private api: Axios;
  private headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor() {
    this.url = import.meta.env.VITE_BACKEND_HOST as string;
    this.api = axios.create({
      baseURL: this.url,
      headers: this.headers,
    });
  }

  public static getInstance(): Api {
    return new Api();
  }

  public setHeaders(headers: Record<string, string>) {
    this.headers = headers;
  }

  public get(url: string, params?: unknown) {
    try {
      return this.api.get(url, { params });
    } catch (error) {
      return responseErrorHandler(error);
    }
  }

  public post(url: string, data: unknown) {
    try {
      return this.api.post(url, data);
    } catch (error) {
      return responseErrorHandler(error);
    }
  }

  public put(url: string, data: unknown) {
    try {
      return this.api.put(url, data);
    } catch (error) {
      return responseErrorHandler(error);
    }
  }

  public delete(url: string) {
    try {
      return this.api.delete(url);
    } catch (error) {
      return responseErrorHandler(error);
    }
  }
}
