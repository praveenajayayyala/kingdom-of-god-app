import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ArticleService } from "./artical.service";
import { Article } from "./modal/article";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute
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
        menuItem.push(article);
      });
      menuItem = menuItem.sort(function (a, b) {
        return a.order! - b.order!;
      });
      this.addNavigation(menuItem, groupedMap);
    });
  }
  addNavigation(menuItem: Article[], groupedMap: Map<string, any>): void {
    menuItem.forEach((frstMenu) => {
      this.addNavControl(
        frstMenu.name!,
        frstMenu.name?.toLocaleLowerCase() + "?postId=" + frstMenu.id,
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
      const div = this.renderer.createElement("div");
      this.renderer.setAttribute(div, "class", "dropdown-content");
      this.renderer.appendChild(li, div);
      children?.get(navText).forEach((childMenu: Article) => {
        const childA = this.renderer.createElement("a");
        const ChildAText = this.renderer.createText(childMenu.name!);
        this.renderer.setAttribute(
          childA,
          "id",
          childMenu.name! + "-" + childMenu.id
        );
        //console.log("/" + childMenu.parent!.toLowerCase(), window.location.pathname.toLowerCase(), ": ", window.location.search.toLowerCase(), "?postId=" + childMenu.id!.toLowerCase())
        if (window.location.pathname.toLowerCase() == ("/" + childMenu.parent!).toLowerCase() &&
          window.location.search.toLowerCase() == ("?postId=" + childMenu.id!).toLowerCase()) {
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
