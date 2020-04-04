import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
} from "@angular/core";

declare const $: any;

@Component({
  selector: "app-policy-pojo",
  templateUrl: "./policy-pojo.component.html",
  styleUrls: ["./policy-pojo.component.scss"],
})
export class PolicyPojoComponent implements OnInit {
  constructor() {}

  @Input() formMode;
  @Input() oldData;
  @Input() submitClicked;
  @Output() pojoChange = new EventEmitter<any>();
  @ViewChild("pojoForm", { static: true }) pojoForm;

  userObj: any = {};

  reqs = {
    customerName: false,
    policyNumber: false,
    vehicleNumber: false,
    dateOfExpiry: false,
    uploadFile: false,
  };

  newVehicle: boolean = false;
  uploadedFile: string;

  ngOnInit() {
    this.checkAndPopulateOldData();
    this.setValidatiors();
    this.pojoForm.statusChanges.subscribe((x) => {
      this.pojoChange.emit([this.userObj, x]);
    });
  }

  checkAndPopulateOldData() {
    if (this.formMode == "amend" && this.oldData) {
      for (let key in this.oldData) {
        this.userObj[key] = this.oldData[key];
      }
    }
  }

  setValidatiors() {
    if (this.formMode != "search") {
      for (let key in this.reqs) {
        this.reqs[key] = true;
      }
    }

    if (this.formMode == "amend") {
      this.reqs.vehicleNumber = this.oldData.vehicleNumber ? true : false;
      this.reqs.uploadFile = false;
    }

    $(document).ready(function () {
      $("input:required").each((i, e) => {
        $(e).prev().addClass("label-required");
      });
    });
  }

  filterVehicleNumber() {
    if (this.userObj.vehicleNumber && this.userObj.vehicleNumber.length >= 10) {
      let val = this.userObj.vehicleNumber;
      val = val.replace(/[ -]/g, "");
      val = [
        val.slice(0, 2),
        val.slice(2, 4),
        val.slice(4, 6),
        val.slice(6, 10),
      ].join("-");
      this.userObj.vehicleNumber = val;
    }
  }

  onFileSelect(event) {
    let file = event.target.files[0];
    if (
      file &&
      ["image/jpeg", "image/png", "application/pdf"].indexOf(file.type) != -1
    ) {
      $("#policyFileName").text(file.name);
      let reader = new FileReader();
      reader.onload = () => {
        this.uploadedFile = reader.result as any;
        this.pojoChange.emit([undefined, undefined, this.uploadedFile]);
      };
      reader.readAsDataURL(file);
    } else {
      $("#policyFileName").text("Invalid Format");
    }
  }
}
