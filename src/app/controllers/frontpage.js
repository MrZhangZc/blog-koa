import mongoose from 'mongoose';
import {logJson, getClientIP, getUserAgent, getAddress, getTomorrowTS } from '../../util';
import redisClient from '../../redis';
import {KEY} from '../../util/key';
import { getClearnData } from '../../util'
import moment from 'moment';
import { is, splitEvery, fromPairs } from 'ramda'
const User = mongoose.model('User');
const Article = mongoose.model('Article');
const Message = mongoose.model('Message');
const Category = mongoose.model('Category');
const Banner = mongoose.model('Banner');
const Visitor = mongoose.model('Visitor');
const BlogsyStemLog = mongoose.model('BlogsyStemLog');

export const home = async ctx => {
	try {
		logJson(300, 'someonein', 'blogzzc');
		const pageSize = 5;
		let pageNum = ctx.params.page
		if(pageNum && (isNaN(+pageNum) || !is(Number, +pageNum))) {
			return await ctx.render('onstage/404', {
				title: `张智超blog - 当前页面未找到`,
				desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
				url: 'https://blog.lihailezzc.com'
			});
		}
		if(pageNum === undefined) pageNum = 1

		const conditions = {publishd: true};
		if (ctx.query.keyword) {
			Object.assign(conditions, {content: new RegExp(ctx.query.keyword.trim(), 'i')});
		}
		const hotTitle = await redisClient.zrevrange(KEY.Article_LookTime, 0, 5)
		const [articles, totalCount, hotArticles, hotArticlesScore, scores, banners] = await Promise.all([
			Article.find(conditions, '-content')
				.skip((pageNum - 1) * 5)
				.limit(5)
				.populate('author')
				.populate('category')
				.sort({'meta.createdAt': -1}),
			Article.count(conditions),
			Article.find({ title: { $in:hotTitle }}, '-_id title slug'),
			redisClient.zrevrange(KEY.Article_LookTime, 0, 5, 'WITHSCORES'),
			redisClient.zrange(KEY.Article_LookTime, 0, -1, 'WITHSCORES'),
			Banner.find({}).sort({ rank: 1 })
		])
		const hot = fromPairs(splitEvery(2, hotArticlesScore))
		const allarticles = hotArticles.map(item => {
			return {
				title: item.title,
				slug: item.slug,
				score: hot[item.title]
			}
		})
		let pageCount = Math.ceil(totalCount / pageSize);
		await ctx.render('onstage/home', {
			title: `张智超blog - 记录学习笔记的个人博客网站${pageNum > 1 ? `第${pageNum}页` : ''}`,
			desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
			articles,
			allarticles,
			pageNum: +pageNum,
			pageCount: pageCount,
			watch: scores,
			banners,
			url: 'https://blog.lihailezzc.com'
		});
		const merber = getClientIP(ctx.request);
		const agent = getUserAgent(ctx.request)
		const userLIno = await getAddress(`https://restapi.amap.com/v3/ip?key=${KEY.GD_KEY}&ip=${merber}`);
		const visitor = new Visitor({
			ip: merber,
			province: typeof userLIno.data.province === 'object' ? undefined : userLIno.data.province,
			city: typeof userLIno.data.city === 'object' ? undefined : userLIno.data.city,
			adcoce: typeof userLIno.data.adcoce === 'object' ? undefined : userLIno.data.adcoce,
			agent,
		})
		await visitor.save()
		const blogsyStemLog = new BlogsyStemLog({
			ip: merber,
			type: 'homelook',
		})
		await blogsyStemLog.save()
		const expireatAt = getTomorrowTS();
		await redisClient.multi()
			.sadd(KEY.Visitors_Day, merber)
			.expireat(KEY.Visitors_Day, expireatAt)
      .exec();
		await redisClient.pfadd(KEY.Visitors_Total, merber);
	} catch (err) {
		console.log(err)
		logJson(500, 'home', 'blogzzc');
	}
};

