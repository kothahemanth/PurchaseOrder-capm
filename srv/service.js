const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const purchaseapi = await cds.connect.to('CE_PURCHASEORDER_0001');

    this.on('READ','PurchaseOrder', async (req) => {
            const PurchaseOrderData = await purchaseapi.run(req.query);
            return PurchaseOrderData;
    });

    this.on('READ', 'PurchaseOrderItem', async (req) => {
            const purchaseOrderItemData = await purchaseapi.run(req.query);
            return purchaseOrderItemData;
    }),

    this.on('READ', 'PurOrderItemPricingElement', async (req) => {
            const PurOrderItemPricingElement = await purchaseapi.run(req.query);
            return PurOrderItemPricingElement;
    });

    this.on('READ', 'POSubcontractingComponent', async (req) => {
            const POSubcontractingComponent = await purchaseapi.run(req.query);
            return POSubcontractingComponent;
    });

    this.on('READ', 'PurchaseOrderScheduleLine', async (req) => {
            const PurchaseOrderScheduleLine = await purchaseapi.run(req.query);
            return PurchaseOrderScheduleLine;
    });

    this.on('READ', 'PurchaseOrderNote', async (req) => {
            const PurchaseOrderNote = await purchaseapi.run(req.query);
            return PurchaseOrderNote;
    });

    this.on('READ', 'PurchaseOrderAccountAssignment', async (req) => {
            const PurchaseOrderAccountAssignment = await purchaseapi.run(req.query);
            return PurchaseOrderAccountAssignment;
    });

    this.on('READ', 'PurchaseOrderItemNote', async (req) => {
            const PurchaseOrderItemNote = await purchaseapi.run(req.query);
            return PurchaseOrderItemNote;
    });
});
    
