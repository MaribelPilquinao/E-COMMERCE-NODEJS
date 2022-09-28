const dotenv = require('dotenv');
const { app } = require('./app');
const { initModels } = require('./models/initmodels');

// Utils
const { db } = require('./utils/database.util');


dotenv.config({ path: './config.env' });

const startServer = async () => {
    try {
        await db.authenticate();

        initModels();
        
        await db.sync();

        // Establish the relations between models

        // Set server to listen
        const PORT = 2801;

        app.listen(PORT, () => {
            console.log('Express app running');
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
