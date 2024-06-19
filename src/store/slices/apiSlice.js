// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';

const baseQuery = async ({ queryFn }) => {
  try {
    const result = await queryFn();
    return { data: result };
  } catch (error) {
    return { error };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: builder => ({
    searchUsers: builder.query({
      queryFn: async (searchQuery) => {
        try {
          const usersRef = firestore().collection('users');
          const snapshot = await usersRef
            .where('username', '>=', searchQuery)
            .where('username', '<=', searchQuery + '\uf8ff')
            .get();

          const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { data: results };
        } catch (error) {
          return { error: 'Error fetching users' };
        }
      },
    }),
  }),
});

export const { useSearchUsersQuery } = apiSlice;
