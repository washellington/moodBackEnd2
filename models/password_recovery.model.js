import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

async function initialize() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  await client.connect();
  const db = client.db("moodyDb");

  await db.createCollection("PasswordRecovery", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "email",
          "hashed_token",
          "date_requested",
          "expiration_date"
        ],
        properties: {
          email: {
            bsonType: "string",
            description: "must be a string"
          },
          hashed_token: {
            bsonType: "string",
            description: "must be a string "
          },
          date_requested: {
            bsonType: "number",
            description: "must be a number and is required"
          },
          expiration_date: {
            bsonType: "number",
            description: "must be a number and is required"
          }
        }
      }
    }
  });

  return db;
}

const PasswordRecovery = initialize();

export default PasswordRecovery;
