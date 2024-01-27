import { ObjectId, WithId, Document } from "mongodb";
import clientPromise from "../lib/mongodb";
import Head from "next/head";

type UserProps = {
  user: UserDB; // Assuming userObject is the expected type
};

function transformUser(userDoc: WithId<Document> | null): UserDB | null {
  if (userDoc === null) {
    return null;
  }

  // Extract the relevant properties from the user document
  const { name, telephone, addressOne, addressTwo } = userDoc;

  // Return a new object with the extracted properties
  return {
    name,
    telephone,
    addressOne,
    addressTwo,
    // Add other properties as needed
  };
}

export default function User({ user }: UserProps) {
  const values = Object.values(user);
  const titleText = `${user.name} Landscaping`
  return (
    <div>
      <Head>
        <title>{titleText}</title>
      </Head>
      <h1>User Profile</h1>
      <ul>
        {values.map((value, index) => {
          // Check if the value is not null
          if (value !== null) {
            return (
              <li key={index}>{value}</li>
            );
          }
          return null; // Skip null values
        })}
      </ul>
    </div>
  );
}

type UserDB = {
  name: string;
  telephone: string;
  addressOne: string;
  addressTwo: string;
  // Add other properties as needed
};

export async function getStaticProps({}) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const userId = `${process.env.uniqueId}`;
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid ObjectId");
    }

    const objectId = new ObjectId(userId);

    // Modify the query to find the specific user by their ID
    // ...
    const userDoc: WithId<Document> | null = await db
      .collection("mainusers")
      .findOne({ _id: objectId });
    // ...

    const user: UserDB | null = transformUser(userDoc);
    
    return {
      props: { user },
    };
  } catch (e) {
    console.error(e);
    // Return an empty object or null if there's an error
    return {
      props: { user: null },
    };
  }
}