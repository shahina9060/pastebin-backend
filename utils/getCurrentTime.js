module.exports = function getCurrentTime(req) {
  if (process.env.TEST_MODE === "1") {
    const testTime = req.headers["x-test-now-ms"];
    if (testTime) {
      return new Date(Number(testTime));
    }
  }
  return new Date();
};
