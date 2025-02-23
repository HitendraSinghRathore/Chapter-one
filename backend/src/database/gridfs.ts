import { MongoClient, Db, ObjectId,GridFSBucket } from 'mongodb';
import config from '../config';

let db: Db;
let bucket: GridFSBucket;

const mongoURI = config.mongo.uri;
console.log('Setting up mongo DB');
MongoClient.connect(mongoURI)
  .then(client => {
    db = client.db();
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log('GridFS initialized');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB for GridFS:', err);
  });

export { bucket, db, ObjectId };