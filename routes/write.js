import express from 'express'
import path, { dirname } from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { memcached } from '../memcached.js';
import { pastes } from '../mongodb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data'); // Directory to store large text files

const router = express.Router();

// Ensure the data directory exists
fs.mkdir(dataDir, { recursive: true })
    .then(() => {
        console.log('Data directory created successfully.');
    })
    .catch(err => {
        console.error('Error creating data directory:', err);
    });

// Define a route to write data
router.post('/', async (req, res) => {
    console.log('req', req.body)
    const { key, value } = req.body; 

    try {
        let valueToCache = value;
        let filePath = null;

        // If the value exceeds 100KB, store only the first 100KB in Memcached
        if (value.length > 102400) {
            valueToCache = value.substring(0, 102400);

            // Store data in storage service, locally as of now
            filePath = path.join(__dirname, `../data/${key}.txt`);
            await fs.writeFile(filePath, value);

            // Insert path of file in db
            await pastes.insertOne({
                    _id: key,
                    s3Link: filePath,
                    content: valueToCache,
                    createdAt: Date.now() 
                });
            console.log('File path stored in MongoDB:', filePath);
        }
        else {
            // Insert data in db
            const result = await pastes.insertOne({
                _id: key,
                s3Link: null,
                content: value,
                createdAt: Date.now() 
            });
            console.log('Data stored in MongoDB:');
        }

        // Store in Memcached
        memcached.set(key, {
            s3Link: filePath,
            content: valueToCache,
            createdAt: Date.now() 
        }, 3600, function(err) { // 3600 seconds = 1 hour
            if (err) {
                console.error('Error setting data in Memcached:', err);
            } else {
                console.log('Data set in Memcached');
            }
        });

        res.status(201).send('Data stored successfully');
    } catch (err) {
        console.error('Error writing data:', err);
        res.status(500).send('Internal Server Error');
    }
});


export default router;
