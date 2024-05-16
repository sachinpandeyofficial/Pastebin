import express from 'express'
import readRoutes from './routes/read.js'
import writeRoutes from './routes/write.js'

// Create an Express application
const app = express();

// Parse JSON request bodies
app.use(express.json({limit: '10mb'})); 
app.use(express.urlencoded({limit: '10mb'}));

app.use('/read', readRoutes);
app.use('/write', writeRoutes);

// Start the server
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if available, otherwise use port 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
