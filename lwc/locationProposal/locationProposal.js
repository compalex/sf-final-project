import { LightningElement, api } from 'lwc';
import { showToast } from 'c/utility';

import CancelLabel from '@salesforce/label/c.CancelLabel';
import LocationDenied from '@salesforce/label/c.LocationDenied';
import LocationPermissionTitle from '@salesforce/label/c.LocationPermissionTitle';
import LocationPermissionProposal from '@salesforce/label/c.LocationPermissionProposal';

export default class LocationProposal extends LightningElement {
    @api isModalBoxOpen = false;
    @api message;

    label = {
        CancelLabel,
        LocationDenied,
        LocationPermissionTitle,
        LocationPermissionProposal
    }

    connectedCallback() {
        this.isModalBoxOpen = true;
        this.doGeolocation();
    }

    closeModalBox() {
        this.isModalBoxOpen = false;
    }

    doGeolocation() {
        const success = (position) => {
            const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            this.dispatchEvent(new CustomEvent(
                'grant',
                {detail: userLocation}
            ));
        }

        const error = () => {
            showToast(this, 'Error!', this.label.LocationDenied, 'error');
        }
        
        return navigator.geolocation.getCurrentPosition(success, error);
    }
}