import { createSlice } from "@reduxjs/toolkit";

const connectionRequestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      const newArr = state.filter((r) => r._id !== action.payload);
      return newArr;
    },
  },
});

export default connectionRequestSlice.reducer;
export const { addRequests, removeRequest } = connectionRequestSlice.actions;
