const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT=3000;


const creatorsRoute=require("./routes/creators");
const backorsRoute=require("./routes/backers");

app.use(cors());
app.use(express.json()); 

app.use(bodyParser.json());

app.use("/creators",creatorsRoute);
app.use("/backors",backorsRoute)

app.get('/', (req, res) => {
    res.json({ message: "API Base URL is working!" }); 
  });
  
app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 
