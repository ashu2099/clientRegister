import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { PageComponent } from "./page/page.component";
import { NewEntryComponent } from "./new-entry/new-entry.component";
import { SearchComponent } from "./search/search.component";
import { LoginGuard } from "./login.guard";
import { AmendPolicyComponent } from "./amend-policy/amend-policy.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "app",
    component: PageComponent,
    children: [
      { path: "home", component: HomeComponent },
      { path: "new", component: NewEntryComponent },
      { path: "search", component: SearchComponent },
      { path: "amend", component: AmendPolicyComponent },
    ],
    canActivate: [LoginGuard],
  },
  { path: "**", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
