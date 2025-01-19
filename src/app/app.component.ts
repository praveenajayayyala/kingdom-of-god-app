import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ArticleService } from "./artical.service";
import { Article } from "./modal/article";
import { Router } from "@angular/router";
import { SharedService } from "./shared-service";

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  isloading = "block";
  constructor(
    private renderer: Renderer2,
    private articleService: ArticleService,
    private router: Router,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.sharedService.updateBackgroundColor('transparent');
  }
  ngAfterViewInit(): void {
    this.loadMenu();
  }
  @ViewChild("inserttarget", { static: true })
  insertTarget!: ElementRef;
  menucss: string = "collapse navbar-collapse";
  backgroundColor$ = this.sharedService.backgroundColor$;

  openCloseMenu() {
    if (this.menucss == "collapse navbar-collapse") {
      this.menucss = "navbar-collapse in";
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
    //if (window.location.pathname.toLowerCase() == "/" + navText.toLowerCase()) {
      this.renderer.setAttribute(a, "class", "nav-link px-lg-3 py-3 py-lg-4");
    //}
    this.renderer.setAttribute(a, "id", navText + "-" + id);
    //this.renderer.setAttribute(a, "ariaCurrentWhenActive", "page");
    if (navHref) {
      this.renderer.setAttribute(a, "href", navHref);
    }
    //this.renderer.setAttribute(li, "class", "nav-item dropdown");
    this.renderer.appendChild(a, aText);
    this.renderer.appendChild(li, a);
    //this.renderer.listen(a, "click", () => this.clickMe(navText + "-" + id));
    if (children?.get(navText)) {
      this.renderer.setAttribute(li, "class", "nav-item dropdown"); //txt
      // if (
      //   window.location.pathname.toLowerCase() ==
      //   "/" + navText.toLowerCase()
      // ) {
      //   this.renderer.setAttribute(a, "class", "dropbtn active");
      // } else {
        this.renderer.setAttribute(a, "class", "nav-link px-lg-3 py-3 py-lg-4"); //txt
      //}
      // const divText = this.renderer.createElement("ui"); //data-aid="NAV_MORE" style="pointer-events: none; display: flex; align-items: center;"
      // this.renderer.setAttribute(divText, "data-aid", "NAV_MORE");
      // this.renderer.setAttribute(
      //   divText,
      //   "class",
      //   "navbar-nav ms-auto py-4 py-lg-0 dropdown-content"
      // );
      // this.renderer.appendChild(divText, aText);
      // this.renderer.appendChild(a, divText);
      // const svg = this.renderer.createElement("li");
      // // this.renderer.setAttribute(svg, "viewBox", "0 0 24 24");
      // this.renderer.setAttribute(svg, "class", "nav-item");
      // // this.renderer.setAttribute(svg, "width", "24");
      // // this.renderer.setAttribute(svg, "height", "24");
      // // this.renderer.setAttribute(svg, "data-ux", "Icon");
      // //this.renderer.setAttribute(svg, "class", "x-el x-el-svg c2-1 c2-2 c2-q c2-r c2-s c2-t c2-u c2-v c2-f c2-3 c2-i c2-m c2-n c2-o c2-p");
      // const path = this.renderer.createElement("a");
      // this.renderer.setAttribute(a, "href", "/text");
      // // this.renderer.setAttribute(
      // //   path,
      // //   "d",
      // //   "M19.774 7.86c.294-.335.04-.839-.423-.84L4.538 7c-.447-.001-.698.48-.425.81l7.204 8.693a.56.56 0 0 0 .836.011l7.621-8.654z"
      // // );
      // this.renderer.appendChild(divText, svg);
      //this.renderer.appendChild(svg, path);
      const childUI = this.renderer.createElement("ui");
     
      this.renderer.setAttribute(childUI, "class", "dropdown-content");//navbar-nav ms-auto py-4 py-lg-0
      this.renderer.appendChild(li, childUI);

      //<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" data-ux="Icon" class="x-el x-el-svg c2-1 c2-2 c2-q c2-r c2-s c2-t c2-u c2-v c2-f c2-3 c2-i c2-m c2-n c2-o c2-p">
      //<path fill-rule="evenodd" d="M19.774 7.86c.294-.335.04-.839-.423-.84L4.538 7c-.447-.001-.698.48-.425.81l7.204 8.693a.56.56 0 0 0 .836.011l7.621-8.654z"></path></svg>
      children?.get(navText).forEach((childMenu: Article) => {
        if(!childMenu.isActive){
          return;
        }
        const childLI = this.renderer.createElement("li");
        this.renderer.setAttribute(childLI, "class", "nav-item dropdown");
        //this.renderer.appendChild(childLI, childUI);
        const childA = this.renderer.createElement("a");
        const ChildAText = this.renderer.createText(childMenu.name!);
        this.renderer.setAttribute(
          childA,
          "id",
          (childMenu.name!).replaceAll(' ', '') + "-" + childMenu.id
        );
        //console.log("/" + childMenu.parent!.toLowerCase(), window.location.pathname.toLowerCase(), ": ", window.location.search.toLowerCase(), "?postId=" + childMenu.id!.toLowerCase())
        // if (
        //   window.location.pathname.toLowerCase() ==
        //     ("/" + childMenu.parent!).toLowerCase() &&
        //   window.location.search.toLowerCase() ==
        //     ("?postId=" + childMenu.id!).toLowerCase()
        // ) {
          this.renderer.setAttribute(childA, "class", "nav-link px-lg-3 py-3 py-lg-4");
        //}
        // this.renderer.setAttribute(a, "routerLinkActive", "active");
        // this.renderer.setAttribute(a, "ariaCurrentWhenActive", "page");
        this.renderer.setAttribute(
          childA,
          "href",
          "/articles?postId=" + childMenu.id
        );

        this.renderer.appendChild(childA, ChildAText);
        this.renderer.appendChild(childLI, childA);
        this.renderer.appendChild(childUI, childLI);
        // this.renderer.listen(childA, "click", () =>
        //   this.clickMe(childMenu.name! + "-" + childMenu.id)
        // );
      });
    }
    else{
      this.renderer.setAttribute(li, "class", "nav-item");
    }
    this.renderer.appendChild(this.insertTarget.nativeElement, li);
  }
}
