// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  // On récupère le token depuis le cookie nommé "token"
  const token = useCookie<string>('token').value

  // Si aucun token n'est présent et que l'utilisateur n'est pas sur /login ou /register, redirige vers /login
  if (!token && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // Si un token est présent et que l'utilisateur tente d'accéder à /login ou /register, redirige vers /
  if (token && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
