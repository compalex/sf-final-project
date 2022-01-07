global with sharing class ProductWrapper  {
    @AuraEnabled public String tripName { get; set; }
    @AuraEnabled public Date startDate { get; set; }
    @AuraEnabled public String spacePointName { get; set; }
    @AuraEnabled public Decimal cost { get; set; }
    @AuraEnabled public String flightClass {get; set; }
    

    public ProductWrapper(Trip__c trip, PricebookEntry pricebookEntry) {
        this.tripName = trip.Name;
        this.startDate = trip.Start_Date__c;
        this.spacePointName = pricebookEntry.SpacePointName__c;
        this.flightClass = pricebookEntry.Flight_Class__c;
        this.cost = pricebookEntry.UnitPrice;
    }
}
