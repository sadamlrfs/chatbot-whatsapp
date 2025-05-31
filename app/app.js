require('dotenv').config();
const app = require('./hooks/mutations');

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
