export const environment = {
    production: true,
    baseUrl: "https://so926lyyic.execute-api.ap-south-1.amazonaws.com/prod",
    authorizeUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/oauth2",
    redirectUrl: "https://www.kingdomofgod.in/admin",
    loginUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/oauth2/authorize?client_id=vclkssn2ftril9vhgbscnc46r&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=https://www.kingdomofgod.in/admin",
    logoutUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/logout?client_id=vclkssn2ftril9vhgbscnc46r&logout_uri=https://www.kingdomofgod.in/logout"
  }