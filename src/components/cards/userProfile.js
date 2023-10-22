import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState, memo } from "react";
import { useLocation } from "react-router";
import { getSingleUsersUrl } from "../../endpoints";
import AppContext from "../context/appContext";
import { getSinglePost, getUserPosts } from "../utils/apiCalls";
import {
  CommentsComponent,
  ComponentNotFound,
  PostTags,
  UserInfo,
  UserProfileInfoCard,
} from "../components";
import { Post, PostSkeleton } from "./feedColCards";
import { ImageCard } from "./leftColCards";

let UserProfile = memo(() => {
  let { state } = useContext(AppContext);
  let [user, setUser] = useState({});
  let location = useLocation();
  let userId = location.pathname.split("/")[2];
  let [myProfile, setMyProfile] = useState(false);
  let [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5]);
  useEffect(() => {
    async function getData() {
      let gotUser = await axios.post(getSingleUsersUrl, { userId });
      if (gotUser.data.statusCode === 200) {
        console.log({ gotUser });
        gotUser.data.user["posts"] = await getUserPosts({
          userId,
          id: gotUser.data.user._id + "",
        });
        // eslint-disable-next-line
        user = gotUser?.data?.user;
        setUser({ ...user });
        if (user?.id === state?.user?.userId) setMyProfile(true);
        else setMyProfile(false);
      } else {
        setUser(gotUser.data);
      }
    }
    getData();
    setTimeout(() => {
      setSkeleton([]);
    }, 2000);
  }, [state?.user, user._id]);
  return (
    <div className="content">
      {user?.statusCode !== 400 ? (
        <div className="userProfilePage">
          <div
            className="profileCoverBg"
            style={{
              background: state?.user?.brandColor
                ? state?.user?.brandColor
                : "",
            }}
          ></div>
          <UserProfileInfoCard user={user} />
          <div className="userWorks">
            <span className="userProfileActivities">
              <ImageCard
                image={"assetTemp"}
                title="TempTitle"
                subtitle="TempSubTitle.."
                path="Path"
              />
            </span>
            <span className="userProfilePosts">
              {user?.posts?.length ? (
                user?.posts?.map((post, index) => {
                  let date = moment(post.createdAt).format("MMM DD");
                  let user = post.user;
                  return (
                    <span key={post._id}>
                      <Post
                        comments={post.comments?.length}
                        reactions={post.reactions?.length}
                        tags={post.tags}
                        user={user}
                        time={date}
                        postId={post._id}
                        deletePost={myProfile && true}
                        title={post.title}
                      />
                    </span>
                  );
                })
              ) : (
                <>
                  {skeleton.length ? (
                    skeleton.map((data, index) => {
                      return <PostSkeleton key={index} />;
                    })
                  ) : (
                    <h4> No Posts Yet</h4>
                  )}
                </>
              )}
            </span>
          </div>
        </div>
      ) : (
        <ComponentNotFound />
      )}
    </div>
  );
});

let UserPost = memo(() => {
  let location = useLocation();
  let username = location.pathname.split("/")[2];
  let postId = location.pathname.split("/")[3].replaceAll("-", " ");
  let [currentPost, setCurrntPost] = useState({});
  let [allPosts, setAllPosts] = useState([]);
  let [apiDone, setApiDone] = useState(false);
  useEffect(() => {
    getSinglePost({ postId }).then((val) => {
      // setAllPosts(val);
      console.log({ val });
      setCurrntPost(val);
      setApiDone(true);
    });

    // eslint-disable-next-line
    // currentPost = allPosts?.find((post) => post.title === postTitle);
    // setCurrntPost({ ...currentPost });
  }, [allPosts?.length, postId, apiDone]);
  return (
    <div className="userPostPage">
      {apiDone ? (
        currentPost && Object.keys(currentPost).length !== 0 ? (
          <div className="content">
            <div className="reactionsCol">ddd</div>
            <div className="singlePost">
              <div className="post">
                <img src={currentPost.coverImage} alt="" />
                <UserInfo
                  user={currentPost.user}
                  openUserProfileByClick={true}
                  time={currentPost.time}
                />
                <span className="postTitle" style={{ fontSize: "3rem" }}>
                  {currentPost.title}
                </span>
                <PostTags tags={currentPost.tags} />
                <span className="singlePostblog"> {currentPost.blog}</span>
                <hr
                  color="lightgray"
                  style={{
                    height: "0px",
                  }}
                />
                <br />
                <CommentsComponent post={currentPost} />
              </div>
            </div>
            <div className="userInfoCol">ddd</div>
          </div>
        ) : (
          <ComponentNotFound />
        )
      ) : (
        <PostSkeleton />
      )}
    </div>
  );
});
export default UserProfile;
export { UserPost };
