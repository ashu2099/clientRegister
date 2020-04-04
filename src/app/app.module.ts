import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { PageComponent } from "./page/page.component";
import { NewEntryComponent } from "./new-entry/new-entry.component";
import { SearchComponent } from "./search/search.component";
import { PolicyPojoComponent } from "./policy-pojo/policy-pojo.component";
import { AmendPolicyComponent } from "./amend-policy/amend-policy.component";
import { ModalBaseComponent } from "./modal-base/modal-base.component";
import { ResultRowComponent } from "./result-row/result-row.component";
import { ViewDocumentComponent } from "./view-document/view-document.component";
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageComponent,
    NewEntryComponent,
    SearchComponent,
    PolicyPojoComponent,
    AmendPolicyComponent,
    ModalBaseComponent,
    ResultRowComponent,
    ViewDocumentComponent,
    HomeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
