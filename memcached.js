import Memcached from 'memcached'


// Connect to Memcached server
var memcached = new Memcached([ 'localhost:11211' ]); 

export { memcached }