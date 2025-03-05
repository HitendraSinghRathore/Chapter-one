import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [MatButtonModule],
    standalone: true
})
export class FooterComponent {
    year = new Date().getFullYear();
}