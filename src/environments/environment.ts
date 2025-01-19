export const environment = {
    production: false,
    baseUrl: "https://so926lyyic.execute-api.ap-south-1.amazonaws.com/prod",
    authorizeUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/oauth2",
    redirectUrl: "http://localhost:4200/admin/",
    redirecPBtUrl: "http://localhost:4200/page-builder/",
    loginUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/oauth2/authorize?client_id=vclkssn2ftril9vhgbscnc46r&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=http://localhost:4200/admin/",
    loginPBUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/oauth2/authorize?client_id=vclkssn2ftril9vhgbscnc46r&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=http://localhost:4200/page-builder/",
    logoutUrl: "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/logout?client_id=vclkssn2ftril9vhgbscnc46r&logout_uri=http://localhost:4200/logout"
  }