import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
  id: string | null;
}

const initialState: PlayerState = {
  id: typeof window !== "undefined" ? localStorage.getItem("myPlayerId") || null : null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerId(state, action: PayloadAction<string>) {
      state.id = action.payload;
      if (typeof window !== "undefined") localStorage.setItem("myPlayerId", action.payload);
    },
  },
});

export const { setPlayerId } = playerSlice.actions;
export default playerSlice.reducer;
