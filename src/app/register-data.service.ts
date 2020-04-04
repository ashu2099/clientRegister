import { Injectable, EventEmitter } from "@angular/core";

declare let $: any;

@Injectable({
  providedIn: "root",
})
export class RegisterDataService {
  constructor() {
    this.data["userID"] = "asd";
  }

  private ALL_POLICIES = [];

  private data = {
    viewDocEvent: new EventEmitter(),
    users: {
      shakti: "1234",
      papa: "papa1234",
    },
  };

  get(key) {
    return this.data[key];
  }

  set(key, data) {
    this.data[key] = data;
  }

  getAllPolicies() {
    return this.ALL_POLICIES;
  }

  setAllPolocies(input) {
    if (typeof input == "object") {
      this.ALL_POLICIES = Object.values(input);
    }
  }

  displayLoader() {
    $("#loader").show();
  }

  removeLoader() {
    $("#loader").fadeOut();
  }

  triggerError(errorText) {
    $("#errorModalText").text(errorText);
    $("#errorModal").modal("show");
    this.removeLoader();
  }

  triggerOK(successText) {
    $("#successModalText").text(successText);
    $("#successModal").modal("show");
    this.removeLoader();
  }

  smoothScrollDocument(ID?) {
    $(document.documentElement).animate(
      {
        scrollTop: ID ? $(ID).prop("scrollHeight") : 0,
      },
      1000
    );
  }

  purgeData() {
    for (let key in this.data) {
      if (key != "viewDocEvent" && key != "users") {
        delete this.data[key];
      }
    }
  }
}
