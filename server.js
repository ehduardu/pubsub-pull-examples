const express = require('express')
const app = express()
const port = 3008

app.use(express.json())

app.post('/', (req, res) => {
  console.log('message:', req.body.message);
  res.status(204).send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})