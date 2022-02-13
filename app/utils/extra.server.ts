import dayjs from "dayjs";
import advanceFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advanceFormat);
// returns date in dddd, dd MMMM yyyy format
export const formatDateString: (date: string) => string = (date) => {
  return dayjs(date).format("dddd, MMMM Do YYYY");
};
