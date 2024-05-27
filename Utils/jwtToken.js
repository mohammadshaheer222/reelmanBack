//create token and saving it in cookies

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  // console.log(token)
  //options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), //90 days
    httpOnly: true, //means server and client continouse aayt pass cheyyunnund,httpOnly cookies secure aan,it access cheyyenenkil http vazhi maathrame access cheyyaan pattu
    sameSite: "Strict",
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, user, token });
   
};

module.exports = sendToken;
