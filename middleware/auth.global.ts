import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie<string>('token').value

  if (!token && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  if (token && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
