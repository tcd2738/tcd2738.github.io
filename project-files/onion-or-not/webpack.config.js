const path = require('path');

module.exports = {
    entry: './client/client.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: 'bundle.js',
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
    }
};