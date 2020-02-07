import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

async function initialize() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  await client.connect();
  const db = client.db("moodyDb");

  await db.createCollection("MentalState", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["rating", "mood_type", "date_created", "user"],
        properties: {
          rating: {
            bsonType: "number",
            description: "must be number and is required"
          },
          mood_type: {
            bsonType: "number",
            description: "must be a number and is required"
          },
          date_created: {
            bsonType: "number",
            description: "must be a unix timestamp number and is required"
          },
          user: {
            bsonType: "number",
            description: "must be a number and is required"
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
