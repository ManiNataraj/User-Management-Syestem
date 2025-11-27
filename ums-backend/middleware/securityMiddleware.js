const helmet = require('helmet');
const cors = require('cors');

const securityMiddleware = (app) => {
    // Basic CORS setup (allows all origins for dev, restrict in production)
    app.use(cors({
        origin: 'http://localhost:3000', // Frontend URL
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    }));

    // Helmet helps secure Express apps by setting various HTTP headers
    // app.use(helmet()); 
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows assets to be loaded cross-origin
    }));
    // Recommended: disable the X-Powered-By header
    app.disable('x-powered-by'); 
};

module.exports = securityMiddleware;