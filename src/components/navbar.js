import { notification, devLogo, search } from "./utils/images";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import tryLogin, { postPost, scrollToTop, tryRegister } from "./utils/apiCalls";
import Cookies from "js-cookie";
import AppContext from "./context/appContext";
import { Button, FilledButton, LinkText, UserProfilePhoto } from "./components";
import JoditEditor from "jodit-react";

const NavBar = () => {
  let { state, setState } = useContext(AppContext);
  let { loginStatus } = state;
  let [currentPath, setCurrentPath] = useState(state?.currentPath);
  const [openMenue, setOpenMenue] = useState(false);
  let navigateTo = useNavigate();
  useEffect(() => {
    setCurrentPath(state?.currentPath);
    console.log("the path", currentPath);
  }, [openMenue, state?.currentPath]);
  return (
    <div className="navbar">
      <div className="nav">
        <div className="nav-left">
          <span className="burgerIcon"></span>
          <NavLink to="/" className="logo">
            <img alt="something" src={devLogo} />
          </NavLink>
          {currentPath === "/new" ? (
            <span style={{ margin: "0.5rem 1.2rem", fontWeight: "500" }}>
              Create Post
            </span>
          ) : (
            <span>
              <input type="text" className="searchBar" placeholder="Search.." />
              <img
                alt="something"
                src={search}
                className="searchInputLogo login"
              />
            </span>
          )}
        </div>
        {!loginStatus ? (
          <div className="nav-right">
            <img alt="something" src={search} className="searchInputLogo" />
            <Button type="login" />
            <Button type="register" />
          </div>
        ) : (
          <div className="nav-right">
            <Button type="register" text="Create Post" path="new" />
            <LinkText type="login" image={notification} path="notifications" />
            <span className="userDetails">
              <UserProfilePhoto
                openMenue={openMenue}
                setOpenMenue={setOpenMenue}
              />
              {openMenue ? (
                <span className="userDetailsMenue">
                  <span
                    className="LinkText"
                    onClick={() => {
                      navigateTo("/user/" + state.user._id);
                      setOpenMenue(!openMenue);
                    }}
                  >
                    <span
                      style={{
                        fontSize: "small",
                        padding: "0",
                        color: "var(--fontSecondary)",
                      }}
                    >
                      <span style={{ padding: "0", fontWeight: "bold" }}>
                        {state.user.name}
                      </span>
                      <br />
                      <span style={{ padding: "0" }}>
                        @{state.user.username}
                      </span>
                    </span>
                  </span>
                  <div className="divider"></div>
                  <LinkText
                    text="Dashboard"
                    path={"/user/" + state.user.username}
                    callEvent={() => setOpenMenue(!openMenue)}
                  />
                  <LinkText
                    text="Create Post"
                    path="/new"
                    callEvent={() => setOpenMenue(!openMenue)}
                  />
                  <LinkText
                    text="Reading list"
                    path="/"
                    callEvent={() => setOpenMenue(!openMenue)}
                  />
                  <LinkText
                    text="Settings"
                    path="/settings"
                    callEvent={() => setOpenMenue(!openMenue)}
                  />
                  <div className="divider"></div>

                  <LinkText
                    text="Sign Out"
                    path="/"
                    callEvent={() => {
                      Cookies.remove("thedev");
                      setState({ ...state, loginStatus: false, user: null });
                      setOpenMenue(!openMenue);
                    }}
                  />
                </span>
              ) : null}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  let { state, setState } = useContext(AppContext);
  let [usernameOrEmail, setUsernameOrEmail] = useState("");
  let [password, setPassword] = useState("");
  let navigateTo = useNavigate();
  if (state.loginStatus) {
    scrollToTop();
    navigateTo("/");
  }
  return (
    <>
      <div className="loginComponent">
        <h2> Welcome to DEV Community</h2>
        <span className="descLogin">
          <span>DEV Community</span> is a community of 883,563 amazing
          developers
        </span>
        <span className="Apple_login">
          <LinkText
            text="Continue with Apple"
            image=""
            path="/login"
            key="apple"
          />
        </span>
        <span className="Form_login">
          <LinkText
            text="Continue with Forem"
            image=""
            path="/login"
            key="forem"
          />
        </span>
        <span className="Github_login">
          <LinkText
            text="Continue with Github"
            image=""
            path="/login"
            key="github"
          />
        </span>
        <span className="tweeter_login">
          <LinkText
            text="Continue with tweeter"
            image=""
            path="/login"
            key="tweeter"
          />
        </span>
        <span name="sectionLink">
          Have a password? Continue with your email address
        </span>
        <span className="defaultError"></span>
        <span>
          <form className="loginForm">
            <b>Email</b>
            <input
              className="defaultInput"
              type="text"
              name="email"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("password").focus();
                }
              }}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
              }}
              id="email"
              required
            />
            <b>password</b>

            <input
              className="defaultInput"
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  let status = await tryLogin({
                    state,
                    setState,
                    usernameOrEmail,
                    password,
                    navigateTo,
                  });
                  let targetElement =
                    document.getElementsByClassName("defaultError")[0];
                  if (status?.statusCode === 400) {
                    //
                    targetElement.innerText = status?.msg
                      ? status.msg
                      : status.error.length > 1
                        ? "All Fields are required !"
                        : status.error[0].msg;
                    targetElement.style.display = "block";
                  } else {
                    targetElement.style.display = "none";
                    navigateTo("/");
                  }
                }
              }}
              required
            />
            <span>
              <input type="checkbox" style={{ margin: "10px" }} name="rememberme" id="rememberme" />
              Remember me
            </span>
            <button
              type="button"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                let status = await tryLogin({
                  state,
                  setState,
                  usernameOrEmail,
                  password,
                  navigateTo,
                });

                let targetElement =
                  document.getElementsByClassName("defaultError")[0];
                if (status?.statusCode === 400 || status.statusCode === 404) {
                  //
                  targetElement.innerText = status?.msg
                    ? status.msg
                    : status.error.length > 1
                      ? "All Fields are required !"
                      : status.error[0].msg;
                  targetElement.style.display = "block";
                } else {
                  targetElement.style.display = "none";
                  navigateTo("/");
                }
              }}
            >
              Continue
            </button>
            <span name="forgot">I forgot my password</span>
          </form>
        </span>
      </div>
    </>
  );
};

