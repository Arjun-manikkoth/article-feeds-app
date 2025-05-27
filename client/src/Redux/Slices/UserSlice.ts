import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    loginId: string;
}

const initialState: UserState = {
    id: null,
    loginId: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id;
            state.loginId = action.payload.loginId;
        },
        clearUser: (state) => {
            state.id = null;
            state.loginId = "";
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
