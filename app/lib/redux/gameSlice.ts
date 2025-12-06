import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  current: any | null;
}

const initialState: GameState = {
  current: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame(state: { current: any; }, action: PayloadAction<any>) {
      state.current = action.payload;
    },

    applyServerEvent(state: { current: any; }, action: PayloadAction<any>) {
      state.current = action.payload;
    },
  },
});

export const { setGame, applyServerEvent } = gameSlice.actions;
export default gameSlice.reducer;
