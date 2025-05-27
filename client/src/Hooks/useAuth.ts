import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";

function useAuth() {
    return useSelector((state: RootState) => state.user);
}

export { useAuth };
