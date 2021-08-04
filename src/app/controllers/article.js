import * as fs from 'fs'
import * as path from 'path'
import mongoose from 'mongoose';
import slug from 'slug';
import pinyin from 'pinyin';
import {logJson} from '../../util';
import redisClient from '../../redis';
import {KEY} from '../../util/key';

import { saveToQiNIu } from '../../util/qiniu'
import { deleteTmpFile } from '../../util/index'

const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

export const showArticles = async ctx => {
	try {
		let sortby = ctx.query.sortby ? ctx.query.sortby : 'meta.createdAt';
		let sortdir = ctx.query.sortdir ? ctx.query.sortdir : 'desc';
		if (['lookTimes', 'category', 'meta.createdAt', 'publishd'].indexOf(sortby) === -1) {
			sortby = 'meta.createdAt';
		}

		if (['desc', 'asc'].indexOf(sortdir) === -1) {
			sortdir = 'desc';
		}

		let sortObj = {};
		sortObj[sortby] = sortdir;

		const articles = await Article.find()
			.sort(sortObj)
			.populate('author')
			.populate('category')
			.sort({_id: -1});
		const scores = await redisClient.zrange(KEY.Article_LookTime, 0, -1, 'WITHSCORES');
		const totalUV = await redisClient.pfcount(KEY.Visitors_Total);
		const dayUv = await redisClient.scard(KEY.Visitors_Day);
		await ctx.render('backstage/article/index', {
			title: '文章列表',
			articles: articles,
			sortdir: sortdir,
			sortby: sortby,
			watch: scores,
			totalUV: totalUV,
			dayUv: dayUv
		});
	} catch (err) {
		logJson(500, 'showarticles', 'blogzzc');
	}
};

export const addArticle = async ctx => {
	try {
		await ctx.render('backstage/article/add', {
			title: '添加文章',
			uploadUrl: process.env.UPLOAD_URL,
		});
	} catch (err) {
		logJson(500, 'addarticle', 'blogzzc');
	}
};

export const postArticle = async ctx => {
	try {
		const opts = ctx.request.body;
		const title = opts.title.trim();
		const abbreviation = opts.abbreviation.trim();
		const userinfo = ctx.state.user;
		const tags = opts.tags.split(',');
		const py = pinyin(title, {
			style: pinyin.STYLE_NORMAL,
			heteronym: false
		})
			.map(function(item) {
				return item[0];
			})
			.join(' ');
		const article = new Article({
			title: title,
			abbreviation: abbreviation,
			content: opts.content,
			slug: slug(py),
			tags: tags,
			imgurl: opts['file-data'],
			category: opts.category,
			author: userinfo._id
		});
		await article.save();
		ctx.response.redirect('/admin/article');
	} catch (err) {
		logJson(500, 'postArticle', 'blogzzc');
	}
};

export const editArticle = async ctx => {
	try {
		const article_id = ctx.params.id;
		const article = await Article.findById(article_id).populate('category');
		await ctx.render('backstage/article/edit', {
			title: '修改文章',
			article: article
		});
	} catch (err) {
		logJson(500, 'editarticle', 'blogzzc');
	}
};

export const postEditArticle = async ctx => {
	try {
		const article_id = ctx.params.id;
		const opts = ctx.request.body;
		const py = pinyin(opts.title, {
			style: pinyin.STYLE_NORMAL,
			heteronym: false
		})
			.map(function(item) {
				return item[0];
			})
			.join(' ');
		const upData = {$set: {title: opts.title, slug: slug(py), category: opts.category, content: opts.content, imgurl: opts.imgsrc}};
		await Article.updateOne({_id: article_id}, upData);
		ctx.response.redirect('/admin/article');
	} catch (err) {
		logJson(500, 'editarticle', 'blogzzc');
	}
};

export const deleteArticle = async ctx => {
	try {
		const article_id = ctx.params.id;
		const upPub = {$set: {publishd: false}};
		await Article.updateOne({_id: article_id}, upPub);
		ctx.response.redirect('/admin/article');
	} catch (err) {
		logJson(500, 'deletearticle', 'blogzzc');
	}
};

export const publishdArticle = async ctx => {
	try {
		const article_id = ctx.params.id;
		const upPub = {$set: {publishd: true}};
		await Article.updateOne({_id: article_id}, upPub);
		ctx.response.redirect('/admin/article');
	} catch (err) {
		logJson(500, 'publishdarticle', 'blogzzc');
	}
};

export const trueDeleteArticle = async ctx => {
	try {
		const articleId = ctx.params.id;
		await Article.deleteOne({_id: articleId});
		ctx.response.redirect('/admin/article');
	} catch (err) {
		logJson(500, 'truedeletearticle', 'blogzzc');
	}
};

export const comment = async ctx => {
	try {
		const articleId = ctx.params.id;
		const { comment:content , email } = ctx.request.body
		const article = await Article.findById(articleId);
		const comment = await new Comment({
			email,
			content
		});
		await comment.save();
		const upComment = {$push: {comments: comment._id}};
		await Article.updateOne({_id: articleId}, upComment);
		logJson(300, 'newcomment', article.abbreviation);
		ctx.response.redirect('/article/' + article.slug);
	} catch (err) {
		logJson(500, 'comment', 'blogzzc');
	}
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const upload = async ctx => {
	const file = ctx.request.files['file-data'];
	const paths = ctx.request.files['file-data']['path']
	const name = ctx.request.files['file-data']['name']
	const reader = fs.createReadStream(paths);
  let filePath = path.join(__dirname, '../../../public/tmp') + `/${name}`;
  const upStream = fs.createWriteStream(filePath);
  reader.pipe(upStream);
	await sleep(3000)
	const res = await saveToQiNIu(name)
	if(res.key) deleteTmpFile(res.key)
  return ctx.body = 'res';
}
