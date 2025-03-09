import { CommonModule, Location } from "@angular/common";
import { Component, HostListener, inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { selectSelectedAddress } from "../../store/address/address.selectors";
import * as AddressActions from '../../store/address/address.actions';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ConfirmDialogComponent } from "../../common/confirm-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroArrowLongLeft } from "@ng-icons/heroicons/outline";
@Component({
    selector: 'address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    imports: [CommonModule, MatDialogModule, ReactiveFormsModule, RouterModule, MatButtonModule, MatInputModule, MatCheckboxModule, NgIconComponent],
    providers: [provideIcons({ heroArrowLongLeft })],
    standalone: true
})
export class AddressComponent implements OnInit, OnDestroy {
    location = inject(Location);
    private fb = inject(FormBuilder);
    route = inject(ActivatedRoute);
    private store = inject(Store);
    addressForm: FormGroup;
    isEdit: boolean = false;
    addressId: number | null = null;
    private dialog = inject(MatDialog);
    private subs = new Subscription();
    showModal: boolean = true;
    constructor() {
        this.addressForm = this.fb.group({
            contactName: ['', Validators.required],
            address: ['', Validators.required],
            latitude: [0, Validators.required],
            longitude: [0, Validators.required],
            houseNo: ['', Validators.required],
            area: ['', Validators.required],
            landmark: [''],
            contactNumber: [''],
            instructions: ['']
        });
    }
    get address() {
        return this.addressForm.get('address');
    }
    get houseNo() {
        return this.addressForm.get('houseNo');
    }
    get area() {
        return this.addressForm.get('area');
    }
    get landmark() {
        return this.addressForm.get('landmark');
    }
    get contactNumber() {
        return this.addressForm.get('contactNumber');
    }
    get instructions() {
        return this.addressForm.get('instructions');
    }
    get contactName() {
        return this.addressForm.get('contactName');
    }
    ngOnInit(): void {
        this.addressId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : null;
        this.isEdit = !!this.addressId;
        if (this.isEdit && this.addressId) {
            // Load the address details from the store.
            this.store.dispatch(AddressActions.loadAddressDetails({ id: this.addressId }));
            this.subs.add(
                this.store.select(selectSelectedAddress).subscribe(address => {
                    if (address) {
                        this.addressForm.patchValue({
                            contactName: address.contactName,
                            address: address.address,
                            latitude: address.latitude,
                            longitude: address.longitude,
                            houseNo: address.houseNo,
                            area: address.area,
                            landmark: address.landmark,
                            contactNumber: address.contactNumber,
                            instructions: address.instructions,
                        });
                    }
                })
            );
        }
    }
    onSubmit(): void {
        if (this.addressForm.valid) {
            this.showModal = false;
            const formValue = this.addressForm.value;
            if (this.isEdit && this.addressId) {
                this.store.dispatch(AddressActions.updateAddress({ id: this.addressId, address: formValue }));
            } else {
                this.store.dispatch(AddressActions.createAddress({ address: formValue }));
            }
        }
    }
    goBack(): void {
        if (this.addressForm.dirty && this.showModal) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { mainText: 'Are you sure you want to leave this page?', subText: 'Any unsaved changes will be lost and this step cannot be undone', successText: 'Leave', cancelText: 'stay' },
            });
            dialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.location.back();
                }
            });
        } else {
            this.location.back();
        }
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    @HostListener('window:beforeunload', ['$event'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unloadNotification($event: any) {
        if (this.addressForm.dirty && this.showModal) {
            $event.returnValue = 'You have unsaved changes!';
        }
    }
}