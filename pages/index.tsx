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
  const { name, telephone, addressOne, addressTwo, twitter, facebook, instagram } = userDoc;

  // Return a new object with the extracted properties
  return {
    name,
    telephone,
    addressOne,
    addressTwo,
    twitter,
    facebook,
    instagram
    // Add other properties as needed
  };
}

export default function User({ user }: UserProps) {
  const values = Object.values(user);
  const titleText = `${user.name} Landscaping`
  return (
    <>
      <Head>
        <title>{'Plumber Template'}</title>
      </Head>
      <div className="plumber-template">
        <div className="contact-header">
          <div className="contact-details">
            <div className="contact-telephone">{user.telephone}</div>
            <div className="contact-address">{user.addressOne} {user.addressTwo}</div>
          </div>
          <div className="header-socials">
            <div className="Twitter">{user.twitter}</div>
            <div className="Faceebook">{user.facebook}</div>
            <div className="Instagram">{user.instagram}</div>
          </div>
        </div>
      </div>
    </>
  );
}

type UserDB = {
  name: string;
  telephone: string;
  addressOne: string;
  addressTwo: string;
  twitter: string;
  facebook: string;
  instagram: string;
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