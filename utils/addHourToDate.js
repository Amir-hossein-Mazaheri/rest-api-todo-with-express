const addHourToDate = (numberOfHours, date = new Date()) => {
  return date.setTime(date.getTime() + numberOfHours * 60 * 60 * 1000);
};

module.exports = addHourToDate;
