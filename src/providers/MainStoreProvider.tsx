import {
  ChartFilterData,
  ErrorMessage,
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
import { getAllUsers } from "@/service/api/create-user-api";

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
  const [isLoading, setIsLoading] = React.useState(false);

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

      {
        id: 3,
        status: "locked",
        task: () => Promise.all([getAllUsers()]),
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
        setIsLoading(true);
        throw new Error("WebSocket is not initialized.");
      }

      if (isLoading) {
        setIsLoading(false);
      }

      wsService.setMessageCallback(
        (data: WebSocketResponseMessage | ErrorMessage) => {
          if (data.status === -1) {
            AlertToast.error(data.message);
            return;
          }

          const {
            user = null,
            date = new Date(),
            ticketPoolCapacity = 0,
            pendingTotalTickets = 0,
            activeStatus = false,
            status = 1,
          } = data;

          if (user || user !== null) {
            const userId: string = user.id;

            if (
              userBuffer.current?.[userId] &&
              userBuffer.current?.[userId]?.active !== user?.active
            ) {
              userBuffer.current[userId].active = user.active;
            }

            if (userBuffer.current[userId]) {
              userBuffer.current[userId].totalPurchase! += user.rate;
            } else {
              userBuffer.current[userId] = {
                ...user,
                totalPurchase: user.rate,
              };
            }
          }

          messageBuffer.current.push({
            date,
            ticketPoolCapacity,
            pendingTotalTickets,
            activeStatus,
            status,
          });
        }
      );
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

  if (isLoading) {
    return (
      <>
        <Progress title="Waitting for the Network" />
      </>
    );
  }

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
