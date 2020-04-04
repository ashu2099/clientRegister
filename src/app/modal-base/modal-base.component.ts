import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-modal-base",
  templateUrl: "./modal-base.component.html",
  styleUrls: ["./modal-base.component.scss"]
})
export class ModalBaseComponent implements OnInit {
  @Input() modalId;
  @Input() modalSize;

  modalSizeConfig: any;

  constructor() {}

  ngOnInit() {
    this.modalSizeConfig = {
      "modal-sm": this.modalSize == "sm",
      "modal-lg": this.modalSize == "lg",
      "modal-xl": this.modalSize == "xl"
    };
  }
}
