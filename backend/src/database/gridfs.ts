import { MongoClient, Db, ObjectId } from 'mongodb';
import Grid from 'gridfs-stream';
import config from '../config';

let gfs: Grid.Grid;
let db: Db;

const mongoURI = config.mongo.uri;
console.log('Setting up mongo DB');
MongoClient.connect(mongoURI)
  .then(client => {
    db = client.db();
    gfs = Grid(db, client);
    gfs.collection('uploads');
    console.log('GridFS initialized');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB for GridFS:', err);
  });

export { gfs, db, ObjectId };