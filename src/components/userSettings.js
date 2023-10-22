import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "./context/appContext";
import { Link } from "react-router-dom";
import {
  FilledButton,
  FilledButtonWithIcon,
  InputWithLable,
  LinkText,
} from "./components";
import { forem_icon, tweeter } from "./utils/images";
import { updateUser } from "./utils/apiCalls";

let SocialMediaSettingsComponent = () => {
  return (
    <div className="card">
      <FilledButtonWithIcon
        image={forem_icon}
        active={true}
        background={"#05313b"}
        text={"Connect Forem Account"}
        path={""}
      />
      <FilledButtonWithIcon
        image={tweeter}
        active={true}
        text={"Connect Forem Account"}
        path={""}
        background={"#0096f2"}
      />
    </div>
  );
};
let BasicSettings = ({
  currentSettings,
  updatedSettings,
  setCurrentSettings,
  setSettings,
}) => {
  let profileUploadRef = useRef();
  let pic_name = useRef();
  let brand_color = useRef();
  let imagePreview = useRef();
  return (
    <div className="card">
      <h2>User</h2>
      <InputWithLable
        Lable="Name"
        setSettings={setSettings}
        currentSettings={currentSettings}
        setCurrentSettings={setCurrentSettings}
        updatedSettings={updatedSettings}
        value={currentSettings?.name}
        type="text"
      />
      <InputWithLable
        Lable="Email"
        setSettings={setSettings}
        currentSettings={currentSettings}
        setCurrentSettings={setCurrentSettings}
        updatedSettings={updatedSettings}
        value={currentSettings?.email}
        type="text"
      />
      <span>
        <input type="checkbox" />{" "}
        <span className="inputLable">Display email on profile</span>
      </span>
      <InputWithLable
        Lable="Username"
        setSettings={setSettings}
        currentSettings={currentSettings}
        setCurrentSettings={setCurrentSettings}
        updatedSettings={updatedSettings}
        value={currentSettings?.username}
        type="text"
      />
      <span className="profilePicUploader">
        <span className="inputLable">Profile Image</span>
        <span className="inputWithLable">
          <img
            src={
              currentSettings?.profileImage ? currentSettings?.profileImage : ""
            }
            ref={imagePreview}
            alt="profilePic"
          />
          <input
            type="file"
            hidden
            ref={profileUploadRef}
            accept="image/*"
            onChange={(e) => {
              let pic = e.target.files[0]; 
              const imageUrl = URL.createObjectURL(pic);
              console.log(imagePreview)
              if (pic) {
                pic_name.current.innerText = pic.name; 
                let reader = new FileReader();
                let dataUrl = null;
                reader.onloadend = () => {
                  dataUrl = reader.result;
                  //set in state
                  setSettings({
                    ...updatedSettings,
                    profileImage: dataUrl,
                  });
                };
                reader.readAsDataURL(pic);
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              profileUploadRef.current.click();
            }}
          >
            Choose File
          </button>
          <span className="pic_name" ref={pic_name}>
            No file chosen
          </span>
        </span>
      </span>
      <span className="brandColor_picker">
        <span className="inputLable">BrandColor</span>
        <span>
          <input
            type="color"
            value={brand_color?.current?.innerText}
            onChange={(e) => {
              brand_color.current.innerText = e.target.value;
              e.currentTarget.value = e.target.value;
              setSettings({ ...updatedSettings, brandColor: e.target.value });
            }}
          />
          <span className="brandColor" ref={brand_color}>
            {currentSettings?.brandColor || "#FFFFFF"}
          </span>
        </span>
      </span>
    </div>
  );
};
let UserSettings = () => {
  let { state, setState } = useContext(AppContext);
  let settingMenu = [
    "Profile",
    "Customization",
    "Notifications",
    "Account",
    "Billing",
    "Organization",
    "Extensions",
  ];
  let [currentSettings, setCurrentSettings] = useState(state?.user);
  let [updatedSettings, setSettings] = useState({});
  useEffect(() => {
    // setSettings(state.user);
    setCurrentSettings(state.user);
  }, [state]);
  return (
    <>
      {state.loginStatus ? (
        <div className="useSettingPage">
          <span>
            Settings for{" "}
            <Link to={"/user/" + state?.user?.username}>
              @{state?.user?.username}{" "}
            </Link>
          </span>
          <div className="settingComponent">
            <div className="settingMenu">
              {settingMenu.map((item) => (
                <LinkText key={item} path={"/setting/" + item} text={item} />
              ))}
            </div>
            <div className="settingContent">
              <SocialMediaSettingsComponent />
              <BasicSettings
                currentSettings={currentSettings}
                updatedSettings={updatedSettings}
                setSettings={setSettings}
                setCurrentSettings={setCurrentSettings}
              />
              <div className="card">
                <FilledButton
                  active={true}
                  className="fullWidthButton"
                  callEvent={() => {
                    updateUser({
                      userId: state?.user?._id,
                      updates: updatedSettings,
                    });
                    alert("Updated..");
                  }}
                  path=""
                  text={"Save Profile Information"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content">
          <div className="pleaseLogin postWorkspace">Please Login</div>
        </div>
      )}
    </>
  );
};

export default UserSettings;
