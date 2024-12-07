export interface MainStoreProviderProps {
  children: React.ReactNode;
}

export interface MainStoreContextInterface {
  language: string;
  useRouter: () => { push: (path: string) => void };
  currentPage: string;
}