export const article = async ctx => {
	try {
		const articleSlug = ctx.params.slug;
		const conditions = {slug: articleSlug};
		const article = await Article.findOne(conditions)
			.populate('author')
			.populate('category')
			.populate({path: 'comments', populate: {path: 'from'}})
			.sort({_id: -1});
		if(!article) {
			return await ctx.render('onstage/404', {
				title: `张智超blog - 当前页面未找到`,
				desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
				url: 'https://blog.lihailezzc.com'
			});
		}
		if (article.abbreviation) {
			logJson(300, 'article' + article.abbreviation, 'blogzzc');
		}
		const merber = getClientIP(ctx.request);
		const blogsyStemLog = new BlogsyStemLog({
			ip: merber,
			type: 'postlook',
			article: article.title
		})
		await blogsyStemLog.save()
		const score = (await redisClient.zscore(KEY.Article_LookTime, article.title)) || 0;
		const newScore = await redisClient
			.multi()
			.zadd(KEY.Article_LookTime, Number(score) + 1, article.title)
			.zscore(KEY.Article_LookTime, article.title)
			.exec();
		await ctx.render('onstage/article', {
			title: `张智超blog_${article.title}_发布于_${moment(article.meta.createdAt).format('YYYY-MM-DD HH:mm:ss')}`,
			desc: `${article.category ? article.category.name : ''}-${article.desc}-${article.tags.length ? article.tags.join('-') : ''}`,
			article: article,
			watch: newScore[1][1],
			url: `https://blog.lihailezzc.com/article/${articleSlug}`
		});
	} catch (err) {
		console.log(err)
		logJson(500, 'article', 'blogzzc');
	}
};

export const aboutMe = async ctx => {
	try {
		await ctx.render('onstage/aboutme', {
			title: '张智超blog_关于我',
			url: 'https://blog.lihailezzc.com/aboutMe',
			desc: '关于我的自我介绍'
		});
	} catch (err) {
		logJson(500, 'aboutme', 'blogzzc');
	}
};

export const personal = async ctx => {
	try {
		const cuser = ctx.session.user;
		const user = await User.findById(cuser._id);
		await ctx.render('onstage/personal', {
			title: '个人中心',
			tuser: user,
			url: ''
		});
	} catch (err) {
		logJson(500, 'personal', 'blogzzc');
	}
};

export const messageBoard = async ctx => {
	try {
		logJson(300, 'messagein', 'blogzzc');
		const messages = await Message.find()
			.populate('from')
			.populate('reply.from')
			.sort({_id: -1});
		const clearnMesage = messages.map(item => ({
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			_id: item._id,
			email: getClearnData(item.email),
			content: getClearnData(item.content),
		}))
		const action = '/message';
		await ctx.render('onstage/messageBoard', {
			title: '张智超blog_留言板',
			desc: '有什么想要交流的尽情留言吧',
			messages: clearnMesage,
			action: action,
			url: 'https://blog.lihailezzc.com/messageBoard'
		});
		const merber = getClientIP(ctx.request);
		const blogsyStemLog = new BlogsyStemLog({
			ip: merber,
			type: 'messagelook',
		})
		await blogsyStemLog.save()
	} catch (err) {
		logJson(500, 'messageboard', 'blogzzc');
	}
};

