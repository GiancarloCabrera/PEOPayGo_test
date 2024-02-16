import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { PAY_TYPES } from "@/types/payTypes";
interface Employee {
  name: string,
  payType: PAY_TYPES,
  hours: number,
  companyId: number
}

export const employeeApi = createApi({
  reducerPath: 'employeesAPI',
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
    getEmployeesByClientId: builder.query<any, { id: number | undefined, page: number, limit: number }>({
      query: ({ id, page, limit }) => ({
        url: `employee/list/${id}?page=${page}&limit=${limit}`,
        method: 'GET'
      })
    }),
    deleteEmployee: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `employee/${id}`,
        method: 'DELETE'
      })
    }),
    createEmployee: builder.mutation<any, { employee: Employee }>({
      query: (employee) =>
      ({
        url: `employee`,
        method: 'POST',
        body: employee
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
    }),
    editEmployee: builder.mutation<any, { id: number, employee: Employee, }>({
      query: ({ id, employee }) =>
      ({
        url: `employee/${id}`,
        method: 'PUT',
        body: employee
      }),
      transformResponse: (response: { data: any, status: number }, meta, arg) => { response.data, response.status },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
    })
  })
})

export const {
  useGetEmployeesByClientIdQuery,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
  useEditEmployeeMutation
} = employeeApi;