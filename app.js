const validatorRules = require('@ampproject/toolbox-validator-rules');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'attributes', title: "Attributes"}
  ]
});

let emailTags = (async function () {
    let emailAttrs = [];
    const gotRules = await validatorRules.fetch();
    const tags = gotRules.getTagsForFormat('AMP4EMAIL');
    let getEmailTags = tags.filter((value) => value.tagName.startsWith('AMP-'));
    getEmailTags.forEach(function(element) {
        let attributeList = [];
        element.attrs.forEach(function(attribute) {
            attributeList.push(attribute.name)
        })
        let noAria = attributeList.filter((value) => !(value.startsWith('aria') || value.startsWith('[')));
        emailAttrs.push({
            'name': element.tagName,
            'attributes': noAria
        });
    })
    csvWriter
    .writeRecords(emailAttrs)
    .then(()=> console.log('The CSV file was written successfully'));

})();



