import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

async function initialize() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  await client.connect();
  const db = client.db("moodyDb");

  await db.createCollection("MentalState", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["rating", "mood_type", "date_created", "entry_date", "user"],
        properties: {
          rating: {
            bsonType: "number",
            description: "must be number and is required"
          },
          mood_type: {
            bsonType: "string",
            description: "must be object id of the mood type and is required"
          },
          date_created: {
            bsonType: "number",
            description: "must be a unix timestamp number and is required"
          },
          entry_date: {
            bsonType: "number",
            description: "must be a unix timestamp number and is required"
          },
          user: {
            bsonType: "string",
            description: "must be a object id of the user and is required"
          },
          notes: {
            bsonType: "string"
          }
        }
      }
    }
  });

  return db;
}

const MentalState = initialize();

export default MentalState;
