import { useContext, useEffect, useState, memo } from "react";
import { NavLink } from "react-router-dom";
import AppContext from "./context/appContext";
import {
  commentOnPost,
  deleteComment,
  deleteReplyComment,
  followUser,
  likeCommentUnLike,
  replyComment,
  unfollowUser,
} from "./utils/apiCalls";
import { devLogo1, notFoundImage, userPhoto } from "./utils/images";
import { getFormattedDate } from "./utils/functionalUtils";

const LinkText = ({ text, path, image, callEvent }) => {
  return (
    <NavLink
      to={path}
      className="LinkText"
      onClick={() => {
        if (callEvent) callEvent();
      }}
    >
      {image ? <img alt="something" src={image} /> : null}
      {text}
    </NavLink>
  );
};

const FilledButton = ({ active, text, path, className, image, callEvent }) => {
  return (
    <NavLink
      to={path}
      className={(className ? className : "") + " filledButton"}
      onClick={(e) => {
        if (active) {
          if (callEvent) callEvent();
        } else {
          e.preventDefault();
        }
      }}
    >
      {image ? (
        <img alt="something" src={image} className="buttonIcon" />
      ) : null}
      {text}
    </NavLink>
  );
};

const BorderButton = ({ text, path, image, callEvent }) => {
  return (
    <NavLink
      to={path}
      className="borderButton"
      onClick={() => {
        if (callEvent) callEvent();
      }}
    >
      {image ? <img alt="something" src={image} /> : null}
      {text}
    </NavLink>
  );
};

const Button = ({ type, text, path }) => {
  return type === "login" ? (
    <NavLink to={path ? path : "login"} className="loginButton">
      {text ? text : "Log in"}
    </NavLink>
  ) : (
    <NavLink to={path ? path : "createAc"} className="registerButton">
      {text ? text : "Create account"}
    </NavLink>
  );
};

const UserProfileInfoCard = ({ user }) => {
  let { state, setState } = useContext(AppContext);
  let [alreadyFollowing, setAlreadyFollowing] = useState(false);
  useEffect(() => {
    if (
      state?.user?.followings?.findIndex(
        (obj) => obj.username === user.username
      ) !== -1
    ) {
      setAlreadyFollowing(true);
    } else {
      setAlreadyFollowing(false);
    }
  }, [alreadyFollowing, state?.user?.followings, user.username]);
  return (
    <div className="userProfileCard">
      <div className="profileHeader">
        <span className="imageAndbuttons">
          <span className="image">
            <img
              src={user?.profileImage || userPhoto}
              alt="ProfilePhoto"
              className="profileImage"
              style={{
                background: user?.brandColor ? user?.brandColor : "",
              }}
            />
          </span>
          <span className="buttons">
            {!alreadyFollowing ? (
              <FilledButton
                text={
                  user?.username === state?.user?.username
                    ? "Edit Profile"
                    : "follow"
                }
                callEvent={async () => {
                  if (
                    state.loginStatus &&
                    user?.username !== state?.user?.username
                  ) {
                    await followUser({
                      to_id: user._id,
                      state,
                      setState,
                    });
                  }
                }}
                active={true}
                path={
                  user?.username !== state?.user?.username ? "" : "/settings"
                }
              />
            ) : (
              <BorderButton
                callEvent={async () => {
                  if (
                    state.loginStatus &&
                    user?.username !== state?.user?.username
                  ) {
                    await unfollowUser({
                      to_id: user._id,
                      state,
                      setState,
                    });
                  }
                }}
                path=""
                text="Following"
              />
            )}
            {user?.username !== state?.user?.username ? (
              <LinkText
                path={""}
                callEvent={() => console.log("more")}
                text="***"
              />
            ) : null}
          </span>
        </span>
      </div>
      <div className="userDetails">
        <span className="userName">{user.name} </span>
        <span className="userProfession">
          {user?.profession || "404 bio not found"}
        </span>
        <span className="userSocialLinks">
          {(user?.profession || ["Links ", "Will available ", " soon"]).map(
            (link, index) => {
              return <span key={index}>{link}</span>;
            }
          )}
        </span>
      </div>
    </div>
  );
};

