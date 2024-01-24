import pkg from './node_modules/json-server/lib/';
const { create, router: _router, defaults } = pkg;

const server = create();
const router = _router('./jsonDB/db.json');
const middlewares = defaults();

server.use(middlewares);
server.use(router);

const PORT = 3000; // Change the port if needed

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
