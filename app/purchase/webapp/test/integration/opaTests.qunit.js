sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'purchase/test/integration/FirstJourney',
		'purchase/test/integration/pages/PurchaseOrderList',
		'purchase/test/integration/pages/PurchaseOrderObjectPage'
    ],
    function(JourneyRunner, opaJourney, PurchaseOrderList, PurchaseOrderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('purchase') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePurchaseOrderList: PurchaseOrderList,
					onThePurchaseOrderObjectPage: PurchaseOrderObjectPage
                }
            },
            opaJourney.run
        );
    }
);