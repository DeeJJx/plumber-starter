import { ObjectId, WithId, Document } from "mongodb";
import clientPromise from "../lib/mongodb";
import Head from "next/head";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import plumber2Image from '../public/images/plumber-2.jpg'
import { useEffect, useState } from 'react';
import AOS from 'aos'; //npm install --save-dev @types/aos - this install got rid of the tsx error for this, might be a similar thing for carousel?
import 'aos/dist/aos.css';
import  EmblaCarousel  from "../components/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'


type UserProps = {
  user: UserDB; // Assuming userObject is the expected type
};

function transformUser(userDoc: WithId<Document> | null): UserDB | null {
  if (userDoc === null) {
    return null;
  }

  // Extract the relevant properties from the user document
  const {
    email,
    name,
    telephone,
    addressOne,
    addressTwo = '',
    twitter = '',
    facebook = '',
    instagram = '',
    skillsDescription = '',
    skillsList = [],
    intro = '',
    companyName = ''
  } = userDoc; //default optional values to empty string if not provided

  // Return a new object with the extracted properties
  return {
    email,
    name,
    telephone,
    addressOne,
    addressTwo,
    twitter,
    facebook,
    instagram,
    skillsDescription,
    skillsList,
    intro,
    companyName
  };

}

export default function User({ user }: UserProps) {
  const titleText = `${user.name} Plumbing`;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration
      easing: 'ease-in-out', // Easing function
      once: true // Whether to only animate elements once
    });
  }, []);

  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDES = user.skillsList

  return (
    <>
      <Head>
        <title>{user.companyName}</title>
      </Head>
      <div className="plumber-template">
        <div className="contact-header">
          <div className="contact-details">
            <div className="contact-telephone"><FontAwesomeIcon icon={faPhone} />{user.telephone}</div>
            <div className="contact-address"><FontAwesomeIcon icon={faLocationDot} />{user.addressOne} {user.addressTwo}</div>
          </div>
          <div className="company-name">{user.companyName}</div>
          <div className="header-socials">
            {user.twitter && <div className="Twitter"><FontAwesomeIcon icon={faTwitter} />{user.twitter}</div>} {/* Added conditional rendering for socials incase some aren't provided */}
            {user.facebook && <div className="Facebook"><FontAwesomeIcon icon={faFacebook} />{user.facebook}</div>}
            {user.instagram && <div className="Instagram"><FontAwesomeIcon icon={faInstagram} />{user.instagram}</div>}
          </div>
        </div>
        <div className="hero-container" data-aos="fade-up">
          <div className="hero">
            <div className="hero-text">
              <h3>Professional Plumbing</h3>
              <p>Welcome to {user.companyName}, your go-to destination for top-notch plumbing services. With years of experience, we are dedicated to providing high-quality plumbing solutions for residential and commercial clients.
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
              <div className="text"><p className="title">Email:</p><p>{user.email}</p></div>
            </div>
            <div className="phone">
              <div className="symbol"><FontAwesomeIcon icon={faPhone} /></div>
              <div className="text"><p className="title">Phone:</p><p>{user.telephone}</p></div>
            </div>
          </div>
        </div>
        <div className="services" data-aos="fade-up">
          <div className="services-text">
            <h4>Our Services</h4>
            <p>At {user.companyName}, we offer a comprehensive range of plumbing services to ensure your property's plumbing system is in top condition. 
              From leak repairs, pipe installations, and boiler maintenance to bathroom and kitchen remodeling, our skilled team is committed to delivering reliable and professional plumbing solutions. 
              Trust us to keep your home or business running smoothly.</p>
          </div>
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          {user.skillsDescription && 
          <div className="skills-description-container">
            <div className="skills-description-text">
              {user.skillsDescription}
            </div>
          </div>
          }
        </div>
        <div className="contact-us" data-aos="fade-up">
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
  email: string;
  name: string;
  telephone: string;
  addressOne: string;
  addressTwo?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  skillsDescription?: string;
  skillsList: Array<string>;
  intro?: string;
  companyName: string;
  // Add other properties as needed
  //Question marks show optional fields - doesn't work for skillsList
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