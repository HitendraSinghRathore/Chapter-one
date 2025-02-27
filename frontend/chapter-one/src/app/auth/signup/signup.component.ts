import { Component } from "@angular/core";
import {MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    imports: [MatFormFieldModule, MatLabel,MatInputModule, MatButtonModule],
    standalone: true

})
export class SignupComponent {

}