import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  clients: {}
}
export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    getAllClients: (state) => {
      console.log(state);
    }
  }
})

export const { getAllClients } = clientsSlice.actions;

export default clientsSlice.reducer;