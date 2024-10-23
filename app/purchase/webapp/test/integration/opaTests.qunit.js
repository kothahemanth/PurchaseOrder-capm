sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'purchase/test/integration/FirstJourney',
		'purchase/test/integration/pages/PurchaseOrderSrvList',
		'purchase/test/integration/pages/PurchaseOrderSrvObjectPage'
    ],
    function(JourneyRunner, opaJourney, PurchaseOrderSrvList, PurchaseOrderSrvObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('purchase') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePurchaseOrderSrvList: PurchaseOrderSrvList,
					onThePurchaseOrderSrvObjectPage: PurchaseOrderSrvObjectPage
                }
            },
            opaJourney.run
        );
    }
);