const Register = () => {
  let { state } = useContext(AppContext);
  let navigateTo = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  return (
    <>
      {!state.loginStatus ? (
        <div className="loginComponent">
          <h2> Welcome to DEV Community</h2>
          <span className="descLogin">
            <span>DEV Community</span> is a community of 883,563 amazing
            developers
          </span>
          <span className="Apple_login">
            <LinkText
              text="Continue with Apple"
              image=""
              path="/login"
              key="apple"
            />
          </span>
          <span className="Form_login">
            <LinkText
              text="Continue with Forem"
              image=""
              path="/login"
              key="forem"
            />
          </span>
          <span className="Github_login">
            <LinkText
              text="Continue with Github"
              image=""
              path="/login"
              key="github"
            />
          </span>
          <span className="tweeter_login">
            <LinkText
              text="Continue with tweeter"
              image=""
              path="/login"
              key="tweeter"
            />
          </span>
          <span className="defaultError" id="registerUserError"></span>
          <input
            className="defaultInput"
            type="name"
            onChange={(e) => {
              setUserInfo({ ...userInfo, name: e.target.value });
            }}
            placeholder="name"
          />
          <input
            className="defaultInput"
            type="email"
            onChange={(e) => {
              setUserInfo({ ...userInfo, email: e.target.value });
            }}
            placeholder="email"
          />
          <input
            className="defaultInput"
            type="text"
            onChange={(e) => {
              setUserInfo({ ...userInfo, username: e.target.value });
            }}
            placeholder="username"
          />
          <input
            className="defaultInput"
            type="password"
            onChange={(e) => {
              setUserInfo({ ...userInfo, password: e.target.value });
            }}
            placeholder="password"
          />
          <input
            className="defaultInput"
            type="password"
            onChange={(e) => {
              setUserInfo({ ...userInfo, cpassword: e.target.value });
            }}
            placeholder="password"
          />
          <FilledButton
            active={true}
            callEvent={async () => {
              let status = await tryRegister({ ...userInfo });
              let targetElement = document.getElementById("registerUserError");
              if (status?.statusCode !== 201) {
                //
                targetElement.innerText = status?.msg
                  ? status.msg
                  : status.error.length > 1
                    ? "All Fields are required !"
                    : status.error[0].msg;
                targetElement.style.display = "block";
              } else {
                targetElement.style.display = "none";
                navigateTo("/");
              }
            }}
            path=""
            text="Register"
          />

          <pre name="sectionLink">
            Already have an account?
            <NavLink
              to="/login"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              &nbsp;Log in.
            </NavLink>
          </pre>
        </div>
      ) : (
        navigateTo("/")
      )}
    </>
  );
};

