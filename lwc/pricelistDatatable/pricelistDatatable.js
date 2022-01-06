import { LightningElement, api } from 'lwc';

import PricelistTitle from '@salesforce/label/c.PricelistTitle';
import CancelLabel from '@salesforce/label/c.CancelLabel';
import DownloadPdf from '@salesforce/label/c.DownloadPdf';

const COLUMNS = [
    {
        label: 'Trip',
        fieldName: 'tripName',
        type: 'text'
    },
    {
        label: 'Departure Date',
        fieldName: 'startDate',
        type: 'date'
    },
    {
        label: 'Space Point',
        fieldName: 'spacePointName',
        type: 'text'
    },
    {
        label: 'Flight Class',
        fieldName: 'flightClass',
        type: 'text'
    },
    { 
        label: 'Cost', 
        fieldName: 'cost', 
        type: 'currency' 
    },
];

export default class PricelistDatatable extends LightningElement {
    @api productWrappers;
    @api isModalBoxOpen = false;

    columns = COLUMNS;

    label = {
        PricelistTitle,
        CancelLabel,
        DownloadPdf
    }

    @api 
    openModalBox() {
        this.isModalBoxOpen = true;
    }

    closeModalBox() {
        this.isModalBoxOpen = false;
    }

    handleDownloadButton() {
        const downloadEvent = new CustomEvent(
            'download',
            {detail: this.template.querySelector('lightning-datatable').data}
        );
        this.dispatchEvent(downloadEvent);
        this.closeModalBox();
    }
}