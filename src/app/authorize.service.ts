import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthorizeService {
  constructor(private http: HttpClient) {}
  authorization =
    "Basic dmNsa3NzbjJmdHJpbDl2aGdic2NuYzQ2cjoxbHRvbTN2b3VuaG1vMjgzaGdhNDN2aW5tdDRha2hjb3F1N2ZpMGZxdDZyYWozbDRmcTIw";
  grantType = "authorization_code";
  clientId = "vclkssn2ftril9vhgbscnc46r";
  token = "";
  code = "";
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
    return this.http.post(
      `${environment.authorizeUrl}/token?grant_type=${this.grantType}&client_id=${this.clientId}&code=${code}&redirect_uri=${environment.redirectUrl}`,
      "",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: this.authorization,
          grant_type: this.grantType,
          client_id: this.clientId,
          code: code == "" ? this.code : "",
          redirect_uri: environment.redirectUrl
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
