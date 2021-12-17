import { writeFileSync }  from 'fs'
import { join } from 'path'
import mongoose from 'mongoose';
import { logJson } from '../../util'
import { BASE_URL } from '../../util'

const Article = mongoose.model('Article');
const Category = mongoose.model('Category')

export const siteMapTask = async ctx => {
	try {
		const password = ctx.query.pass
    if(!password || password !== process.env.TASK_PASS) {
      return await ctx.render('onstage/404', {
				title: `张智超blog - 当前页面未找到`,
				desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
				url: 'https://blog.lihailezzc.com'
			});
    }
    const pageSize = 5

		const [articles, categories] = await Promise.all([
      Article.find({}, '-_id slug'),
      Category.find({}, '_id')
    ])
    const totalPage = Math.ceil(articles / pageSize)
		const arr1 = articles.map(item => `${BASE_URL}article/${item.slug}\n`)
    const arr2 = categories.map(item => `${BASE_URL}category/${item._id}\n`)
    const res = [...arr1, ...arr2]
    res.push(`${BASE_URL}\n`)
    let curPage = 1
    while(curPage <= totalPage) {
      res.push(`${BASE_URL}${curPage}\n`)
      curPage++
    }
    const filesStr = res.join('')
    writeFileSync(join(process.cwd(), './public/Sitemap.txt'), filesStr, { encoding: 'utf8', mode: 438, flag: 'w' } )
    return await ctx.render('onstage/404', {
      title: `张智超blog - 当前页面未找到`,
      desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
      url: 'https://blog.lihailezzc.com'
    });
	} catch (err) {
    console.log(err)
		logJson(500, 'siteMapTask', 'blogzzc');
	}
};