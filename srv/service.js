const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const purchaseapi = await cds.connect.to('CE_PURCHASEORDER_0001');

    this.on('READ', 'PurchaseOrder', async (req) => {
        // Select only the fields defined in service.cds for PurchaseOrder
        const purchaseOrders = await purchaseapi.run(
            SELECT.from('PurchaseOrder')
                .columns(
                    'PurchaseOrder', 
                    'PurchasingDocumentOrigin', 
                    'PurchaseOrderDate', 
                    'Language', 
                    'CompanyCode', 
                    'PurchasingOrganization', 
                    'Supplier', 
                    'DocumentCurrency', 
                    'TaxReturnCountry', 
                    'VATRegistrationCountry'
                )
        );

        const enrichedPurchaseOrders = await Promise.all(
            purchaseOrders.map(async (purchaseOrder) => {
                const purchaseOrderItems = await purchaseapi.run(
                    SELECT.from('PurchaseOrderItem')
                        .columns(
                            'PurchaseOrder', 
                            'PurchaseOrderItem', 
                            'PurchaseOrderCategory', 
                            'DocumentCurrency', 
                            'MaterialGroup', 
                            'Material', 
                            'MaterialType', 
                            'ManufacturerMaterial', 
                            'PurchaseOrderItemText', 
                            'ProductTypeCode', 
                            'CompanyCode', 
                            'Plant', 
                            'PurchaseOrderQuantityUnit', 
                            'BaseUnit', 
                            'OrderPriceUnit', 
                            'NetAmount', 
                            'GrossAmount', 
                            'OrderQuantity', 
                            'NetPriceAmount'
                        )
                        .where({ PurchaseOrder: purchaseOrder.PurchaseOrder })
                );

                const enrichedItems = await Promise.all(
                    purchaseOrderItems.map(async (item) => {
                        const [notes, accountAssignments, pricingElements, itemNotes] = await Promise.all([
                            purchaseapi.run(
                                SELECT.from('PurchaseOrderNote')
                                    .columns('PurchaseOrder', 'TextObjectType', 'Language', 'PlainLongText')
                                    .where({ PurchaseOrder: item.PurchaseOrder })
                            ),
                            purchaseapi.run(
                                SELECT.from('PurchaseOrderAccountAssignment')
                                    .columns(
                                        'PurchaseOrder', 
                                        'PurchaseOrderItem', 
                                        'AccountAssignmentNumber', 
                                        'CostCenter', 
                                        'OrderQuantityUnit', 
                                        'Quantity', 
                                        'MultipleAcctAssgmtDistrPercent', 
                                        'DocumentCurrency', 
                                        'IsDeleted', 
                                        'GLAccount', 
                                        'ControllingArea', 
                                        'ProfitCenter', 
                                        'FunctionalArea', 
                                        'IsFinallyInvoiced', 
                                        'SettlementReferenceDate', 
                                        'EarmarkedFundsDocumentItem', 
                                        'ValidityDate', 
                                        'ChartOfAccounts', 
                                        'CreationDate', 
                                        'IsAcctLineFinal', 
                                        'CompanyCode'
                                    )
                                    .where({ PurchaseOrder: item.PurchaseOrder, PurchaseOrderItem: item.PurchaseOrderItem })
                            ),
                            purchaseapi.run(
                                SELECT.from('PurOrderItemPricingElement')
                                    .columns(
                                        'PurchaseOrder', 
                                        'PurchaseOrderItem', 
                                        'PricingDocument', 
                                        'PricingDocumentItem', 
                                        'PricingProcedureStep', 
                                        'PricingProcedureCounter', 
                                        'ConditionApplication', 
                                        'ConditionType', 
                                        'PriceConditionDeterminationDte', 
                                        'ConditionCalculationType', 
                                        'ConditionBaseAmount', 
                                        'ConditionRateAmount', 
                                        'ConditionBaseValue', 
                                        'ConditionCurrency', 
                                        'ConditionQuantity', 
                                        'ConditionQuantityUnit', 
                                        'ConditionCategory', 
                                        'ConditionOrigin', 
                                        'ConditionAmount', 
                                        'TransactionCurrency', 
                                        'ConditionControl', 
                                        'ConditionClass', 
                                        'ConditionTypeName', 
                                        'ConditionBaseValueUnit', 
                                        'ConditionRateValueIntlUnit', 
                                        'ConditionRateValueUnit'
                                    )
                                    .where({ PurchaseOrder: item.PurchaseOrder, PurchaseOrderItem: item.PurchaseOrderItem })
                            ),
                            purchaseapi.run(
                                SELECT.from('PurchaseOrderItemNote')
                                    .columns('PurchaseOrder', 'PurchaseOrderItem', 'TextObjectType', 'Language', 'PlainLongText', 'PurchaseOrderItemUniqueID')
                                    .where({ PurchaseOrder: item.PurchaseOrder, PurchaseOrderItem: item.PurchaseOrderItem })
                            )
                        ]);

                        return {
                            ...item,
                            PurchaseOrderNote: notes,
                            PurchaseOrderAccountAssignment: accountAssignments,
                            PurOrderItemPricingElement: pricingElements,
                            PurchaseOrderItemNote: itemNotes
                        };
                    })
                );

                return {
                    ...purchaseOrder,
                    PurchaseOrderItem: enrichedItems
                };
            })
        );

        return enrichedPurchaseOrders;
    });
});
