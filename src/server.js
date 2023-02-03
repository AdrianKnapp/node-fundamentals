import http from 'node:http';

const users = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/users'){
    return res
    .setHeader('Content-Type', 'application/json')
    .end(JSON.stringify(users));
  }

  if (method === 'POST' && url === '/users') {
    users.push({
      id: users.length + 1,
      name: 'Joe Doe',
      email: 'joedoe@example.com'
    })

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end();
})

server.listen(3333);