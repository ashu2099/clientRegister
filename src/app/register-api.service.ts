import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RegisterApiService {
  constructor(private http: HttpClient) {}

  private POLICIES = this.getServerUrl() + "policies";
  private POLICY_FILES = this.getServerUrl() + "policyFiles";
  private FECTH_VEHICLE =
    this.getServerUrl() + 'policies.json?orderBy="vehicleNumber"&equalTo=';

  getServerUrl() {
    //return "fuckyou";
    return "https://clientregisterdb.firebaseio.com/";
  }

  quote(data: string) {
    if (typeof data != "string") {
      throw new Error("cant quotify non-string");
    } else {
      return '"' + data + '"';
    }
  }

  addPolicy(userData) {
    let URL = this.POLICIES + "/" + userData.policyNumber + ".json";
    return this.http.put(URL, userData);
  }

  addPolicyFile(policyNumber, imageData) {
    let URL = this.POLICY_FILES + "/" + policyNumber + ".json";
    return this.http.put(URL, { base64: imageData });
  }

  fetchPolicyFile(fireID) {
    let URL = this.POLICY_FILES + "/" + fireID + ".json";
    return this.http.get(URL);
  }

  fetchPolicyByNumber(policyNumber) {
    let URL = this.POLICIES + "/" + policyNumber + ".json";
    return this.http.get(URL);
  }

  fetchByVehicleNumber(vehicleNumber) {
    return this.http.get(this.FECTH_VEHICLE + this.quote(vehicleNumber));
  }

  fetchAllPolicies() {
    return this.http.get(this.POLICIES + ".json");
  }

  deletePolicy(policyNumber) {
    let URL = this.POLICIES + "/" + policyNumber + ".json";
    return this.http.delete(URL, policyNumber);
  }

  deletePolicyFile(policyNumber) {
    let URL = this.POLICY_FILES + "/" + policyNumber + ".json";
    return this.http.delete(URL, policyNumber);
  }
}
