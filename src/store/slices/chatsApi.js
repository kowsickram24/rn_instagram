// src/features/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { firestore } from '../../../firebase.config'; // Adjust the import path as needed

const baseQuery = async ({ url, method = 'GET', body }) => {
  let response;
  switch (method) {
    case 'GET':
      response = await firestore().collection(url).get();
      return response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    case 'DELETE':
      await firestore().collection(url).doc(body).delete();
      return;
    // Handle other methods if needed
    default:
      throw new Error('Unsupported method');
  }
};

export const chatsApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: builder => ({
    getChats: builder.query({
      query: currentUser => ({
        url: `chats?members=${currentUser.userId}`,
        method: 'GET',
      }),
      transformResponse: response => {
        return response.map(async chat => {
          const secondUserId = chat.members.find(id => id !== currentUser.userId);
          const userDoc = await firestore().collection('users').doc(secondUserId).get();
          return { id: chat.id, ...chat, secondUser: userDoc.data() };
        });
      },
    }),
    deleteChat: builder.mutation({
      query: chatId => ({
        url: `chats/${chatId}`,
        method: 'DELETE',
        body: chatId,
      }),
    }),
  }),
});

export const { useGetChatsQuery, useDeleteChatMutation } = chatsApi;
