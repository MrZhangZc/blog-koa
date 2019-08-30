import axios from 'axios';

const OneDay = 24 * 3600 * 1000;

export const logJson = (level, msg, proj) => {
	console.log(`${level} ${msg} ${proj}`);
};

export function getClientIP(ctx) {
	return ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips;
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
