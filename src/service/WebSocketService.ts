import {
  ErrorMessage,
  WebSocketResponseMessage,
} from "@/interfaces/main-store";

// src/utils/websocket.ts
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageQueue: string[] = [];
  private messageCallback:
    | ((data: WebSocketResponseMessage | ErrorMessage) => void)
    | null = null;

  constructor(private url: string) {}

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connection opened");
      this.flushMessageQueue();
    };

    this.socket.onmessage = (event) => {
      if (this.messageCallback) {
        let data: WebSocketResponseMessage | ErrorMessage = {
          status: -1,
          message: "something went wrong",
        };
        try {
          data = JSON.parse(event.data);
        } catch {
          console.error("Failed to parse message data");
        }

        this.messageCallback(data);
      } else {
        console.error("No message callback defined.");
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  get readyState() {
    if (this.socket) {
      return this.socket.readyState;
    } else {
      return WebSocket.CLOSED;
    }
  }

  sendMessage(message: string) {
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
      } else {
        console.warn("WebSocket is not open. Queueing message.");
        this.messageQueue.push(message);
      }
    } else {
      console.error("WebSocket is not initialized.");
    }
  }

  setMessageCallback(
    callback: (data: WebSocketResponseMessage | ErrorMessage) => void
  ) {
    this.messageCallback = callback;
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private flushMessageQueue() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          this.socket.send(message);
        }
      }
    }
  }
}
