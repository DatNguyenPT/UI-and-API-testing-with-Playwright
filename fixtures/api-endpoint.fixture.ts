export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  GETALLUSERS: '/users',
  GETUSERBYID: (id: number) => `/users/${id}`,
  ADDNEWUSER: '/users',
  UPDATEAUSER: (id: number) => `/users/${id}`,
  DELETEAUSER: (id: number) => `/users/${id}`,
};