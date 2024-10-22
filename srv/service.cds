using { com.hemanth.satinfotech as db } from '../db/schema';
using { CE_PURCHASEORDER_0001 as purchaseapi} from './external/CE_PURCHASEORDER_0001';

service sat {
    entity Purchase as projection on db.Purchase;
    entity PurchaseOrder as projection on purchaseapi.PurchaseOrder actions {
        action purchaseData() returns String;
    };
    @cds.redirection.target
    entity PurchaseOrderItem as projection on purchaseapi.PurchaseOrderItem;
    entity PurOrderItemPricingElement as projection on purchaseapi.PurOrderItemPricingElement;
    entity PurchaseOrderScheduleLine as projection on purchaseapi.PurchaseOrderScheduleLine;
    entity PurchaseOrderNote as projection on purchaseapi.PurchaseOrderNote;
    entity PurchaseOrderAccountAssignment as projection on purchaseapi.PurchaseOrderAccountAssignment;
    entity PurchaseOrderItemNote as projection on purchaseapi.PurchaseOrderItemNote;
}
