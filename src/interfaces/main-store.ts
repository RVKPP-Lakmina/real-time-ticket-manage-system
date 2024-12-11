import { WebSocketService } from "@/service/WebSocketService";

export interface MainStoreProviderProps {
  children: React.ReactNode;
}

export interface UserCard {
  id: string;
  name: string;
  rate: number;
  prefix: string;
  active: boolean;
  totalPurchase?: number;
}

export interface ChartFilterData {
  date: string | Date;
  ticketPoolCapacity: number;
  pendingTotalTickets: number;
  activeStatus: boolean;
  status: 1 | -1;
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
  user: UserCard | null;
  message: string;
}
export interface ErrorMessage {
  status: -1;
  message: string;
  user?: null;
  date?: Date;
  ticketPoolCapacity?: 0;
  pendingTotalTickets?: 0;
  activeStatus?: 0;
}
