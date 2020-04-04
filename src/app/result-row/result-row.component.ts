import { Component, OnInit, Input } from "@angular/core";
import { RegisterDataService } from "../register-data.service";
import { Router } from "@angular/router";
import { RegisterApiService } from "../register-api.service";

@Component({
  selector: "app-result-row",
  templateUrl: "./result-row.component.html",
  styleUrls: ["./result-row.component.scss"],
})
export class ResultRowComponent implements OnInit {
  @Input() policy: any;
  displayFold = false;
  toggleText = "Expand";

  constructor(
    private router: Router,
    private apiHandler: RegisterApiService,
    private RDS: RegisterDataService
  ) {}

  ngOnInit() {}

  toggleFold() {
    this.displayFold = !this.displayFold;
    this.toggleText = this.displayFold ? "Collapse" : "Expand";
  }

  editPolicy() {
    this.RDS.set("oldDataForAmending", this.policy);
    this.router.navigate(["app/amend"]);
  }

  viewDocument() {
    this.RDS.displayLoader();
    this.apiHandler.fetchPolicyFile(this.policy.policyNumber).subscribe(
      (response) => {
        this.RDS.get("viewDocEvent").emit(response["base64"]);
        this.RDS.get("viewDocEvent").emit();
        this.RDS.removeLoader();
      },
      (error) => {
        this.RDS.triggerError(
          "Failed to fetch file from system. Please try again."
        );
      }
    );
  }
}
