import { LightningElement, api, wire } from 'lwc';
import getNearestTrips from '@salesforce/apex/TripController.getNearestTrips';

import NearestStationsTitle from '@salesforce/label/c.NearestStationsTitle';
import YourLocation from '@salesforce/label/c.YourLocation';
import HereYouAreLocated from '@salesforce/label/c.HereYouAreLocated';
import FromYou from '@salesforce/label/c.FromYou';
import Km from '@salesforce/label/c.Km';

export default class NearestStations extends LightningElement {
    @api touristId;
    @api trips;
    @api latitude;
    @api longitude;

    @wire(getNearestTrips, {trips: '$trips', latitude: '$latitude', longitude: '$longitude'})
    nearestTrips;

    label = {
        NearestStationsTitle,
        YourLocation,
        HereYouAreLocated,
        FromYou,
        Km
    }

    get mapMarkers() {
        const map = [];

        map.push({
            location: {
                Latitude : this.latitude,
                Longitude : this.longitude,
            },
            title: this.label.YourLocation,
            icon: 'standard:address',
            description: this.label.HereYouAreLocated
        });

        this.nearestTrips.data.forEach(tripWrapper => {
            map.push({
                location: {
                    Latitude : tripWrapper.trip.Latitude__c,
                    Longitude : tripWrapper.trip.Longitude__c,
                },
                title: tripWrapper.trip.Name,
                icon: 'custom:custom88',
                description: this.label.FromYou + ' ' + Math.round(tripWrapper.distance) + ' ' + this.label.Km,
            })
        });

        return map;
    }
}