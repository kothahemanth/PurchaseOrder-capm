sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project1/test/integration/FirstJourney',
		'project1/test/integration/pages/PurchaseOrderSrvList',
		'project1/test/integration/pages/PurchaseOrderSrvObjectPage'
    ],
    function(JourneyRunner, opaJourney, PurchaseOrderSrvList, PurchaseOrderSrvObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project1') + '/index.html'
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