const express = require('express');
const cors = require('cors');

const DBConnection = require('./db/connection');

const app = express();

//config JSON resonse
app.use(express.json());

// Solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Public folder for images
app.use(express.static('public')) 

// Routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes);

// Starting Server
const startServer = async () => {
  try {
    DBConnection('mongodb+srv://cezarguimaraes:eslnn0Ugujqm5HTZ@cluster0.qurn9gg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    app.listen(5000, () => console.log(`Listening on port 5000...`));
  } catch (error) {
    console.error(error)
  }
}
startServer();