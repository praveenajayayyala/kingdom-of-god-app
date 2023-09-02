import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthorizeService {
  constructor(private http: HttpClient) {}
  baseUrl = "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/oauth2";
  authorization =
    "Basic dmNsa3NzbjJmdHJpbDl2aGdic2NuYzQ2cjoxbHRvbTN2b3VuaG1vMjgzaGdhNDN2aW5tdDRha2hjb3F1N2ZpMGZxdDZyYWozbDRmcTIw";
  grantType = "authorization_code";
  clientId = "vclkssn2ftril9vhgbscnc46r";
  token = "";
  code = "";
  redirectUri = "http://localhost:4200/admin/";
  private invalidToken = true;

  get neetToLogin(): boolean {
    return this.invalidToken;
  }

  set neetToLogin(newstate: boolean) {
    //console.log("set neetToLogin=>", newstate);
    this.invalidToken = newstate;
  }

  

  // public getArticleById(id: string, options?: any) {
  //   return this.http
  //     .get(this.baseUrl + "/getarticles?postId=" + id, options)
  //     .pipe(retry(2));
  // }

  // public updateCode(queryStr: string) {
  //   this.code = queryStr;
  // }

  public getAccessToken(code: string) {
    return this.http
      .post(
        `${this.baseUrl}/token?grant_type=${this.grantType}&client_id=${
          this.clientId
        }&code=${code}&redirect_uri=${
          this.redirectUri
        }`,
        "",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: this.authorization,
            grant_type: this.grantType,
            client_id: this.clientId,
            code: code == "" ? this.code : "",
            redirect_uri: this.redirectUri,
          },
        }
      );      
  }

  // public async getToken() {
  //   if (this.token == "") {
  //     await this.getAccessToken();
  //   }
  //   return this.invalidToken ? "Invalid-Token" : this.token;
  // }
  // public async getAccessToken(code: string, redirectUri: string) {
  //   if (this.token == "") {
  //     await this.getTocken(code, redirectUri);
  //   }
  //   return this.token;
  // }
}
