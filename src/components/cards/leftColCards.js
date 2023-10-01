import { NavLink } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import appContext from "../context/appContext";
import "react-loading-skeleton/dist/skeleton.css";
import { getAllUsersUrl } from "../../endpoints";

// images
import {
  home,
  Listings,
  Prodcasts,
  Videos,
  Tags,
  FAQ,
  ForemShop,
  Sponsors,
  About,
  Contact,
  Guides,
  Softwarecomparisons,
  CodeofConduct,
  PrivacyPolicy,
  Termsofuse,
  tweeter,
  facebook,
  instagram,
  github,
  twitch,
  assetTemp,
  foremTemp,
} from "../utils/images";
import { LinkText, Button } from "../components";

// --------------------------------------------------------LeftColPart..

let WelcomeCard = () => {
  let [allUsers, setAllUsers] = useState(0);
  useEffect(() => {
    async function getData() {
      let data = await axios.get(getAllUsersUrl);
      setAllUsers(data.data);
      return data;
    }
    getData();
  }, []);
  return (
    <div className="welcomeCard">
      <span className="welcomeDesc">
        <span className="communitySpan"> DEV Community </span> is a Community of
        <br /> {allUsers.totalUsers} amazing developers
      </span>
      <span> We're a place where coders share, stay up-to-date and grow their careers.</span>
      <Button type="register" />
      <Button type="login" />
    </div>
  );
};

const VerticalNavbar = () => {
  let VerticalListItems = [
    { img: home, text: "Home", path: "/" },
    { img: Listings, text: "Listings", path: "listings" },
    { img: Prodcasts, text: "Prodcasts", path: "prodcasts" },
    { img: Videos, text: "Videos", path: "videos" },
    { img: Tags, text: "Tags", path: "tags" },
    { img: FAQ, text: "FAQ", path: "faq" },
    { img: ForemShop, text: "Forem Shop", path: "foremshop" },
    { img: Sponsors, text: "Sponsors", path: "sponsors" },
    { img: About, text: "About", path: "about" },
    { img: Contact, text: "Contact", path: "contact" },
    { img: Guides, text: "Guides", path: "guides" },
    { img: Softwarecomparisons, text: "Software comparisons", path: "softcomparison" },
    { img: CodeofConduct, text: "Code of Conduct", path: "COC" },
    { img: PrivacyPolicy, text: "Privacy Policy", path: "privacyPolicy" },
    { img: Termsofuse, text: "Terms of use", path: "terms" },
  ];
  return (
    <div className="verticalNavbar">
      {VerticalListItems.map((Item, index) => {
        const Other = () => <b> Other</b>;
        return (
          <span key={index} className="VerticalListItem">
            {Item.path === "softcomparison" ? <Other /> : null}
            <LinkText text={Item.text} path={Item.path} image={Item.img} />
          </span>
        );
      })}
      <div className="SocialMedias">
        <LinkText path={"https://instagram.com/thepracticaldev"} image={tweeter} />
        <LinkText path={"tweeter"} image={facebook} />
        <LinkText path={"tweeter"} image={github} />
        <LinkText path={"tweeter"} image={instagram} />
        <LinkText path={"tweeter"} image={twitch} />
      </div>
    </div>
  );
};

const TagsCard = () => {
  let allTags = [
    { tag: "programming" },
    { tag: "tutorial" },
    { tag: "react" },
    { tag: "python" },
    { tag: "productivity" },
    { tag: "discuss" },
    { tag: "css" },
    { tag: "devops" },
    { tag: "career" },
    { tag: "opensource" },
    { tag: "html" },
    { tag: "aws" },
    { tag: "node" },
    { tag: "news" },
    { tag: "codenewbie" },
    { tag: "typescript" },
    { tag: "android" },
    { tag: "showdev" },
    { tag: "java" },
    { tag: "php" },
    { tag: "testing" },
    { tag: "cloud" },
    { tag: "github" },
    { tag: "blockchain" },
    { tag: "angular" },
    { tag: "security" },
    { tag: "laravel" },
  ]; 
  return (
    <div className="tagsCard">
      {allTags.map((Item, index) => {
        return (
          <span key={index}>
            <LinkText text={"#" + Item.tag} path={"tags/" + Item.tag} />
          </span>
        );
      })}
    </div>
  );
};

const ImageCard = ({ image, title, subtitle, path }) => {
  return (
    <div className="imageCard">
      <NavLink to={path}>{image ? <img src={image} alt="imageCardImage" /> : null}</NavLink>
      <NavLink to={path}>{title ? <span className="title">{title}</span> : null}</NavLink>
      {subtitle ? <span className="subTitle">{subtitle}</span> : null}
    </div>
  );
};

const VerticalNavAndFilter = () => {
  let { state } = useContext(appContext);

  return (
    <div className="verticalNavAndFiler">
      {!state.loginStatus ? <WelcomeCard /> : null}
      <VerticalNavbar />

      <b>Popular Tags</b>
      <TagsCard />
      <ImageCard image={assetTemp} title="TempTitle" subtitle="TempSubTitle.." path="Path" />
      <ImageCard image={foremTemp} title="The Forem Shop is Here!" subtitle=">> Shop Forem, DEV, and CodeNewbie merch" path="Path" />
    </div>
  );
};

export { VerticalNavAndFilter, WelcomeCard, TagsCard, ImageCard };
