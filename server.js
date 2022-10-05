const dotenv = require('dotenv');
const { app } = require('./app');
const { initModels } = require('./models/initmodels');

// Utils
const { db } = require('./utils/database.util');


dotenv.config({ path: './config.env' });

const startServer = async () => {
    try {
        await db.authenticate();

        // Establish the relations between models
        initModels();
        
        await db.sync();

        // Set server to listen
        const PORT = process.env.PORT ||  2801;

        app.listen(PORT, () => {
            console.log('Express app running');
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
