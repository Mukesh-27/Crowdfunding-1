const express = require('express');
const router = express.Router();

// Example route to get all backers
router.get('/', (req, res) => {
  res.send('List of all backers');
});


// Example route to create a new backer
router.post('/', (req, res) => {
  const newBacker = req.body; // Assuming the backer details are sent in the request body
  res.status(201).send(`New backer created: ${JSON.stringify(newBacker)}`);
});


module.exports = router;
