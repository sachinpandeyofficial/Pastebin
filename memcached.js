import Memcached from 'memcached'


// Connect to Memcached server
const memcachedURL = process.env.MEMCACHED_URL || 'localhost:11211';
var memcached = new Memcached([ memcachedURL ]); 

export { memcached }