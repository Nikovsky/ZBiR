// @file: client/src/lib/api/axios.ts
import axios from 'axios'
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // cookie (HttpOnly)
  headers: { 'Content-Type': 'application/json', },
})
