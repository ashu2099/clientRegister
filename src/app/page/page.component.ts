import { Component, OnInit, HostListener } from "@angular/core";
import { RegisterDataService } from "../register-data.service";

@Component({
  selector: "app-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"],
})
export class PageComponent implements OnInit {
  constructor(private RDS: RegisterDataService) {}

  ngOnInit() {}

  @HostListener("window:scroll")
  handleNavBarEffect() {
    let navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 16 ||
      document.documentElement.scrollTop > 16
    ) {
      navbar.classList.remove("navbar-big");
    } else {
      navbar.classList.add("navbar-big");
    }
  }

  logOut() {
    this.RDS.purgeData();
  }
}