export const getCategoryPost = async ctx => {
	try {
		const pageSize = 5;
		let pageNum = ctx.params.page
		if(pageNum && (isNaN(+pageNum) || !is(Number, +pageNum))) {
			return await ctx.render('onstage/404', {
				title: `张智超blog - 当前页面未找到`,
				desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
				url: 'https://blog.lihailezzc.com'
			});
		}
		if(pageNum === undefined) pageNum = 1
		const categoryId = ctx.params.id;

		const category = await Category.findOne({_id:categoryId });
		if(!category) {
			return await ctx.render('onstage/404', {
				title: `张智超blog - 当前页面未找到`,
				desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
				url: 'https://blog.lihailezzc.com'
			});
		}
		const conditions = {publishd: true, category: categoryId};
		if (ctx.query.keyword) {
			Object.assign(conditions, {content: new RegExp(ctx.query.keyword.trim(), 'i')});
		}
		if(category.abbreviation) {
			logJson(300, 'category' + category.abbreviation, 'blogzzc');
		}
		const hotTitle = await redisClient.zrevrange(KEY.Article_LookTime, 0, 5)
		const [articles, totalCount, banners, hotArticles, hotArticlesScore, scores] = await Promise.all([
			Article.find(conditions)
				.skip((pageNum - 1) * 5)
				.limit(5)
				.populate('author')
				.populate('category')
				.sort({_id: -1}),
			Article.count(conditions),
			Banner.find({}).sort({ rank: 1 }),
			Article.find({ title: { $in:hotTitle }}, '-_id title slug'),
			redisClient.zrevrange(KEY.Article_LookTime, 0, 5, 'WITHSCORES'),
			redisClient.zrange(KEY.Article_LookTime, 0, -1, 'WITHSCORES'),
		])
		const hot = fromPairs(splitEvery(2, hotArticlesScore))
		const allarticles = hotArticles.map(item => {
			return {
				title: item.title,
				slug: item.slug,
				score: hot[item.title]
			}
		})
		let pageCount = Math.ceil(totalCount / pageSize);
		await ctx.render('onstage/home', {
			title: `张智超blog_${category.name}类别下的所有文章`,
			desc: `${category.desc}`,
			cate: category,
			articles: articles,
			allarticles,
			pageNum: +pageNum,
			pageCount: pageCount,
			watch: scores,
			banners
		});
		const merber = getClientIP(ctx.request);
		const blogsyStemLog = new BlogsyStemLog({
			ip: merber,
			type: 'catelook',
			category: category.name,
			url: `https://blog.lihailezzc.com/category/${categoryId}`
		})
		await blogsyStemLog.save()
	} catch (err) {
		console.log(err)
		logJson(500, 'getcategorypost', 'blogzzc');
		return await ctx.render('onstage/404', {
			title: `张智超blog - 当前页面未找到`,
			desc: '张智超个人博客网站，记录学习笔记和学习心得 nodejs mysql postgresql es redis mongodb docker...',
			url: 'https://blog.lihailezzc.com'
		});
	}
};

export const message = async ctx => {
	try {
		const { content, email } = ctx.request.body
		const message = await new Message({
			email: getClearnData(email),
			content: getClearnData(content)
		});
		await message.save();
		const merber = getClientIP(ctx.request);
		const blogsyStemLog = new BlogsyStemLog({
			ip: merber,
			type: 'messagesave',
		})
		blogsyStemLog.save()
		logJson(300, 'newmessage', 'blogzzc');
		ctx.response.redirect('/messageBoard');
	} catch (err) {
		logJson(500, 'message', 'blogzzc');
	}
};

export const messageReply = async ctx => {
	try {
		const messageId = ctx.params.id;
		const messages = await Message.find()
			.populate('from')
			.populate('reply.from')
			.sort({_id: -1});
		const action = `/reply/${messageId}`;
		await ctx.render('onstage/messageBoard', {
			title: '张智超blog_留言板',
			desc: '张智超blog_留言板',
			messages: messages,
			action: action,
			url: 'https://blog.lihailezzc.com/messageBoard'
		});
	} catch (err) {
		logJson(500, 'messagereply', 'blogzzc');
	}
};

export const reply = async ctx => {
	try {
		const userId = ctx.session.user._id;
		const replyContent = getClearnData(ctx.request.body.content);
		const messageId = ctx.params.id;
		const upReply = {$push: {reply: {from: userId, content: replyContent}}};
		await Message.updateOne({_id: messageId}, upReply);
		ctx.response.redirect('/messageBoard');
	} catch (err) {
		logJson(500, 'messagereply', 'blogzzc');
	}
};

export const uv = async ctx => {
	try {
		const visitors = await Visitor.find({city: {$ne:'未知'}}).sort({ _id: -1 })
		await ctx.render('backstage/uv', {
			title: '访客记录',
			visitors: visitors,
    });
	} catch (err) {
		logJson(500, 'uv', 'blogzzc');
	}
	// try {
  //   const ipaddr = await redisClient.smembers(KEY.Visitors_Day);
  //   //const address = await getAddress(`https://restapi.amap.com/v3/ip?key=${KEY.GD_KEY}&ip=${ipadd}`);
	// 	let address = []
	// 	for(let ip of ipaddr){
	// 		const add = await getAddress(`https://restapi.amap.com/v3/ip?key=${KEY.GD_KEY}&ip=${ip}`);
	// 		address.push(add.data)
	// 	}
	// 	await ctx.render('backstage/uv', {
	// 		title: '今日访客',
	// 		address: address
	// 	});
	// } catch (err) {
	// 	logJson(500, 'uv', 'blogzzc');
	// }
};
