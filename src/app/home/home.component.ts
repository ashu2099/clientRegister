import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RegisterDataService } from "../register-data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  userID: string;

  constructor(private RDS: RegisterDataService) {}

  ngOnInit() {
    this.userID = this.RDS.get("userID");
    if (this.userID.toLowerCase() == "shakti") {
      this.userID = "mummy";
    }
  }
}
