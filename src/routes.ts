interface Routes {
  index?: boolean;
  id: string;
  label: string;
  children: Record<string, Routes>;
}

const routes: Record<string, Routes> = {
  "/home": {
    index: true,
    id: "/home",
    label: "Home",
    children: {},
  },
  "/dashboard": {
    id: "/dashboard",
    label: "Dashboard",
    children: {},
  },
  "/settings": {
    id: "/settings",
    label: "Settings",
    children: {},
  },
  "/sign-up": {
    id: "/sign-up",
    label: "Create a New User",
    children: {},
  },
};

export default routes;
