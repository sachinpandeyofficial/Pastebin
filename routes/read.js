import express from 'express'
import { memcached } from '../memcached.js';
import { pastes } from '../mongodb.js';

const router = express.Router();

// Define a route to read data
router.get('/:id', async (req, res) => {
    const key = req.params.id;

    // Try to get data from Memcached
    memcached.get(key, function(err, data) {
        if (err) {
            console.error('Error getting data from Memcached:', err);
            // If error occurs, try to get data from MongoDB
            getDataFromMongo(key, res);
        } else {
            if (data) {
                console.log('Data found in Memcached:', data);
                res.send(data);
            } else {
                console.log('Data not found in Memcached');
                // If data not found in Memcached, try to get data from MongoDB
                getDataFromMongo(key, res);
            }
        }
    });
});

// Function to get data from MongoDB
async function getDataFromMongo(key, res) {
    try{
        const data = await pastes.findOne({ _id: key });

        if (data) {
            console.log('Data found in MongoDB:', data);
            // Set data in Memcached
            memcached.set(key, {
                s3Link: data.s3Link,
                content: data.content,
                createdAt: data.createdAt
            }, 3600, function(err) { // 3600 seconds = 1 hour
                if (err) {
                    console.error('Error setting data in Memcached:', err);
                } else {
                    console.log('Data set in Memcached');
                }
            });
            res.send(data);
        } else {
            console.log('Data not found in MongoDB');
            res.status(404).send('Data not found');
        }
    }
    catch(err){
        console.error('Error reading data from MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }
}

export default router;