const ComponentNotFound = () => {
  return (
    <div className="ComponentNotFound">
      <div className="component404">
        <img src={notFoundImage} alt="prof" />
      </div>
      This page does not exist
      <NavLink to="/"> Return to Home Page</NavLink>
    </div>
  );
};

const UserInfo = ({ user, openUserProfileByClick, time }) => {
  return (
    <div className="info">
      <img alt="Profile" src={user.profileImage || userPhoto} />
      <NavLink
        className={"noDecoratioin"}
        to={openUserProfileByClick ? "/user/" + user.id : ""}
      >
        <span>
          {/* <span className="username"> {user.username}</span> */}
          <span className="username">{user.username}</span>
          <br />
          <span className="postTime">{time}</span>
        </span>
      </NavLink>
    </div>
  );
};

const PostTags = ({ tags }) => {
  return (
    <span className="postTags">
      {tags.map((tag, index) => {
        return <LinkText key={index} path={"/tags/" + tag} text={"#" + tag} />;
      })}
    </span>
  );
};

let SingleCommentComponent = ({
  singleComment,
  post,
  isReply,
  comment,
  setAllComments,
}) => {
  let [currentComment, setCurrentComment] = useState(singleComment);
  let postId = post._id;
  let commentId = currentComment?.id;
  let context = useContext(AppContext);
  let username = context?.state?.user?.username;
  let [writingReply, setWritingReply] = useState(false);
  useEffect(() => {
    setCurrentComment(singleComment);
  }, [singleComment]);
  return (
    <div className="singleComment">
      <UserProfilePhoto />
      <span className="comment">
        <span className="commentMessage">
          <span className="comment_username">
            <NavLink
              className={"noDecoratioin"}
              to={"/user/" + singleComment?.username}
            >
              {singleComment.username}
            </NavLink>
            <span className="dateTime">
              {getFormattedDate(currentComment?.createdAt)}
            </span>
            {currentComment?.username === username ? (
              <span
                className="material-symbols-outlined"
                onClick={async () => {
                  let updatedComment;
                  isReply
                    ? (updatedComment = await deleteReplyComment({
                      commentId: comment?.id,
                      replyId: currentComment?.replyId,
                      postId,
                    }))
                    : (updatedComment = await deleteComment({
                      commentId: currentComment?.id,
                      postId,
                      username,
                    }));
                  setAllComments(updatedComment?.data?.comments);
                }}
              >
                delete_sweep
              </span>
            ) : null}
          </span>

          {isReply ? currentComment?.reply : currentComment?.comment}
        </span>
        {isReply ? null : (
          <span className="singleCommentsActions">
            <span
              className="commentLike"
              onClick={async () => {
                let updatedComment = await likeCommentUnLike({
                  postId,
                  commentId,
                  username,
                });
                setCurrentComment(updatedComment);
              }}
            >
              <span className="material-icons">
                {currentComment?.likes?.find(
                  (user) => user?.username === username
                )
                  ? "favorite"
                  : "favorite_border"}
              </span>
              {currentComment?.likes?.length} Likes
            </span>
            <span
              className="commentReact"
              onClick={() => {
                setWritingReply(true);
              }}
            >
              <span className="material-symbols-rounded">quick_phrases</span>
              Reply
            </span>
          </span>
        )}
        {writingReply ? (
          <CommentWriter
            isReply={true}
            post={post}
            commentId={currentComment.id}
            setWritingReply={setWritingReply}
            setCurrentComment={setCurrentComment}
            setAllComments={setAllComments}
          />
        ) : null}
        {currentComment?.replys?.length ? (
          <span className="replies">
            {currentComment?.replys?.map((reply, index) => {
              return (
                <SingleCommentComponent
                  post={post}
                  singleComment={reply}
                  comment={currentComment}
                  key={index}
                  isReply={true}
                  setAllComments={setAllComments}
                />
              );
            })}
          </span>
        ) : null}
      </span>
    </div>
  );
};
let CommentWriter = ({
  post,
  isReply,
  commentId,
  setWritingReply,
  setCurrentComment,
  setAllComments,
}) => {
  let [userComment, setUserComment] = useState("");
  let [writingComment, setWritingComment] = useState(false);
  let { state } = useContext(AppContext);
  return (
    <div className="commentComponent">
      <UserProfilePhoto openMenue={false} setOpenMenue={null} />
      <span className="commentEditor">
        <textarea
          className="commentWriter"
          placeholder="Add to the discussion"
          onChange={(e) => {
            setUserComment(e.target.value);
          }}
          value={userComment}
          onFocus={(e) => {
            setWritingComment(true);
          }}
        />

        {writingComment || isReply ? (
          <span className="commentWriterActions">
            <FilledButton
              callEvent={async () => {
                let userId = state?.user?._id;
                let username = state?.user?.username;
                if (isReply) {
                  let updatedComment = await replyComment({
                    postId: post._id,
                    reply: userComment,
                    commentId,
                    username,
                    userId,
                  });
                  console.log({ updatedComment });
                  // setAllComments(updatedComment);
                  setCurrentComment(updatedComment);
                  setUserComment("");

                  setWritingReply(false);
                } else {
                  let updatedComment = await commentOnPost({
                    userId,
                    postId: post._id,
                    comment: userComment,
                  });
                  setAllComments(updatedComment);
                  setUserComment("");
                }
              }}
              active={userComment ? true : false}
              path=""
              text="Submit"
            />
            <BorderButton
              callEvent={() => { }}
              active={userComment ? true : false}
              path=""
              text="Preview"
            />
            {isReply && (
              <BorderButton
                callEvent={() => {
                  setWritingReply(false);
                }}
                active={userComment ? true : false}
                path=""
                text="dissmiss"
              />
            )}
          </span>
        ) : null}
      </span>
    </div>
  );
};
const CommentsComponent = ({ post }) => {
  let [allComments, setAllComments] = useState(post?.comments);
  useEffect(() => {
    // console.log("Upppppdated..", allComments);
  }, [allComments]);
  return (
    <span className="commentsSection">
      <span className="commentsHeader">
        <span> Discussion </span>
        <BorderButton callEvent={() => { }} path="" text="Subscribe" />
      </span>
      <span className="commentsBody">
        <CommentWriter post={post} setAllComments={setAllComments} />
        {allComments?.map((singleComment, index) => {
          return (
            <SingleCommentComponent
              singleComment={singleComment}
              post={post}
              key={index}
              setAllComments={setAllComments}
            />
          );
        })}
      </span>
    </span>
  );
};

