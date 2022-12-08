import mongoose from "mongoose";

export const getCollection = (
  collection: any,
  schema: any
): any => {
  // const db = mongoose.connection.useDb(`oa${realm}`);
  const db = mongoose.connection.useDb(`ioaksite`);
  return db.model(collection, schema);
};

export const getGlobalCollection = (collection: any, schema: any): any => {
  const db = mongoose.connection.useDb(`ioaksite`);
  return db.model(collection, schema);
};
