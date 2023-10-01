import moment from "moment";
let getFormattedDate = (date) => {
  return moment(date).format("MMM DD");
};

export { getFormattedDate };
