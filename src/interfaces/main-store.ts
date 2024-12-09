import { WebSocketService } from "@/service/WebSocketService";

export interface MainStoreProviderProps {
  children: React.ReactNode;
}

export interface UserCard {
  id: string;
  name: string;
  rate: number;
  totalPurchase?: number;
}

export interface ChartFilterData {
  date: string;
  ticketPoolCapacity: number;
  pendingTotalTickets: number;
}
export interface MainStoreContextInterface {
  language: string;
  useRouter: () => { push: (path: string) => void };
  currentPage: string;
  filteredData: ChartFilterData[];
  userBuffer: React.MutableRefObject<Record<string, UserCard>>;
  wsService: WebSocketService;
}

export interface WebSocketResponseMessage extends ChartFilterData {
  user?: UserCard;
  message: string;
}
