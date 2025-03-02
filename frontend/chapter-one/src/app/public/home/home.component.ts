import { Component } from "@angular/core";
import { HeaderComponent } from "../../common/header/header.component";

@Component({
    selector: 'home',
    template: `<app-header></app-header>`,
    standalone: true,
    imports: [HeaderComponent],
})
export class HomeComponent {
    
}
