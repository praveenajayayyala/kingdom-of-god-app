import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ArticleService } from "./artical.service";
import { Article } from "./modal/article";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements AfterViewInit {
  isloading = "block";
  constructor(
    private renderer: Renderer2,
    private articleService: ArticleService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    this.loadMenu();
  }
  @ViewChild("inserttarget", { static: true })
  insertTarget!: ElementRef;
  menucss: string = " ";

  openCloseMenu() {
    if (this.menucss == "collapse navbar-collapse") {
      this.menucss = "collapse navbar-collapse in";
    } else {
      this.menucss = "collapse navbar-collapse";
    }
  }

  loadMenu() {
    this.articleService.getArticlesByPostId("*").then((pages) => {
      const groupedMap = pages.reduce(
        (entryMap, e) =>
          entryMap.set(e.parent, [...(entryMap.get(e.parent) || []), e]),
        new Map()
      );
      //groupedMap.forEach((v, k) => console.log("groupedMap", k, v));
      let menuItem: Article[] = [];
      groupedMap.get("").forEach((article: Article) => {
        if (article.isActive) {
          menuItem.push(article);
        }
      });
      menuItem = menuItem.sort(function (a, b) {
        return a.order! - b.order!;
      });
      this.addNavigation(menuItem, groupedMap);
      this.isloading = "none";
    });
  }
  addNavigation(menuItem: Article[], groupedMap: Map<string, any>): void {
    let routerPaths: string[] = [];
    this.router.config.forEach((route) => {
      if (route.path != "") {
        routerPaths.push(route.path!.toLowerCase());
      }
    });
    menuItem.forEach((frstMenu) => {
      this.addNavControl(
        frstMenu.name!,
        !routerPaths.find((p) => p == frstMenu.name?.toLowerCase())
          ? "articles?postId=" + frstMenu.id
          : frstMenu.name?.toLocaleLowerCase(),
        frstMenu.id,
        groupedMap
      );
    });
    //console.log("window.location", window.location)
  }

  addNavControl(
    navText: string,
    navHref?: string,
    id?: string,
    children?: Map<string, any>
  ) {
    const li = this.renderer.createElement("li");
    const a = this.renderer.createElement("a");
    const aText = this.renderer.createText(navText);
    if (window.location.pathname.toLowerCase() == "/" + navText.toLowerCase()) {
      this.renderer.setAttribute(a, "class", "active");
    }
    this.renderer.setAttribute(a, "id", navText + "-" + id);
    //this.renderer.setAttribute(a, "ariaCurrentWhenActive", "page");
    if (navHref) {
      this.renderer.setAttribute(a, "href", navHref);
    }

    this.renderer.appendChild(a, aText);
    this.renderer.appendChild(li, a);
    //this.renderer.listen(a, "click", () => this.clickMe(navText + "-" + id));
    if (children?.get(navText)) {
      this.renderer.setAttribute(li, "class", "dropdown");
      if (
        window.location.pathname.toLowerCase() ==
        "/" + navText.toLowerCase()
      ) {
        this.renderer.setAttribute(a, "class", "dropbtn active");
      } else {
        this.renderer.setAttribute(a, "class", "dropbtn");
      }
      const divText = this.renderer.createElement("div"); //data-aid="NAV_MORE" style="pointer-events: none; display: flex; align-items: center;"
      this.renderer.setAttribute(divText, "data-aid", "NAV_MORE");
      this.renderer.setAttribute(
        divText,
        "style",
        "pointer-events: none; display: flex; align-items: center;"
      );
      this.renderer.appendChild(divText, aText);
      this.renderer.appendChild(a, divText);
      const svg = this.renderer.createElement("svg");
      this.renderer.setAttribute(svg, "viewBox", "0 0 24 24");
      this.renderer.setAttribute(svg, "fill", "white");
      this.renderer.setAttribute(svg, "width", "24");
      this.renderer.setAttribute(svg, "height", "24");
      this.renderer.setAttribute(svg, "data-ux", "Icon");
      //this.renderer.setAttribute(svg, "class", "x-el x-el-svg c2-1 c2-2 c2-q c2-r c2-s c2-t c2-u c2-v c2-f c2-3 c2-i c2-m c2-n c2-o c2-p");
      const path = this.renderer.createElement("path");
      this.renderer.setAttribute(path, "fill-rule", "evenodd");
      this.renderer.setAttribute(
        path,
        "d",
        "M19.774 7.86c.294-.335.04-.839-.423-.84L4.538 7c-.447-.001-.698.48-.425.81l7.204 8.693a.56.56 0 0 0 .836.011l7.621-8.654z"
      );
      this.renderer.appendChild(divText, svg);
      this.renderer.appendChild(svg, path);
      const div = this.renderer.createElement("div");
      this.renderer.setAttribute(div, "class", "dropdown-content");
      this.renderer.appendChild(li, div);

      //<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" data-ux="Icon" class="x-el x-el-svg c2-1 c2-2 c2-q c2-r c2-s c2-t c2-u c2-v c2-f c2-3 c2-i c2-m c2-n c2-o c2-p">
      //<path fill-rule="evenodd" d="M19.774 7.86c.294-.335.04-.839-.423-.84L4.538 7c-.447-.001-.698.48-.425.81l7.204 8.693a.56.56 0 0 0 .836.011l7.621-8.654z"></path></svg>
      children?.get(navText).forEach((childMenu: Article) => {
        if(!childMenu.isActive){
          return;
        }
        const childA = this.renderer.createElement("a");
        const ChildAText = this.renderer.createText(childMenu.name!);
        this.renderer.setAttribute(
          childA,
          "id",
          childMenu.name! + "-" + childMenu.id
        );
        //console.log("/" + childMenu.parent!.toLowerCase(), window.location.pathname.toLowerCase(), ": ", window.location.search.toLowerCase(), "?postId=" + childMenu.id!.toLowerCase())
        if (
          window.location.pathname.toLowerCase() ==
            ("/" + childMenu.parent!).toLowerCase() &&
          window.location.search.toLowerCase() ==
            ("?postId=" + childMenu.id!).toLowerCase()
        ) {
          this.renderer.setAttribute(childA, "class", "active");
        }
        // this.renderer.setAttribute(a, "routerLinkActive", "active");
        // this.renderer.setAttribute(a, "ariaCurrentWhenActive", "page");
        this.renderer.setAttribute(
          childA,
          "href",
          childMenu.parent?.toLocaleLowerCase() + "?postId=" + childMenu.id
        );

        this.renderer.appendChild(childA, ChildAText);
        this.renderer.appendChild(div, childA);
        // this.renderer.listen(childA, "click", () =>
        //   this.clickMe(childMenu.name! + "-" + childMenu.id)
        // );
      });
    }
    this.renderer.appendChild(this.insertTarget.nativeElement, li);
  }
}
