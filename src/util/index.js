import axios from 'axios';

const OneDay = 24 * 3600 * 1000;

export const logJson = (level, msg, proj) => {
	console.log(`${level} ${msg} ${proj}`);
};

export function getClientIP(req) {
	return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
  req.headers['x-real-ip'] 
  //|| '114.247.50.2'
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
