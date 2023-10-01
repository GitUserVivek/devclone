import FeedCol from "./cards/feedColCards";
import { VerticalNavAndFilter } from "./cards/leftColCards";

const Feed = () => {
  return (
    <div className="content">
      <div className="leftCol">
        <VerticalNavAndFilter />
      </div>
      <div className="feed">
        <FeedCol />
      </div>
      <div className="rightCol">col 3 </div>
    </div>
  );
};

export default Feed;
