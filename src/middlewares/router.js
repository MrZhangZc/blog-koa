import Router from 'koa-router'

export const router = app => {
  const router = new Router()

  router.get('/', async ctx => {
    await ctx.render('home')
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}