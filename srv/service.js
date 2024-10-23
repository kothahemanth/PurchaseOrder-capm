const cds = require('@sap/cds');
const { create } = require('xmlbuilder2');
const axios = require('axios');
module.exports = cds.service.impl(async function () {
    const purchaseorderapi = await cds.connect.to('CE_PURCHASEORDER_0001');

    this.on('READ', 'PurchaseOrderSrv', async (req) => {
        return await purchaseorderapi.run(req.query);
    });   

    this.on('READ', 'PurchaseOrderItem', async (req) => {
            return await purchaseorderapi.run(req.query);
    }),

    this.on('READ', 'PurOrdItemPricingElement', async (req) => {
            return await purchaseorderapi.run(req.query);;
    });

    this.on('READ', 'POSubcontractingComponent', async (req) => {
            return await purchaseorderapi.run(req.query);
    });

    this.on('READ', 'PurchaseOrderScheduleLine', async (req) => {
          return await purchaseorderapi.run(req.query);
    });

    this.on('READ', 'PurchaseOrderAccountAssignment', async (req) => {
        return await purchaseorderapi.run(req.query);
    });

    this.on('READ', 'PurchaseOrderItemNote', async (req) => {
        return await purchaseorderapi.run(req.query);
    });

    this.on('READ', 'PurchaseOrderNote', async (req) => {
        return await purchaseorderapi.run(req.query);
    });

    this.on('READ', 'PurchaseOrderSupplierAddress', async (req) => {
        return await purchaseorderapi.run(req.query);
    });

    const {Label}=this.entities
    this.on('printForm','PurchaseOrderSrv', async (req) => {
        const {PurchaseOrderSrv,PurchaseOrderItem,PurOrdItemPricingElement,POSubcontractingComponent,
            PurchaseOrderScheduleLine,PurchaseOrderAccountAssignment,PurchaseOrderItemNote
            ,PurchaseOrderNote,SupplierInfo}=this.entities
        // console.log(req.params);
        // console.log(req.data);
        
        const { PurchaseOrder } = req.params[0]; 
        //console.log(PurchaseOrder);

        const rowData = await purchaseorderapi.run(SELECT.from(PurchaseOrderSrv).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("rowData:",rowData);

        /* let query1 = SELECT.from(TransferPostingDocument).columns([{ref:['to_MaterialDocumentHeader'],expand:['*']}]).where({MaterialDocument: materialdocument});*/

        const SupplierInfor = await purchaseorderapi.run(SELECT.from(SupplierInfo).columns([{ref:['_SupplierAddress'],expand:['*']}]).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("SupplierInfo:",SupplierInfor);

        const PurchaseOrderitem=await purchaseorderapi.run(SELECT.from(PurchaseOrderItem).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("PurchaseOrderitem :",PurchaseOrderitem);

        const PricingElements=await purchaseorderapi.run(SELECT.from(PurOrdItemPricingElement).where({ PurchaseOrder: PurchaseOrder }));
        //.log("PricingElements:",PricingElements);

        const ContractingComponent=await purchaseorderapi.run(SELECT.from(POSubcontractingComponent).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("ContractingComponent:",ContractingComponent);

        const ScheduleLine=await purchaseorderapi.run(SELECT.from(PurchaseOrderScheduleLine).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("ScheduleLine:",ScheduleLine);

        const AccountAssignment=await purchaseorderapi.run(SELECT.from(PurchaseOrderAccountAssignment).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("AccountAssignment: ",AccountAssignment);

        const ItemNote=await purchaseorderapi.run(SELECT.from(PurchaseOrderItemNote).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("ItemNote:",ItemNote);

        const OrderNote=await purchaseorderapi.run(SELECT.from(PurchaseOrderNote).where({ PurchaseOrder: PurchaseOrder }));
        //console.log("OrderNote:",OrderNote);
        
        const structuredData = {
            PurchaseOrderNode: {
                ...rowData[0],
                SupplierAddress: SupplierInfor.map(supplier => ({
                    ...supplier._SupplierAddress
                }))[0],
        
                PurchaseOrderitems: {
                    PurchaseOrderitem: PurchaseOrderitem.map(item => ({
                        ...item,
                        ScheduleLines: {
                            ScheduleLine: ScheduleLine
                                .filter(line => line.PurchaseOrderItem === item.PurchaseOrderItem)
                                .map(line => ({
                                    ...line  
                                }))
                        },
                        PricingElements: {
                            PricingElement: PricingElements
                                .filter(pe => pe.PurchaseOrderItem === item.PurchaseOrderItem)
                                .map(pe => ({
                                    ...pe 
                                }))
                        },
                        ContractingComponent: [],
                        AccountAssignment: AccountAssignment.filter(aa => aa.PurchaseOrderItem === item.PurchaseOrderItem),
                        ItemNote: ItemNote.filter(inn => inn.PurchaseOrderItem === item.PurchaseOrderItem)
                    }))
                },
                OrderNote
            }
        };
        //console.log(structuredData);
        
        function ensureEmptyTags(obj) {
            if (Array.isArray(obj)) {
                return obj.length === 0 ? {} : obj.map(ensureEmptyTags);
            } else if (typeof obj === 'object' && obj !== null) {
                return Object.fromEntries(
                    Object.entries(obj).map(([key, value]) => [key, ensureEmptyTags(value)])
                );
            }
            return obj;
        }
        let labelname=req.data.labelname
        const updatedJsonData = ensureEmptyTags(structuredData);
        const xml = create(updatedJsonData).end({ prettyPrint: true });
        console.log("Generated XML:", xml);
        const base64Xml = Buffer.from(xml).toString('base64');
        //console.log("Base64 Encoded XML:", base64Xml);
        try {
            const authResponse = await axios.get('https://chembonddev.authentication.us10.hana.ondemand.com/oauth/token', {
                params: {
                    grant_type: 'client_credentials'
                },
                auth: {
                    username: 'sb-ffaa3ab1-4f00-428b-be0a-1ec55011116b!b142994|ads-xsappname!b65488',
                    password: 'e44adb92-4284-4c5f-8d41-66f8c1125bc5$F4bN1ypCgWzc8CsnjwOfT157HCu5WL0JVwHuiuwHcSc='
                }
            });
            const accessToken = authResponse.data.access_token;
            //console.log("Access Token:", accessToken);
            const pdfResponse = await axios.post('https://adsrestapi-formsprocessing.cfapps.us10.hana.ondemand.com/v1/adsRender/pdf?templateSource=storageName', {
                xdpTemplate: labelname,
                xmlData: base64Xml, 
                formType: "print",
                formLocale: "",
                taggedPdf: 1,
                embedFont: 0
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const fileContent = pdfResponse.data.fileContent;
           // console.log("File Content:", fileContent);
            return fileContent;
  
        } catch (error) {
            console.error("Error occurred:", error);
            return req.error(500, "An error occurred while processing your request.");
        }
     
    
    });

    this.on('READ',Label,async(req)=>{
        let Label=[
            {"Label":"hemanth/Default"},
            {"Label":"sumanth/Default"},
            {"Label":"annapurna/Default"},
        ]
        Label.$count=Label.length
        return Label;
    })

})