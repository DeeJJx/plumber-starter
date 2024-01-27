import { ObjectId } from "mongodb"; // Import ObjectId from mongodb library
import clientPromise from "../lib/mongodb";
import Head from "next/head";
const uniqueId = process.env.uniqueId; // Access the unique ID from environment variables

export default function User({ user }) {
  return (
    <div>
      <Head>
        <title>Your Page Title</title>
      </Head>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <h2>{user.name}</h2>
          <ul>
            <li>{user.telephone}</li>
            <li>{user.address}</li>
            <li>{user.postcode}</li>
          </ul>
          {/* Add other user information as needed */}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
}

export async function getStaticProps({}) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    // Assuming the userId is provided as a query parameter
    // const userId = params.userId;
    const userId = uniqueId;
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid ObjectId");
    }

    const objectId = new ObjectId(userId);

    // Modify the query to find the specific user by their ID
    const user = await db.collection("tradesmen").findOne({ _id: objectId });
    console.log(user);

    return {
      props: { user: user ? JSON.parse(JSON.stringify(user)) : null },
    };
  } catch (e) {
    console.error(e);
    // Return an empty object or null if there's an error
    return {
      props: { user: null },
    };
  }
}
