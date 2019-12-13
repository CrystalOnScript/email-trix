const validatorRules = require('@ampproject/toolbox-validator-rules');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'attributes', title: "Attributes"}
  ]
});

(async function () {
    let emailAttrs = [];
    let webAttrs = [];
    let webAttrsOutput = [];
    let listOfInvalid = [];
    const gotRules = await validatorRules.fetch();
    const tags = gotRules.getTagsForFormat('AMP4EMAIL');
    let getEmailTags = tags.filter((value) => value.tagName.startsWith('AMP-'));
    let ampTags = gotRules.getTagsForFormat('AMP');
    let getAMPTags = ampTags.filter((value) => value.tagName.startsWith('AMP-'));
    getEmailTags.forEach(function(element) {
      let currentTag = getAMPTags.filter((value) => (value.tagName == element.tagName))
      webAttrs.push(currentTag[0])
    })
    webAttrs.forEach(function(element){
      let attributeList = [];
      element.attrs.forEach(function(attribute){
        attributeList.push(attribute.name)
      })
      let noAria = attributeList.filter((value) => !(value.startsWith('aria') || value.startsWith('[aria')));
      webAttrsOutput.push({
          'name': element.tagName,
          'attributes': noAria
      });
    })
    // console.log(webAttrsOutput, "webAttrsOutput")
    getEmailTags.forEach(function(element) {
        let attributeList = [];
        element.attrs.forEach(function(attribute) {
            attributeList.push(attribute.name)
        })
        let noAria = attributeList.filter((value) => !(value.startsWith('aria') || value.startsWith('[aria')));
        emailAttrs.push({
            'name': element.tagName,
            'attributes': noAria
        });
    })
    webAttrsOutput.forEach(function(element){
      let indexNumber = webAttrsOutput.indexOf(element)
      let emailItem = emailAttrs[indexNumber].attributes
      let currentAttributes = [];
      element.attributes.forEach(function(attribute) {
        if (!emailItem.includes(attribute)) {
          currentAttributes.push(attribute);
        } 
      })
        listOfInvalid.push({
          'name': element.name,
          'attributes': currentAttributes
      });
    })
    console.log("web", webAttrsOutput[0].attributes.length, "email",emailAttrs[0].attributes.length)
    console.log(listOfInvalid, "listOfInvalid")
    csvWriter
    .writeRecords(listOfInvalid)
    .then(()=> console.log('The CSV file was written successfully'));
})();



