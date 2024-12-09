import {
  ChartFilterData,
  MainStoreProviderProps,
  UserCard,
  WebSocketResponseMessage,
} from "@/interfaces/main-store";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { MainStoreContext } from "./context/contexts";
import routes from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import AlertToast from "@/classes/toast";
import Progress from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { WebSocketService } from "@/service/WebSocketService";

const MainStoreProvider: React.FC<MainStoreProviderProps> = ({
  children,
}: MainStoreProviderProps): React.ReactNode => {
  const [currentPage, setCurrentPage] = React.useState("/home");
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [wsService, setWsService] = React.useState<WebSocketService | null>(
    null
  );
  const [filteredData, setFilteredData] = React.useState<ChartFilterData[]>([]);
  const messageBuffer = useRef<ChartFilterData[]>([]);
  const userBuffer = useRef<Record<string, UserCard>>({});

  const tasks = useMemo(() => {
    return [
      {
        id: 1,
        status: "locked",
        task: () => {
          return new Promise((resolve, reject) => {
            try {
              const timeOut = setTimeout(() => {
                AlertToast.initialize(toast);
                resolve("success");
              }, 2000);

              return () => clearTimeout(timeOut);
            } catch {
              reject("failed");
            }
          });
        },
      },
      {
        id: 2,
        status: "locked",
        task: () => {
          return new Promise((resolve, reject) => {
            try {
              const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL as string;
              const webSocketService = new WebSocketService(websocketUrl);
              setWsService(webSocketService);
              webSocketService.connect();
              resolve("success");
            } catch {
              reject("failed");
            }
          });
        },
      },
    ];
  }, [toast]);

  const startExecution = useCallback(async () => {
    for (const t of tasks) {
      if (t.status === "locked") {
        try {
          await t.task();
          t.status = "success";
        } catch {
          t.status = "failed";
        }
      }
    }

    setIsInitializing(false);
  }, [tasks]);

  useEffect(() => {
    startExecution();
  }, [startExecution]);

  const handleWebSocket = useCallback(() => {
    try {
      if (!wsService) {
        throw new Error("WebSocket is not initialized.");
      }

      wsService.setMessageCallback((data: WebSocketResponseMessage) => {
        if (
          data?.["date"] &&
          data?.["ticketPoolCapacity"] &&
          data?.["pendingTotalTickets"]
        ) {
          messageBuffer.current.push({
            date: data["date"],
            ticketPoolCapacity: data["ticketPoolCapacity"],
            pendingTotalTickets: data["pendingTotalTickets"],
          });
        }

        if (data?.user) {
          const userId: string = data.user.id;

          if (userBuffer.current[userId]) {
            userBuffer.current[userId].totalPurchase! += data.user.rate;
          } else {
            userBuffer.current[userId] = {
              ...data.user,
              totalPurchase: data.user.rate,
            };
          }
        }
      });
    } catch (error) {
      console.error("Failed to handle WebSocket data:", error);
    }
  }, [wsService]);

  useEffect(() => {
    handleWebSocket();

    return () => {
      if (wsService) {
        wsService.close();
      }
    };
  }, [handleWebSocket, wsService]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageBuffer.current.length > 0) {
        // Update the state with batched messages
        setFilteredData((prevMessages) => [
          ...prevMessages,
          ...messageBuffer.current,
        ]);
        // Clear the buffer
        messageBuffer.current = [];
      }
    }, 1000); // Update every 1 second or as needed

    return () => clearInterval(interval);
  }, []);

  const useRouter = () => {
    const push = (path: string) => {
      if (routes[path]) {
        setCurrentPage(path);
      }

      if (path.split("/").length > 1) {
        const childPath: string = path.split("/").pop() || "";
        push(childPath);
      }
    };

    return { push };
  };

  return (
    <>
      {isInitializing && wsService?.readyState === WebSocket.CONNECTING ? (
        <Progress />
      ) : (
        <div className="w-screen h-screen">
          <MainStoreContext.Provider
            value={{
              language: "en",
              useRouter,
              currentPage,
              filteredData,
              userBuffer,
              wsService: wsService!,
            }}
          >
            <Navigation />
            {children}
            <Toaster />
          </MainStoreContext.Provider>
        </div>
      )}
    </>
  );
};

export default MainStoreProvider;
