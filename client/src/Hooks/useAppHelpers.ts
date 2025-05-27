// hooks/useAppHelpers.ts
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export const useAppHelpers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return { navigate, dispatch };
};
