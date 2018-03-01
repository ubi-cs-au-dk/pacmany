const pg = require('pg')
var GAME_CONFIG = require('./config.json');

var connString = process.env.DATABASE_URL;

const pool = new pg.Pool({connectionString: connString});

pool.on('error', function (err, client) {
	console.error('idle client error', err.message, err.stack)
})

module.exports.query = function (text, values, callback) {
	console.log('query', text, values);
	return pool.query(text, values, callback);
};

module.exports.connect = function (callback) {
	return pool.connect(callback);
};