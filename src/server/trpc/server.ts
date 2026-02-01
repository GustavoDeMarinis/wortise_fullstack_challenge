import { appRouter } from "./router";
import { createContext } from "./context";

export const api = appRouter.createCaller(async () => {
    return await createContext();
});
