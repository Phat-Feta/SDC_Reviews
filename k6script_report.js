import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2000,
  duration: '30s',
};

export default function () {
  let review = Math.floor(Math.random()*(5774973 - 5197475) + 5197475);
  http.put(`http://localhost:3000/reviews/${review}/report`);
  sleep(1);
}

