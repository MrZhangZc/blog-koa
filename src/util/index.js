import axios from 'axios';
import { unlinkSync } from 'fs'
import { join } from 'path'

const OneDay = 24 * 3600 * 1000;

export const logJson = (level, msg, proj) => {
	console.log(`${level} ${msg} ${proj}`);
};

export function deleteTmpFile(name) {
  const path = join(__dirname, `../../public/tmp/${name}`)
  unlinkSync(path)
}

export function getClientIP(req) {
  let ip= req.headers['x-forwarded-for'] || 
  req.ip || 
  req.connection.remoteAddress || 
  req.socket.remoteAddress || 
  req.connection.socket.remoteAddress 
  || ''
  if(ip) {
    ip = ip.replace('::ffff:', '')
  }
  return ip;
}

export function getUserAgent(req) {
  return req.headers['user-agent'];
}

export const getAddress = url => {
	return axios.get(url);
};

export function getTomorrowTS() {
  let date = new Date();
  if (date.getUTCHours() < 16) {
    date.setUTCHours(16, 0, 0, 0);
  } else {
    date.setTime(date.getTime() + OneDay);
    date.setUTCHours(16, 0, 0, 0);
  }
  return Math.floor(date.getTime() / 1000);
}

export const BASE_URL = 'https://blog.lihailezzc.com/'
