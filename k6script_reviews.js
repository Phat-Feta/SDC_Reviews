import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2000,
  duration: '30s',
};

export default function () {
  let product = Math.floor(Math.random()*(1000011 - 900011) + 900011);
  http.get(`http://localhost:3000/reviews?product_id=${product}`);
  sleep(1);
}

