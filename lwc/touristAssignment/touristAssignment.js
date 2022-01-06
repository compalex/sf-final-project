import { LightningElement, wire} from 'lwc';
import { createRecord, getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import STATUS_FIELD from '@salesforce/schema/Flight__c.Status__c';
import TOURIST_FIELD from '@salesforce/schema/Flight__c.Tourist__c';
import TRIP_FIELD from '@salesforce/schema/Flight__c.Trip__c';
import ACTIVE_FIELD from '@salesforce/schema/Tourist__c.Active__c';
import FLIGHT_OBJECT from '@salesforce/schema/Flight__c';

import TripTitle from '@salesforce/label/c.TripTitle';
import TouristsAssigned from '@salesforce/label/c.TouristsAssigned';
import TouristAssignConfirmMsg from '@salesforce/label/c.TouristAssignConfirmMsg';
import PickATripMsg from '@salesforce/label/c.PickATripMsg';

import getSuitableTrips from '@salesforce/apex/TripController.getSuitableTrips';
import isActive from '@salesforce/apex/TripController.isActive';

import { showToast, getUrlParamValue } from 'c/utility';

export default class TouristAssignment extends LightningElement {
    touristId;
    tripId;
    userLocation;
    isLoading = false;
    hasLocation = false;

    label = {
        TripTitle,
        TouristsAssigned,
        TouristAssignConfirmMsg,
        PickATripMsg
    }

    @wire(getRecord, {recordId: '$touristId', fields: [ACTIVE_FIELD]})
    tourist;

    @wire(getSuitableTrips, {touristId : '$touristId'})
    trips;

    connectedCallback() {   
        this.touristId = getUrlParamValue('touristId');
        this.checkTouristId();
    }

    checkTouristId() {
        isActive({touristId: this.touristId})
            .then((result) => {
                if(!result) {
                    window.location.assign('https://wise-raccoon-lzakup-developer-edition.na162.force.com/s/tourist-registration');
                }
            })
            .catch((error) => {
                showToast(this, 'Error!', error.body.message, 'error');
            })
    }

    handleAccessGranted(event) {
        this.hasLocation = true;
        this.userLocation = event.detail;
    }

    handleTripSelect(event) {
        this.tripId = event.detail;
    }

    handleSubmitButton(event) {
        if(this.tripId) {
            this.template.querySelector('c-confirmation-window').openModalBox();
        } else {
            showToast(this, 'Error!', this.label.PickATripMsg, 'error');
        }
    }

    handleConfirm() {
        this.isLoading = true;

        const fields = {};
        fields[TOURIST_FIELD.fieldApiName] = this.touristId;
        fields[TRIP_FIELD.fieldApiName] = this.tripId;
        fields[STATUS_FIELD.fieldApiName] = 'Requested';

        const objRecordInput = {apiName : FLIGHT_OBJECT.objectApiName, fields};  

        createRecord(objRecordInput)
            .then(() => {
                refreshApex(this.trips);
                this.tripId = null;
                showToast(this, 'Success!', this.label.TouristsAssigned, 'success');
            })
            .catch(error => {
                showToast(this, 'Error!', error.body.message, 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }
}