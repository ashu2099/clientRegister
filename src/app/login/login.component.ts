import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RegisterDataService } from "../register-data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  wrongPass: boolean;
  constructor(private router: Router, private RDS: RegisterDataService) {}

  ngOnInit() {}

  submitLogin(a) {
    if ((this.RDS.get("users")[this.userName] = this.password)) {
      this.router.navigate(["app/home"]);
      this.RDS.set("userID", this.userName);
    } else {
      this.wrongPass = true;
    }
  }
}
