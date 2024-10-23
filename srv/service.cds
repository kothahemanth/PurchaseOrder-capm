using { CE_PURCHASEORDER_0001 as purchaseorderapi } from './external/CE_PURCHASEORDER_0001';
using {com.satinfotech.purchaseform as purchaseform} from '../db/schema';
service PurchaseOrderService {

    // entity PurchaseOrderSrv as projection on purchaseorderapi.PurchaseOrder {
    //     PurchaseOrder,
    //     Language,
    //     PurchasingOrganization as Company,
    //     CompanyCode,
    //     PaymentTerms,
    //     PurchaseOrderDate,
    //     TaxReturnCountry as CountryRegOfSalesTaxIDNumber,
    //     Supplier,
    //     VATRegistrationCountry as ComapnyCodeCountry,
    //     DocumentCurrency as Currency,
    //     _SupplierAddress.SupplierAddressID,
    //    // _SupplierAddress
       
    // };
//@cds.redirection.target
    entity PurchaseOrderSrv as projection on purchaseorderapi.PurchaseOrder 
    {
    key PurchaseOrder,
    Language,
    PurchasingOrganization as Company,
    CompanyCode,
    PaymentTerms,
    PurchaseOrderDate,
    TaxReturnCountry as CountryRegOfSalesTaxIDNumber,
    DocumentCurrency as Currency,
    Supplier,
    //_SupplierAddress    
    //_SupplierAddress.SupplierAddressID as SupplierAddressID,
    //_SupplierAddress.CityName as CityName,
    // _SupplierAddress.PostalCode as PostalCode,
    // _SupplierAddress.StreetName as StreetName,
    // _SupplierAddress.EmailAddress as EmailAddress,

    
}actions{
        action printForm(labelname:String
      @Common.ValueList: {
        CollectionPath: 'Label', 
        Label: 'Label',
        Parameters: [
          {
            $Type: 'Common.ValueListParameterInOut',
            LocalDataProperty: 'labelname',  
            ValueListProperty: 'Label'    
          }
        ]
      }) returns String
    };


      entity Label           as projection on purchaseform.Label;
    entity PurchaseOrderItem as projection on purchaseorderapi.PurchaseOrderItem{
        GrossAmount,
        PurchaseOrder,
        NetPriceAmount,
        OrderQuantity,
        PurchaseOrderQuantityUnit,
        OrderPriceUnit,
        PurchaseOrderItemText,
        Material,
        PurchaseOrderItem,
        DocumentCurrency as Currency,
        BaseUnit,
        ProductTypeCode,
        CompanyCode,
        
        
    }

    entity SupplierInfo as projection on purchaseorderapi.PurchaseOrder 
    {
    _SupplierAddress     
    }
    entity PurOrdItemPricingElement as projection on purchaseorderapi.PurOrderItemPricingElement{
        PurchaseOrder,
        PurchaseOrderItem,
        ConditionApplication,
        ConditionType,
        ConditionBaseAmount,
        ConditionRateAmount,
        ConditionBaseValue,
        ConditionCurrency,
        ConditionQuantity,
        ConditionQuantityUnit,
        ConditionAmount,
        TransactionCurrency,
        ConditionTypeName,
        ConditionBaseValueUnit,
        ConditionRateValueIntlUnit,
        ConditionRateValueUnit
    }
    entity POSubcontractingComponent as projection on purchaseorderapi.POSubcontractingComponent{
        PurchaseOrder,
        PurchaseOrderItem,
        ScheduleLine,
        Material,
        BaseUnit
    };
    entity PurchaseOrderScheduleLine as projection on purchaseorderapi.PurchaseOrderScheduleLine{
        PurchaseOrder,
        PurchaseOrderItem,
        ScheduleLine,
        ScheduleLineDeliveryDate,
        SchedLineStscDeliveryDate,
        PurchaseOrderQuantityUnit,
        Currency,
        ScheduleLineOrderDate
    };
    entity PurchaseOrderAccountAssignment as projection on purchaseorderapi.PurchaseOrderAccountAssignment{
         PurchaseOrder,
         PurchaseOrderItem,
         OrderQuantityUnit,
         Quantity,
         DocumentCurrency as Currency,
         CompanyCode,

    };
    entity PurchaseOrderItemNote as projection on purchaseorderapi.PurchaseOrderItemNote{
                PurchaseOrder,
                PurchaseOrderItem,
                TextObjectType,
                Language,
                PlainLongText,
                PurchaseOrderItemUniqueID,
    };
entity PurchaseOrderNote as projection on purchaseorderapi.PurchaseOrderNote{
                PurchaseOrder,
                TextObjectType,
                Language,
                PlainLongText,
    };
entity PurchaseOrderSupplierAddress as projection on purchaseorderapi.PurchaseOrderSupplierAddress{
    CityName,
    PostalCode,
    StreetName,
    PurchaseOrder,
    OrganizationName1,
    EmailAddress,
    SupplierAddressID,



};
    

}
 
annotate PurchaseOrderService.Label with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: Label
    }
],

);
