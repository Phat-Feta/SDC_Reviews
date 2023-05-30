import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2000,
  duration: '30s',
};

export default function () {
  let product = Math.floor(Math.random()*(1000011 - 900011) + 900011);
  let resp = http.get(`http://localhost:3000/reviews/meta?product_id=${product}`);
  sleep(1);

  if (resp.status !== 200) {
    console.log(`Request to ${resp.request.url} with status ${resp.status} failed the checks!`);
  }
}


