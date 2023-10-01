import { getAllPostsUrl } from "../../endpoints";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "../context/appContext";
import { PostTags, UserInfo } from "../components";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import AppContext from "../context/appContext";
import { deleteCurrentPost } from "../utils/apiCalls";
import { getFormattedDate } from "../utils/functionalUtils";

// --------------------------------------------------------FeedPart..
const FeedFilters = ({ state, setState }) => {
  useEffect(() => {
    setState({ ...state, activeFeedTab: "relevent" });
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="feedFilters">
        <div className="typeFilters">
          <span
            onClick={(e) => {
              setState({ ...state, activeFeedTab: "relevent" });
            }}
            id="relevent"
            className={state.activeFeedTab === "relevent" ? "active" : null}
          >
            Relevent
          </span>
          <span
            onClick={(e) => {
              setState({ ...state, activeFeedTab: "latest" });
            }}
            id="latest"
            className={state.activeFeedTab === "latest" ? "active" : null}
          >
            Latest
          </span>
          <span
            onClick={(e) => {
              setState({ ...state, activeFeedTab: "top" });
            }}
            id="top"
            className={state.activeFeedTab === "top" ? "active" : null}
          >
            Top
          </span>
        </div>
        {state.activeFeedTab === "top" ? (
          <div className="timeFilters">
            <span>Week</span>
            <span>Month</span>
            <span>Year</span>
            <span className="active">Infinity</span>
          </div>
        ) : null}
      </div>
    </>
  );
};
const Post = ({
  postId,
  deletePost,
  image,
  title,
  user,
  tags,
  time,
  reactions,
  comments,
}) => {
  let { state, setState } = useContext(AppContext);
  let location = useLocation();
  let openUserProfileByClick = location.pathname.includes("user")
    ? false
    : true;
  return (
    <div className="post">
      {image ? <img alt="something" src={image} /> : null}
      <UserInfo
        user={user}
        openUserProfileByClick={openUserProfileByClick}
        time={time}
      />
      <span className="postTitle">
        <NavLink
          className={"noDecoratioin"}
          // to={"/user/" + user.username + "/" + title.replaceAll(" ", "-")}
          to={"/user/" + user.username + "/" + postId}
        >
          {title}
        </NavLink>
      </span>
      {/* tags array */}
      <PostTags tags={tags} />
      <span className="reactionsAndComments">
        <span>
          <span>
            {/* reactions logo */} {reactions} reactions
          </span>
          <span>
            {/* comments logo */} {comments} comments
          </span>
        </span>
        {!deletePost ? (
          <span className="save" id={postId} onClick={(e) => {}}>
            <span className="saveSpan">Save</span>
          </span>
        ) : (
          <span
            className="delete"
            id={postId}
            onClick={async (e) => {
              await deleteCurrentPost({ postId, state, setState });
            }}
          >
            <span className="deleteSpan">Delete</span>
          </span>
        )}
      </span>
    </div>
  );
};

const PostSkeleton = () => {
  return (
    <div className="post">
      <SkeletonTheme baseColor="lightGray" highlightColor="gray">
        <Skeleton className="skeletonImage" style={{ zIndex: "0" }} />
        <div className="info">
          <Skeleton className="skeletonCircle" style={{ zIndex: "0" }} />
          <span>
            <span className="username">
              <Skeleton className="skeletonLine" style={{ zIndex: "0" }} />
            </span>
            <br />
            <span className="postTime">
              <Skeleton className="skeletonLine" style={{ zIndex: "0" }} />
            </span>
          </span>
        </div>
        <span className="postTitle">
          <Skeleton
            style={{
              width: "25rem",
              margin: " 2rem 1rem 2rem 1rem",
              zIndex: "0",
            }}
          />
        </span>
        {/* tags array */}
        <span className="postTags"></span>
        <span className="reactionsAndComments">
          <span>
            <span></span>
            <span></span>
          </span>
          <span className="save">
            <span className="saveSpan">Save</span>
          </span>
        </span>
      </SkeletonTheme>
    </div>
  );
};
const FeedCol = ({ isTags }) => {
  let [allPosts, setAllPosts] = useState([]);
  let { state, setState } = useContext(Context);
  let location = useLocation();
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      let posts = (await axios.get(getAllPostsUrl)).data?.posts;
      if (isTags) {
        let tagFilters = location.pathname.split("/")[2].replaceAll("-", " ");
        let FilteredPosts = posts.filter((singlePost) =>
          singlePost.tags.includes(tagFilters)
        );
        setAllPosts(FilteredPosts);
      } else {
        setAllPosts(posts);
      }
      setIsLoading(false);
    }
    getData();

    // eslint-disable-next-line
  }, [allPosts?.length, isTags]);

  switch (state.activeFeedTab) {
    case "latest":
      allPosts.sort((post1, post2) => {
        if (post1.createdAt < post2.createdAt) return 1;
        else return -1;
      });
      break;
    case "top":
      allPosts.sort((post1, post2) => {
        if (post1.createdAt > post2.createdAt) return 1;
        else return -1;
      });
      break;
    default:
      allPosts.sort(() => Math.random() - 0.5);
  }
  return (
    <div className="feedCol">
      {!isTags ? (
        <FeedFilters state={state} setState={setState} />
      ) : (
        <span
          style={{
            background: "transparent",
            height: "30px",
            width: "100%",
            display: "block",
          }}
        >
          {" "}
        </span>
      )}
      {allPosts?.length ? (
        allPosts.map((post, index) => {
          let date = getFormattedDate(post.createdAt);
          let user = post.user;
          return (
            <span key={post._id} id={post._id}>
              <Post
                image={post.coverImage}
                comments={post.comments?.length}
                reactions={post.reactions?.length}
                tags={post.tags}
                user={user}
                time={date}
                postId={post._id}
                title={post.title}
              />
            </span>
          );
        })
      ) : (
        <>
          {isLoading
            ? [1, 2, 3, 4, 5].map((data, index) => <PostSkeleton key={index} />)
            : "Nothing to show"}
        </>
      )}
    </div>
  );
};

export default FeedCol;
export { Post, PostSkeleton };
