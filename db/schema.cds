namespace com.hemanth.satinfotech;

entity Purchase {
    key PurchaseOrder                    : String(10);
    PurchaseOrderType                   : String(2);
    PurchaseOrderSubtype                : String(2);
    PurchasingDocumentOrigin            : String(2);
    PurchasingDocumentProcessCode       : String(2);
    Language                            : String(2);
}

