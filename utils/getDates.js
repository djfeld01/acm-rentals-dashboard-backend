const getToday = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();

  return new Date(today.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const offset = yesterday.getTimezoneOffset();
  return new Date(yesterday.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

const getMonthStart = () => {
  const month = new Date();
  month.setDate(1);
  const offset = month.getTimezoneOffset();
  return new Date(month.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

const getWeekStart = () => {
  let weekStart = new Date();
  const day = weekStart.getDay();
  //console.log(weekStart);
  if (day !== 1) {
    weekStart.setHours(-24 * (day - 1));
  }
  const offset = weekStart.getTimezoneOffset();
  return new Date(weekStart.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

const getYearStart = () => {
  let yearStart = new Date();

  yearStart.setMonth(0);

  yearStart.setDate(1);

  const offset = yearStart.getTimezoneOffset();
  return new Date(yearStart.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

const getDates = () => {
  const today = new Date(getToday());
  const yesterday = new Date(getYesterday());
  const monthStart = new Date(getMonthStart());
  const weekStart = new Date(getWeekStart());
  const yearStart = new Date(getYearStart());

  return { today, monthStart, yesterday, weekStart, yearStart };
};

module.exports = getDates;
