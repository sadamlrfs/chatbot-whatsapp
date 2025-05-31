const app = require('./routes/route');
const { PORT } = require('../config');

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
