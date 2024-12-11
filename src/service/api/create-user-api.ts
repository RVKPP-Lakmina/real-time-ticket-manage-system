import { Api } from "./api-handler";
import { UserCreate } from "@/interfaces/form";
import { UserCreateResponse } from "@/interfaces/api";
import { CatchedError } from "@/interfaces/error-handler";
import { CachedStorege } from "../cache/cachine-storage";

const api = Api.getInstance();

export const saveUser = async (user: UserCreate) => {
  const res: { data: UserCreateResponse; status: number } | CatchedError =
    await api.post("/users", user);

  if (res.status === 200) {
    const cache: UserCreateResponse[] = CachedStorege.instance.get("users");
    cache.push(res.data as UserCreateResponse);

    CachedStorege.instance.store("users", cache);
  }
  return { data: res.data, status: res.status };
};

export const getAllUsers = async () => {
  const cache = CachedStorege.instance.get("users");

  if (cache) {
    return { data: cache, status: 200 };
  }

  const res: { data: UserCreateResponse[]; status: number } | CatchedError =
    await api.get("/users");

  if (res.status === 200) {
    CachedStorege.instance.store("users", res.data);
  }

  return { data: res.data, status: res.status };
};
