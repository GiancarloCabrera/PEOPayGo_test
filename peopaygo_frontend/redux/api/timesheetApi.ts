import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
interface Timesheet {
  userId: number,
  startDate: string,
  endDate: string,
  checkDate: string,
  employees: Array<number> | Array<null>
}

export const timesheetApi = createApi({
  reducerPath: 'timesheetAPI',
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
    getTimesheetsByClientId: builder.query<any, { id: number | undefined, page: number, limit: number }>({
      query: ({ id, page, limit }) => ({
        url: `timesheet/list/${id}?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    }),
    getPendingTimesheets: builder.query<any, { page: number, limit: number }>({
      query: ({ page, limit }) => ({
        url: `timesheet/pending/list/?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    }),
    updateTimesheetStatus: builder.mutation<any, { id: number, status: string, }>({
      query: ({ id, status }) =>
      ({
        url: `timesheet/status/${id}`,
        method: 'PUT',
        body: { status }
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
    }),
    updateTimesheet: builder.mutation<any, { id: number, timesheet: Timesheet, }>({
      query: ({ id, timesheet }) =>
      ({
        url: `timesheet/${id}`,
        method: 'PUT',
        body: timesheet
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
    }),
    addTimesheetNotes: builder.mutation<any, { id: number, notes: string, }>({
      query: ({ id, notes }) =>
      ({
        url: `timesheet/notes/${id}`,
        method: 'PUT',
        body: { notes }
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
    }),
    createTimesheet: builder.mutation<any, { timesheet: Timesheet }>({
      query: (timesheet) =>
      ({
        url: `timesheet`,
        method: 'POST',
        body: timesheet
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
    })
  })
})

export const {
  useGetTimesheetsByClientIdQuery,
  useGetPendingTimesheetsQuery,
  useUpdateTimesheetStatusMutation,
  useUpdateTimesheetMutation,
  useAddTimesheetNotesMutation,
  useCreateTimesheetMutation
} = timesheetApi;