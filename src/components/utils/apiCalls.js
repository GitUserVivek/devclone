import axios from "axios";
import Cookies from "js-cookie";
import {
  commentPostUrl,
  createPostUrl,
  deleteCommentPostUrl,
  deletePostUrl,
  deleteReplyCommentPostUrl,
  followUrl,
  getUserPostsUrl,
  likeCommentPostUrl,
  loginUrl,
  registerUrl,
  replyCommentPostUrl,
  unfollowUrl,
  updateUserDetails,
} from "../../endpoints";

let tryLogin = async ({
  state,
  setState,
  usernameOrEmail,
  password,
  navigateTo,
}) => {
  console.log("this is called.. login");
  let token = Cookies.get("thedev");
  if (!token) {
    if (usernameOrEmail && password) {
      let data = await axios.post(loginUrl, {
        username: usernameOrEmail,
        password,
      });
      if (data.data.statusCode !== 400 && data.data.statusCode !== 404) {
        data = data.data.data;
        Cookies.set("thedev", data?.token, { expires: 1 / 24, path: "/" });
        setState({
          ...state,
          loginStatus: true,
          user: data,
        });
      } else {
        console.log("not user found");
        return data.data;
      }
    } else {
      return {
        statusCode: 404,
        msg: "User Not Found..",
      };
    }
  } else {
    async function getuserData() {
      let userData = await axios.post(loginUrl, { token: token });
      state.loginStatus = true;
      state.user = userData.data.data;
      setState({
        ...state,
      });
    }
    getuserData();
    navigateTo && navigateTo("/");
  }

  scrollToTop();
};
let tryRegister = async ({ name, username, email, password, cpassword }) => {
  // if (name && username && email && password === cpassword) {
  let res = await axios.post(registerUrl, {
    name,
    username,
    email,
    password,
    cpassword,
  });
  return res.data;
  // }
};
let updateUser = async ({ userId, updates }) => {
  // if (name && username && email && password === cpassword) {
  let res = await axios.post(updateUserDetails, {
    userId,
    updates,
  });

  return res?.data;
  // }
};
let postPost = async ({ newPost }) => {
  if (newPost) {
    await axios.post(createPostUrl, newPost);
    scrollToTop();
  }
};
let scrollToTop = () => {
  document.getElementsByTagName("body")[0].scrollTo(0, 0);
};
let getPost = async ({ postTitle }) => {
  if (postTitle) {
    await axios.post(createPostUrl, { postTitle });
    scrollToTop();
  }
};
let followUser = async ({ to_id, state, setState }) => {
  let res = await axios.post(followUrl, {
    to_id: to_id,
    userId: state.user._id,
  });
  tryLogin({ state, setState });
  return res.data;
};

let unfollowUser = async ({ to_id, state, setState }) => {
  let res = await axios.post(unfollowUrl, {
    to_id,
    userId: state.user._id,
  });
  tryLogin({ state, setState });
  return res.data;
};

let getUserPosts = async ({ username, id }) => {
  let allPostsOfUser = await axios.post(getUserPostsUrl, { username, id });

  if (allPostsOfUser.data.statusCode === 200) {
    return allPostsOfUser.data.posts;
  }
};
let deleteCurrentPost = async ({ postId, state, setState }) => {
  let res = await axios.post(deletePostUrl, { postId });
  if (res.data.statusCode === 200) {
    console.log("Userrrr dleted");
    tryLogin({ state, setState });
    return res.data;
  }
};
let deleteReplyComment = async ({ postId, commentId, replyId }) => {
  let res = await axios.post(deleteReplyCommentPostUrl, {
    postId,
    commentId,
    replyId,
  });
  let data = res.data;
  if (data.statusCode === 200) {
    return data;
  }
};
let deleteComment = async ({ postId, commentId, username }) => {
  let res = await axios.post(deleteCommentPostUrl, {
    postId,
    commentId,
    username,
  });
  if (res.data.statusCode === 200) {
    console.log("comment deleted..", { res: res.data });
    return res.data;
  } else {
    return res.data;
  }
};

let commentOnPost = async ({ postId, comment, userId }) => {
  let data = await axios.post(commentPostUrl, { postId, comment, userId });
  return data?.data?.data?.comments;
};
let likeCommentUnLike = async ({ postId, commentId, username }) => {
  let res = await axios.post(likeCommentPostUrl, {
    postId,
    commentId,
    username,
  });

  console.log("Like on Comment  successful..");
  return res.data.msg;
};
let replyComment = async ({ postId, reply, commentId, userId }) => {
  let res = await axios.post(replyCommentPostUrl, {
    postId,
    commentId,
    reply,
    userId,
  });

  console.log(
    "reply on Comment  successful..",
    res.data.msg?.find((comment) => comment.id === commentId)
  );
  return res.data.msg?.find((comment) => comment.id === commentId);
};
export default tryLogin;
export {
  postPost,
  scrollToTop,
  getPost,
  followUser,
  unfollowUser,
  tryRegister,
  getUserPosts,
  deleteCurrentPost,
  commentOnPost,
  likeCommentUnLike,
  replyComment,
  deleteComment,
  deleteReplyComment,
  updateUser,
};
