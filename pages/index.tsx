import { ObjectId, WithId, Document } from "mongodb";
import clientPromise from "../lib/mongodb";
import Head from "next/head";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import plumber1Image from '../public/images/plumber-1.jpg';
import plumber2Image from '../public/images/plumber-2.jpg';
import leakImage from '../public/images/sink-leak.jpg';
import blockImage from '../public/images/blocked-drain.jpg';
import boilerImage from '../public/images/boiler-maintenance.jpg';
import { useState } from 'react';


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
  const titleText = `${user.name} Plumbing`
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
      } else {
        console.error('Form submission failed.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      <Head>
        <title>{'Plumber Template'}</title>
      </Head>
      <div className="plumber-template">
        <div className="contact-header">
          <div className="contact-details">
            <div className="contact-telephone"><FontAwesomeIcon icon={faPhone} />{user.telephone}</div>
            <div className="contact-address"><FontAwesomeIcon icon={faLocationDot} />{user.addressOne} {user.addressTwo}</div>
          </div>
          <div className="company-name">[Company Name]</div>
          <div className="header-socials">
            <div className="Twitter"><FontAwesomeIcon icon={faTwitter} />{user.twitter}</div>
            <div className="Faceebook"><FontAwesomeIcon icon={faFacebook} />{user.facebook}</div>
            <div className="Instagram"><FontAwesomeIcon icon={faInstagram} />{user.instagram}</div>
          </div>
        </div>
        <div className="hero">
          <div className="hero-text">
            <h3>Professional Plumbing</h3>
            <p>Welcome to [Company Name], your go-to destination for top-notch plumbing services. With years of experience, we are dedicated to providing high-quality plumbing solutions for residential and commercial clients.
               Our skilled team of plumbers is here to address all your plumbing needs with professionalism and efficiency.</p>
          </div>
          <div className="hero-image"><Image src={plumber2Image} alt='plumber'/></div>
        </div>
        <div className="contact-box">
          <div className="location">
            <div className="symbol"><FontAwesomeIcon icon={faLocationDot} /></div>
            <div className="text"><p className="title">Area:</p><p>{user.addressOne} {user.addressTwo}</p></div>
          </div>
          <div className="email">
            <div className="symbol"><FontAwesomeIcon icon={faEnvelope} /></div>
            <div className="text"><p className="title">Email:</p><p>Company Email</p></div>
          </div>
          <div className="phone">
            <div className="symbol"><FontAwesomeIcon icon={faPhone} /></div>
            <div className="text"><p className="title">Phone:</p><p>07496454598</p></div> {/*import user phone number*/}
          </div>
        </div>
        <div className="services">
          <div className="services-text">
            <h4>Our Services</h4>
            <p>At [Company Name], we offer a comprehensive range of plumbing services to ensure your property's plumbing system is in top condition. 
              From leak repairs, pipe installations, and boiler maintenance to bathroom and kitchen remodeling, our skilled team is committed to delivering reliable and professional plumbing solutions. 
              Trust us to keep your home or business running smoothly.</p>
          </div>
          <div className="services-cards">
            <div className="card">
              <Image src={leakImage} alt="leak"/>
              <p>Leak Repairs</p>
            </div>
            <div className="card">
              <Image src={blockImage} alt="block"/>
              <p>Drain Unblocking</p>
            </div>
            <div className="card">
              <Image src={boilerImage} alt="boiler"/>
              <p>Boiler Maintenance</p>
            </div>
          </div>
        </div>
        <div className="contact-us">
          <div className="contact-form-container">
            <div className="contact-text">
              <h4>Get in touch</h4>
              <p>Ready to schedule a plumbing service or have a question for us? Reach out to our experienced team today. We're here to assist you with all your plumbing needs. 
                Fill out the form, and we'll get back to you as soon as possible.</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Send</button>
            </form>
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