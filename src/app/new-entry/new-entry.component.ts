import { Component, OnInit } from "@angular/core";
import { RegisterApiService } from "../register-api.service";
import { RegisterDataService } from "../register-data.service";

declare const $: any;

@Component({
  selector: "app-new-entry",
  templateUrl: "./new-entry.component.html",
  styleUrls: ["./new-entry.component.scss"],
})
export class NewEntryComponent implements OnInit {
  constructor(
    private RDS: RegisterDataService,
    private apiHandler: RegisterApiService
  ) {}

  userData: any;
  submitClicked: boolean;
  formStatus: any;
  uploadedFile: any;
  oldPolicyNumberForExistingVehicle: string;

  ngOnInit() {}

  openDocument() {
    this.RDS.get("viewDocEvent").emit();
  }

  setData(userData) {
    this.userData = userData[0] ? userData[0] : this.userData;
    this.formStatus = userData[1] ? userData[1] : this.formStatus;

    if (userData[2]) {
      this.uploadedFile = userData[2];
      this.RDS.get("viewDocEvent").emit(userData[2]);
    }
  }

  makeNewEntry() {
    this.submitClicked = true;
    if (this.formStatus == "VALID" && this.uploadedFile) {
      this.RDS.displayLoader();

      if (this.RDS.checkStranger()) {
        this.RDS.triggerError(
          "This User is not authorized to mutate the database. It holds search previlages only."
        );
        return undefined;
      }

      this.apiHandler
        .fetchPolicyByNumber(this.userData.policyNumber)
        .subscribe((checkResponse) => {
          if (checkResponse == null) {
            if (this.userData.vehicleNumber) {
              this.checkIfVehicleExists();
            } else {
              this.addPolicy();
            }
          } else {
            this.RDS.triggerError("This policy already exists in the system.");
          }
        }, this.handleAPIError);
    } else {
      this.RDS.smoothScrollDocument();
    }
  }

  checkIfVehicleExists() {
    this.apiHandler
      .fetchByVehicleNumber(this.userData.vehicleNumber)
      .subscribe((response) => {
        response = Object.values(response)[0];
        if (response && response["vehicleNumber"]) {
          this.oldPolicyNumberForExistingVehicle = response["policyNumber"];
          this.triggerPrompt();
        } else {
          this.addPolicy();
        }
      }, this.handleAPIError);
  }

  addPolicy() {
    this.apiHandler.addPolicy(this.userData).subscribe((outerResponse) => {
      this.apiHandler
        .addPolicyFile(outerResponse["policyNumber"], this.uploadedFile)
        .subscribe(
          (innerResponse) => {
            if (this.oldPolicyNumberForExistingVehicle) {
              this.removePreviousPolicy(this.oldPolicyNumberForExistingVehicle);
            }
            this.RDS.triggerOK("Policy Added Successfully");
          },
          (innerError) => {
            this.RDS.triggerError(
              `Policy Upload Failed. 
                Please search for this policy number 
                in search menu and amend the policy document`
            );
          }
        );
    }, this.handleAPIError);
  }

  triggerPrompt() {
    this.RDS.removeLoader();
    $("#renewalPromptModal").modal("show");
  }

  promptedYes() {
    this.RDS.displayLoader();
    this.addPolicy();
    $("#renewalPromptModal").modal("hide");
  }

  promptedNo() {
    $("#renewalPromptModal").modal("hide");
  }

  removePreviousPolicy(policyNumber) {
    this.oldPolicyNumberForExistingVehicle = "";
    this.apiHandler.deletePolicy(policyNumber).subscribe(
      (response) => {
        this.apiHandler.deletePolicyFile(policyNumber).subscribe(
          () => {},
          (error) => {
            this.handleAPIError(policyNumber);
          }
        );
      },
      (error) => {
        this.handleAPIError(policyNumber);
      }
    );
  }

  handleAPIError(policyNumberToDelete?) {
    if (policyNumberToDelete) {
      this.RDS.triggerError(
        `Deleteing Old Policy Failed. 
        You can click OK and continue working, 
        but please make note of this Policy Number 
        ${policyNumberToDelete}
        and ask Ashutosh to handle it respectively.`
      );
    } else {
      this.RDS.triggerError("Policy Addition Failed.");
    }
  }
}
