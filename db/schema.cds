namespace com.satinfotech.purchaseform;
using {managed,cuid} from '@sap/cds/common';

// entity PurchaseOrder : cuid,managed {
    
    
// }

@cds.persistence.skip
entity Label {

      @title: 'Label'
      Label : String(80);

}