let CreatePost = () => {
  let { state, setState } = useContext(AppContext);
  let [newPost, setNewPost] = useState({
    coverImage: "",
    title: "",
    tags: [],
    blog: "",
    userId: null,
  });
  let userId = state.user?._id;

  let editorConfigs = useMemo(() => {
    return {
      toolbarButtonSize: "middle",
      buttons: [
        "bold",
        "strikethrough",
        "underline",
        "italic",
        "ul",
        "ol",
        "indent",
        "font",
        "fontsize",

        "image",
        "table",
        "link",

        "align",

        "hr",
      ],

      events: {},
      textIcons: false,
    };
  }, []);

  useEffect(() => {
    newPost.userId = state.user?._id;
    console.log(newPost.tags);
  }, [state, state.loginStatus, state?.currentPath, newPost.userId]);
  let ref = useRef("file");
  return (
    <>
      {state.loginStatus && userId ? (
        <div className="content_Post">
          <div className="createPostPage ">
            <div className="createPost">
              <div className="postWorkspace">
                <button
                  className="addCoverImageButton"
                >
                  {newPost.coverImage
                    ? "Change cover Image"
                    : "Add a cover Image"}
                </button>
                {newPost.coverImage ? (
                  <img
                    src={newPost.coverImage}
                    style={{
                      height: "350px",
                      alignSelf: "center",
                    }}
                    alt="previewCoverImage"
                  />
                ) : null}
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={ref}
                  onChange={(e) => {
                    let file = e.target.files[0];
                    if (file) {
                      let reader = new FileReader();
                      reader.onloadend = () => {
                        const dataUrl = reader.result;
                        console.log({ dataUrl });
                        newPost.coverImage = dataUrl;
                        setNewPost({ ...newPost });
                        console.log({ newPost2: newPost });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <textarea
                  type="text"
                  style={{
                    height: "5rem",
                  }}
                  value={newPost.title}
                  onChange={(e) => {
                    newPost.title = e.target.value;
                    setNewPost({ ...newPost });
                    e.target.style.height = "100px";
                    e.target.style.height = e.target.scrollHeight + "px";
                    // console.log({ newPost });
                  }}
                  placeholder="New Post Title Here.."
                  className="titleInput"
                />
                <span className="tags_post">
                  {newPost.tags.map((value, index) => {
                    return (
                      <span className="singleTag" key={index}>
                        #{value}
                        <span
                          onClick={() => {
                            console.log(index);
                            newPost.tags.splice(index, 1);
                            setNewPost({
                              ...newPost,
                            });
                          }}
                        >
                          X
                        </span>
                      </span>
                    );
                  })}
                  {newPost.tags.length < 4 ? (
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Space") {
                          newPost.tags.push(e.target.value);
                          setNewPost({ ...newPost });
                          e.currentTarget.value = "";
                        }
                      }}
                      placeholder="Add upto 4 tags.. saperated by spaces"
                    />
                  ) : (
                    ""
                  )}
                </span>
                <JoditEditor
                  className="blogWriter"
                  value={newPost.blog}
                  config={editorConfigs}
                  onChange={(newContent) => {
                    console.log({ newContent });
                    setNewPost({ ...newPost, blog: newContent });
                  }}
                />
                {/* <textarea
                  className="blogWriter"
                  style={{
                    height: "5rem",
                  }}
                  placeholder="Write Your Post Content Here.."
                  onChange={(e) => {
                    newPost.blog = e.target.value;
                    setNewPost({ ...newPost });
                    e.target.style.height = "100px";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                /> */}
              </div>
              {/*  */}
              <div className="postGuide">
                <b>Writing a Great Post Title</b>
                <span>
                  Think of your post title as a super short (but compelling!)
                  description — like an overview of the actual post in one short
                  sentence. Use keywords where appropriate to help ensure people
                  can find your post by search.
                </span>
              </div>
            </div>
            <div className="postActions">
              <div className="placeHolder_postActions"></div>
              <div className="actions">
                <FilledButton
                  active={true}
                  callEvent={async () => {
                    await postPost({ newPost });
                  }}
                  path="/"
                  text="Publish"
                />
                <LinkText text="Save draft" path="/" />
                <LinkText text="$" path="/" />
                <LinkText text="Revert new changes" path="/" />
              </div>
              <div className="placeHolder_postActions"></div>
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
export default NavBar;
export { Login, Register, CreatePost };
