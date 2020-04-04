import { Component, OnInit, Input } from "@angular/core";
import { RegisterDataService } from "../register-data.service";
import { RegisterApiService } from "../register-api.service";

@Component({
  selector: "app-amend-policy",
  templateUrl: "./amend-policy.component.html",
  styleUrls: ["./amend-policy.component.scss"],
})
export class AmendPolicyComponent implements OnInit {
  constructor(
    private RDS: RegisterDataService,
    private apiHandler: RegisterApiService
  ) {}

  userData: any;
  submitClicked: boolean;
  formStatus: any;
  oldData: any;
  uploadedFile: any;
  policyFileFetched: boolean;

  ngOnInit() {
    this.oldData = this.RDS.get("oldDataForAmending");
    this.RDS.smoothScrollDocument();
  }

  openDocument() {
    this.policyFileFetched
      ? this.RDS.get("viewDocEvent").emit()
      : this.fetchFileFromDB();
  }

  setData(userData) {
    this.userData = userData[0] ? userData[0] : this.userData;
    this.formStatus = userData[1] ? userData[1] : this.formStatus;

    if (userData[2]) {
      this.uploadedFile = userData[2];
      this.policyFileFetched = true;
      this.RDS.get("viewDocEvent").emit(userData[2]);
    }
  }

  amendPolicy() {
    this.submitClicked = true;
    if (this.formStatus == "VALID") {
      this.RDS.displayLoader();

      this.apiHandler.addPolicy(this.userData).subscribe(
        (outerResponse) => {
          if (this.uploadedFile) {
            this.apiHandler
              .addPolicyFile(outerResponse["policyNumber"], this.uploadedFile)
              .subscribe(
                (innerResponse) => {
                  this.RDS.triggerOK("Policy Amended & Uploaded Successfully");
                },
                (innerError) => {
                  this.RDS.triggerError(
                    "Policy Upload Failed. Please Try Again"
                  );
                }
              );
          } else {
            this.RDS.triggerOK("Policy Amended Successfully");
          }
        },
        (outerError) => {
          this.RDS.triggerError("Policy Addition Failed");
        }
      );
    } else {
      this.RDS.smoothScrollDocument();
    }
  }

  fetchFileFromDB() {
    this.RDS.displayLoader();
    this.apiHandler.fetchPolicyFile(this.oldData.policyNumber).subscribe(
      (response) => {
        this.policyFileFetched = true;
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
