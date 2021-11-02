// Configuring the databas
import { MONGO_URL, MONGO_CONFIG } from '../../config';
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const options: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      poolSize: MONGO_CONFIG.poolSize,
      family: 4
    };

    // Connecting to the database
    mongoose.connect(MONGO_URL, options);

    // mongoose.set('debug', true);

    const mongoDb = mongoose.connection;
    mongoDb.on('error', () => {
      console.log(`Unable to connect to mongo database`);
    });

    mongoDb.once('open', () => {
      console.log(`Successfully connected to the mongo database`);
    });
  } catch (err) {
    console.error('Could not connect to the database. Exiting now...:', err);
  }
};

export default connectMongoDB;
