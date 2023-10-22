let localhost = "http://localhost:5000";

// let remotehost = "https://thedevbackend.cyclic.cloud/";
// let localLanHost = "http://192.168.0.194:5000";
let host = localhost;
// let host = localLanHost;
// let host = remotehost;

const loginUrl = `${host}/login`;
const registerUrl = `${host}/register`;
const followUrl = `${host}/follow`;
const unfollowUrl = `${host}/unfollow`;
const createPostUrl = `${host}/createPost`;
const updateUserDetails = `${host}/updateUserDetails`;
const deletePostUrl = `${host}/deletePost`;
//
const commentPostUrl = `${host}/comment`;
const deleteCommentPostUrl = `${host}/deleteComment`;
const replyCommentPostUrl = `${host}/replyComment`;
const likeCommentPostUrl = `${host}/likeCommentUnLike`;
const deleteReplyCommentPostUrl = `${host}/deleteReplyComment`;

const getAllUsersUrl = `${host}/getAll`;
const getSingleUsersUrl = `${host}/getSingleUser`;
const getAllPostsUrl = `${host}/getAllPosts`;
const getSinglePostUrl = `${host}/getSinglePost`;
const getUserPostsUrl = `${host}/getUserPost`;

export {
  loginUrl,
  registerUrl,
  followUrl,
  unfollowUrl,
  createPostUrl,
  deletePostUrl,
  commentPostUrl,
  deleteCommentPostUrl,
  replyCommentPostUrl,
  likeCommentPostUrl,
  deleteReplyCommentPostUrl,
  getAllUsersUrl,
  getSingleUsersUrl,
  getAllPostsUrl,
  getSinglePostUrl,
  getUserPostsUrl,
  updateUserDetails,
};
