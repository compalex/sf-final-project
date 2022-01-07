global with sharing class TripWrapper implements Comparable {
    @AuraEnabled public Trip__c trip { get; set; }
    @AuraEnabled public Decimal distance { get; set; }

    public TripWrapper(Trip__c trip, Decimal distance) {
        this.trip = trip;
        this.distance = distance;
    }

    global Integer compareTo(Object compareTo) {
        TripWrapper compareToTrip = (TripWrapper) compareTo;
        if(distance == compareToTrip.distance) {
            return 0;
        }
        if(distance > compareToTrip.distance) {
            return 1;
        }
        return -1;
    }
}