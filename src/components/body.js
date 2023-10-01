import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UserProfile, { UserPost } from "./cards/userProfile";
import AppContext from "./context/appContext";
import Feed from "./feed";
import Footer from "./footer";
import { CreatePost, Login, Register } from "./navbar";
import FeedCol from "./cards/feedColCards";
import UserSettings from "./userSettings";

let Body = () => {
  let { state } = useContext(AppContext);
  return (
    <div className="mainBody">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="login" element={<Login />} />
        <Route path="createAc" element={<Register />} />
        <Route path="new" element={<CreatePost />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="user/:username" element={<UserProfile />} />
        <Route path="user/:username/:postId" element={<UserPost />} />
        <Route path="tags/:tagname" element={<FeedCol isTags={true} />} />
      </Routes>
      {state.currentPath !== "/new" ? <Footer /> : null}
    </div>
  );
};

export default Body;
