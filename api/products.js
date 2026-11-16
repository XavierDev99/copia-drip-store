import { entries } from '../src/data/catalogEntries.js';

export default function products(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.statusCode = 405;
    response.end(JSON.stringify({ error: 'Método não permitido' }));
    return;
  }
  response.end(JSON.stringify({ entries }));
}
