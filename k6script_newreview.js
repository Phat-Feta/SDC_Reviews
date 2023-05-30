import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
};

export default function () {
  let product = Math.floor(Math.random()*(1000011 - 900011) + 900011);
  const body = {
    "product_id": product,
    "rating": 1,
    "summary": "Hello world",
    "body": "this is a test body",
    "recommend": false,
    "name": "tester",
    "email": "tester@gmail.com",
    "photos": ["testurl.com", "anotherurl.net"],
    "characteristics": {
        "3334": 5,
        "3335": 3,
        "3336": 2,
        "3337": 4
        }
  }
  http.post(`http://localhost:3000/reviews?product_id=${product}`, JSON.stringify(body), {headers: {'Content-Type': 'application/json'}});
  sleep(1);
}


