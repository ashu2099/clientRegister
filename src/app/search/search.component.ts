import { Component, OnInit } from "@angular/core";
import { RegisterDataService } from "../register-data.service";
import { RegisterApiService } from "../register-api.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  constructor(
    private RDS: RegisterDataService,
    private apiHandler: RegisterApiService
  ) {}

  userData: any;
  submitClicked: boolean;
  formStatus: any;
  formEmpty: boolean;

  sanityScore: number;
  resultSet: any;
  isRangeSearch: boolean = false;

  ngOnInit() {
    this.fetchAllPolicies();
  }

  manipulateRangeDiv() {
    let expiryFromDiv = document.getElementById("expiryFromDiv");
    if (!this.isRangeSearch) {
      this.isRangeSearch = true;

      let el = document.createElement("div");
      el.classList.add("form-group", "col-12", "col-sm-6", "col-lg-3");
      el.id = "expiryUptoDiv";
      el.innerHTML =
        '<label for="dateOfExpiryUpTo">Date Of Expiry Upto</label>' +
        '<input type="date" id="dateOfExpiryUpto" class="form-control" />' +
        '<div id="rangeError" class="invalid-feedback">Please enter date of Expiry upto.</div>';

      expiryFromDiv.parentNode.insertBefore(el, expiryFromDiv.nextSibling);
      document
        .querySelector("label[for=dateOfExpiry]")
        .classList.add("append-from");
    } else {
      this.isRangeSearch = false;

      expiryFromDiv.parentNode.removeChild(
        document.getElementById("expiryUptoDiv")
      );
      document
        .querySelector("label[for=dateOfExpiry]")
        .classList.remove("append-from");
    }
  }

  setNewPojo(userData) {
    this.userData = userData[0] as any;
    this.formStatus = userData[1];
  }

  isFormFilled() {
    for (let key in this.userData) {
      if (!!this.userData[key]) {
        return true;
      }
    }
    return false;
  }

  setSanityScore() {
    this.sanityScore = 0;
    for (let key in this.userData) {
      if (this.userData[key]) {
        this.sanityScore++;
      }
    }
  }

  fetchAllPolicies() {
    this.RDS.displayLoader();
    this.apiHandler.fetchAllPolicies().subscribe((response) => {
      this.RDS.setAllPolocies(response);
      this.RDS.removeLoader();
    });
  }

  startSearch() {
    this.submitClicked = true;

    if (this.isRangeSearch) {
      if (!(document.getElementById("dateOfExpiryUpto") as any).value) {
        document.getElementById("rangeError").style.display = "block";
        this.RDS.smoothScrollDocument();
        return null;
      } else {
        document.getElementById("rangeError").style.display = "none";
      }
    }

    if (this.isFormFilled()) {
      this.formEmpty = false;
      if (this.formStatus == "INVALID") {
        this.RDS.smoothScrollDocument();
      } else if (this.formStatus == "VALID") {
        this.RDS.displayLoader();
        this.resultSet = this.searchPolicies();
        console.log(this.resultSet);
        this.RDS.smoothScrollDocument("#searchCardBody");
        this.RDS.removeLoader();
      }
    } else {
      this.formEmpty = true;
    }
  }

  searchPolicies() {
    let inputArray = this.isRangeSearch
      ? this.applyRangeSearch()
      : this.RDS.getAllPolicies();

    this.setSanityScore();

    let name = this.userData.customerName
      ? this.userData.customerName.toLowerCase()
      : null;

    let vehicleNum = this.userData.vehicleNumber
      ? this.userData.vehicleNumber.toLowerCase()
      : null;

    let comName = this.userData.companyName
      ? this.userData.companyName.toLowerCase()
      : null;

    let vehType = this.userData.vehicleType
      ? this.userData.vehicleType.toLowerCase()
      : null;

    return inputArray.filter((policy) => {
      let searchScore = this.isRangeSearch ? 1 : 0;
      if (name && policy.customerName.toLowerCase().indexOf(name) != -1) {
        searchScore++;
      }
      if (
        this.userData.policyNumber &&
        this.userData.policyNumber == policy.policyNumber
      ) {
        searchScore++;
      }
      if (
        !this.isRangeSearch &&
        this.userData.dateOfExpiry &&
        this.userData.dateOfExpiry == policy.dateOfExpiry
      ) {
        searchScore++;
      }
      if (
        vehicleNum &&
        policy.vehicleNumber &&
        policy.vehicleNumber.toLowerCase() == vehicleNum
      ) {
        searchScore++;
      }
      if (
        this.userData.phoneNumber &&
        policy.phoneNumber &&
        this.userData.phoneNumber == policy.phoneNumber
      ) {
        searchScore++;
      }
      if (
        this.userData.dateOfInception &&
        policy.dateOfInception &&
        this.userData.dateOfInception == policy.dateOfInception
      ) {
        searchScore++;
      }
      if (
        policy.companyName &&
        comName &&
        policy.companyName.toLowerCase().indexOf(comName) != -1
      ) {
        searchScore++;
      }
      if (
        policy.vehicleType &&
        vehType &&
        policy.vehicleType.toLowerCase().indexOf(vehType) != -1
      ) {
        searchScore++;
      }

      return searchScore >= this.sanityScore;
    });
  }

  applyRangeSearch() {
    let expiryFrom = new Date(this.userData.dateOfExpiry);
    let expiryUpto = new Date(
      (document.getElementById("dateOfExpiryUpto") as any).value
    );

    return this.RDS.getAllPolicies().filter((policy) => {
      let policyDate = policy.dateOfExpiry
        ? new Date(policy.dateOfExpiry)
        : false;
      return policyDate && policyDate >= expiryFrom && policyDate <= expiryUpto;
    });
  }

  sortResultSetByExpiryDate() {
    if (this.resultSet.length > 1) {
      this.RDS.displayLoader();
      this.resultSet = this.resultSet.sort((a, b) => {
        return (
          new Date(a.dateOfExpiry).valueOf() -
          new Date(b.dateOfExpiry).valueOf()
        );
      });
      this.RDS.removeLoader();
    }
  }
}
