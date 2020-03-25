import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

async function initialize() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  await client.connect();
  const db = client.db("moodyDb");

  await db.createCollection("MoodType", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["mood_type"],
        properties: {
          mood_type: {
            bsonType: "string",
            description:
              "must be string and is required, describes what we are setting a mood rating to"
          }
        }
      }
    }
  });

  return db;
}

const MoodType = initialize();

export default MoodType;
