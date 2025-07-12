import dotenv from 'dotenv'

import app from './app';

dotenv.config({ path: './../.env' })

// Catching Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED EXCEPTION! Shutting down...");

    process.exit(1);
});

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => { console.log("listening on port 3000") })

process.on("unhandledRejection", (err: Error) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");

    // By doing server.close(), we give server time to finish all requests that's
    // pending.
    server.close(() => {
        process.exit(1);
    });
});