const UserProfilePhoto = ({ user, openMenue, setOpenMenue }) => {
  let { state } = useContext(AppContext);
  if (user) {
    state = { user };
  }
  return (
    <span
      className="userProfilePhoto"
      style={{
        background: state?.loginStatus
          ? `url(${state?.user?.profileImage || userPhoto})`
          : `url(${devLogo1})`,
      }}
      onClick={() => {
        if (setOpenMenue) setOpenMenue(!openMenue);
      }}
    ></span>
  );
};

const FilledButtonWithIcon = memo(
  ({ image, active, background, callEvent, text, path }) => {
    return (
      <span
        className="filledButtonWithIcon"
        style={{ background: background ? background : "red" }}
        onClick={(e) => {
          if (active) {
            if (callEvent) callEvent();
          } else {
            e.preventDefault();
          }
        }}
      >
        {image ? <img alt="something" src={image} /> : null}
        {text}
      </span>
    );
  }
);
const InputWithLable = memo(
  ({
    Lable,
    type,
    value,
    currentSettings,
    updatedSettings,
    setSettings,
    setCurrentSettings,
  }) => {
    return (
      <span className="inputWithLable">
        <span className="inputLable"> {Lable}</span>
        <input
          type={type}
          value={value + ""}
          onChange={(e) => {
            setSettings({
              ...updatedSettings,
              [Lable.toLowerCase()]: e.target.value,
            });
            setCurrentSettings({
              ...currentSettings,
              [Lable.toLowerCase()]: e.target.value,
            });
          }}
        />
      </span>
    );
  }
);
export {
  LinkText,
  Button,
  FilledButton,
  FilledButtonWithIcon,
  InputWithLable,
  CommentWriter,
  UserProfileInfoCard,
  UserProfilePhoto,
  SingleCommentComponent,
  BorderButton,
  UserInfo,
  PostTags,
  ComponentNotFound,
  CommentsComponent,
};
