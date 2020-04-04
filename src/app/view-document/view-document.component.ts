import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { RegisterDataService } from "../register-data.service";

declare const $: any;

@Component({
  selector: "app-view-document",
  templateUrl: "./view-document.component.html",
  styleUrls: ["./view-document.component.scss"]
})
export class ViewDocumentComponent implements OnInit {
  type: string;
  fileData: any;
  showObject: boolean;

  constructor(
    private RDS: RegisterDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.RDS.get("viewDocEvent").subscribe(data => {
      this.showObject = true;
      if (data) {
        this.type =
          ["image/png", "image/jpeg"].indexOf(
            data.slice(5, 20).split(";")[0]
          ) != -1
            ? "IMG"
            : "PDF";

        this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(data);
      } else {
        $("#viewDocumentModal").modal("show");
      }
    });
  }

  closeDoc() {
    $("#viewDocumentModal").modal("hide");
    this.showObject = false;
  }
}
