import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import downloadjs from '@salesforce/resourceUrl/downloadjs';

import downloadPDF from '@salesforce/apex/PrintJobPDFController.getPdfFileAsBase64String';
import getProductWrappers from '@salesforce/apex/TripController.getProductWrappers';

import PickTripTitle from '@salesforce/label/c.PickTripTitle';
import TripsPricelist from '@salesforce/label/c.TripsPricelist';
import PricelistDownloaded from '@salesforce/label/c.PricelistDownloaded';

import { showToast } from 'c/utility';

export default class AppHeader extends LightningElement {
    @api trips;

    isLoading = false;

    label = {
        PickTripTitle,
        TripsPricelist,
        PricelistDownloaded
    }

    @wire(getProductWrappers, {trips: '$trips'})
    productWrappers;

    generatePdf(event) {
        this.isLoading = true;

        downloadPDF({txtValue: JSON.stringify(event.detail)})
            .then(response => {
                var strFile = "data:application/pdf;base64," + response;
                window.download(strFile, "pricelist.pdf", "application/pdf");
                showToast(this, 'Success!', this.label.PricelistDownloaded, 'success');
            })
            .catch(error => {
                showToast(this, 'Error!', error.body.message, 'error');
            })
            .finally(() => {
                this.isLoading = false;
            })
    }

    renderedCallback() {
        loadScript(this, downloadjs)
            .then(() => console.log('Loaded download.js'))
            .catch(error => console.log(error));
    } 

    openPricelistModal() {
        this.template.querySelector('c-pricelist-datatable').openModalBox();
    }
}