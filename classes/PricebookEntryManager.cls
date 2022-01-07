public with sharing class PricebookEntryManager {

public static List<PricebookEntry> getByTripIds(Set<Id> tripIds) {
        if(tripIds == null || tripIds.isEmpty()) {
            return new List<PricebookEntry>();
        }

        return [
            SELECT UnitPrice, TripId__c, Flight_Class__c, SpacePointName__c
            FROM PricebookEntry
            WHERE TripId__c IN :tripIds
            ORDER BY Name
        ];
    }
}
