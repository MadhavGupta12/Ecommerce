import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    }
  }),
  tagTypes: ['Product', 'Category', 'Order', 'User', 'Stats'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body })
    }),
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body })
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' })
    }),
    getProducts: builder.query({
      query: (params = {}) => ({ url: '/products', params }),
      providesTags: ['Product']
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }]
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Product']
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product']
    }),
    createProductReview: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}/reviews`, method: 'POST', body }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Product', id: arg.id }]
    }),
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category']
    }),
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order']
    }),
    getMyOrders: builder.query({
      query: () => '/orders/mine',
      providesTags: ['Order']
    }),
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order']
    }),
    payOrder: builder.mutation({
      query: ({ id, details }) => ({ url: `/orders/${id}/pay`, method: 'PUT', body: details }),
      invalidatesTags: ['Order']
    }),
    deliverOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/deliver`, method: 'PUT' }),
      invalidatesTags: ['Order']
    }),
    getPaypalConfig: builder.query({
      query: () => '/paypal/config'
    }),
    getStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Stats']
    }),
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User']
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User']
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useGetPaypalConfigQuery,
  useGetStatsQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateProductReviewMutation
} = apiSlice;
