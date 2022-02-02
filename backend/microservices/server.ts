import express from 'express';

const app = express();
const port = 5000;


app.listen(port, () => {
  console.log(`micro-services communication is running on port http://localhost:${port}/graphql.`);
});

require('./graphql')(app);
