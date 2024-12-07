import { MainStoreProviderProps } from "@/interfaces/main-store";
import React, { useCallback, useEffect, useMemo } from "react";
import { MainStoreContext } from "./context/contexts";
import routes from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import AlertToast from "@/classes/toast";
import Progress from "@/components/ui/progress";
import Navigation from "@/components/Navigation";

const MainStoreProvider: React.FC<MainStoreProviderProps> = ({
  children,
}: MainStoreProviderProps): React.ReactNode => {
  const [currentPage, setCurrentPage] = React.useState("/home");
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = React.useState(true);

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
      {isInitializing ? (
        <Progress />
      ) : (
        <div className="w-screen h-screen">
          <MainStoreContext.Provider
            value={{ language: "en", useRouter, currentPage }}
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
