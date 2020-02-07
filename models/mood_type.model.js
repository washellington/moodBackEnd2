import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

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
