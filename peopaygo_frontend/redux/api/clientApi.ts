import { ROLES } from "@/types/roles";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

interface EditClient {
  role: ROLES,
  company: string
}

interface CreateClient {
  email: string,
  password: string,
  role: ROLES,
  company: string
}

export const clientApi = createApi({
  reducerPath: 'clientAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).accessToken.access_token;
      if (token) {
        headers.set('access_token', token)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    getAllClients: builder.query<any, { page: number, limit: number }>({
      query: ({ page, limit }) => ({
        url: `user/list?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    }),
    createClient: builder.mutation<any, { client: CreateClient }>({
      query: (client) =>
      ({
        url: `user`,
        method: 'POST',
        body: client
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
    }),
    editClient: builder.mutation<any, { id: number, client: EditClient }>({
      query: ({ id, client }) =>
      ({
        url: `user/${id}`,
        method: 'PUT',
        body: client
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
      // invalidatesTags: ['Post'],
    })
  })
})

export const { useGetAllClientsQuery, useEditClientMutation, useCreateClientMutation } = clientApi;