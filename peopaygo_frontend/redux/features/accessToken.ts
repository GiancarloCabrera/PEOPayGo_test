import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  access_token: ''
}
export const accessToken = createSlice({
  name: 'accessToken',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.access_token = action.payload
    }
  }
})

export const { setAccessToken } = accessToken.actions;

export default accessToken.reducer;