import { Button, Card, Descriptions } from "antd";
import {
  AiOutlineFacebook,
  AiOutlineHome,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineTwitter,
  AiOutlineYoutube,
} from "react-icons/ai";
import { BiDetail, BiStore, BiTimeFive } from "react-icons/bi";
import { Link } from "react-router-dom";

const StorefrontData = ({ data }: any) => {
  const {
    _id,
    shopName,
    description,
    logo,
    contact,
    socialMedia,
    pages,
    createdAt,
    updatedAt,
  } = data;

  return (
    <Card title="Storefront Information" bordered>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Shop Name">
          <BiStore /> {shopName}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          <BiDetail /> {description}
        </Descriptions.Item>
        <Descriptions.Item label="Logo">
          <div className="flex items-center space-x-4">
            <img
              src={logo || "https://via.placeholder.com/150"}
              alt="Shop Logo"
              className="object-cover rounded"
              style={{ width: 150, height: 150 }} // Adjust size as needed
            />
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Contact Email">
          <AiOutlineMail /> {contact.email}
        </Descriptions.Item>
        <Descriptions.Item label="Contact Phone">
          <AiOutlinePhone /> {contact.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Contact Address">
          <AiOutlineHome /> {contact.address}
        </Descriptions.Item>
        <Descriptions.Item label="Social Media">
          <div className="flex flex-col space-y-2">
            <a
              href={socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineFacebook /> Facebook
            </a>
            <a
              href={socialMedia.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineTwitter /> Twitter
            </a>
            <a
              href={socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineInstagram /> Instagram
            </a>
            <a
              href={socialMedia.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineLinkedin /> LinkedIn
            </a>
            <a
              href={socialMedia.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineYoutube /> YouTube
            </a>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Pages">
          <div className="flex flex-col space-y-2">
            <Link to={`/pages/${pages.aboutUs}`}>About Us</Link>
            <Link to={`/pages/${pages.termsAndConditions}`}>
              Terms and Conditions
            </Link>
            <Link to={`/pages/${pages.privacyPolicy}`}>Privacy Policy</Link>
            <Link to={`/pages/${pages.refundPolicy}`}>Refund Policy</Link>
          </div>
        </Descriptions.Item>
        {/* <Descriptions.Item label="FAQ">
          <div className="flex flex-col space-y-2">
            {faq.map((item: any, index: number) => (
              <div key={index}>
                <strong>Q:</strong> {item.question} <br />
                <strong>A:</strong> {item.answer}
              </div>
            ))}
          </div>
        </Descriptions.Item> */}

        <Descriptions.Item label="Created At">
          <BiTimeFive /> {new Date(createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          <BiTimeFive /> {new Date(updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Link to={`/dashboard/storefront/manage/edit/${_id}`}>
        <Button className="mt-4 btn">Edit Storefront Information</Button>
      </Link>
    </Card>
  );
};

export default StorefrontData;
