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
  // get all validator rules 
  const gotRules = await validatorRules.fetch();

  // get only AMP components for both email and websites
  let emailTags = gotRules.getTagsForFormat('AMP4EMAIL').filter((value) => value.tagName.startsWith('AMP-'));
  let ampTags = gotRules.getTagsForFormat('AMP').filter((value) => value.tagName.startsWith('AMP-'));

  // only get AMP tags that are also email valid
  let webAttrs = [];
  emailTags.forEach(function(element) {
    let currentTag = ampTags.filter((value) => (value.tagName == element.tagName))
    webAttrs.push(currentTag[0])
  })
  // grab only the amp component name and the list of attributes
  function makeObj(array, output) {
    array.forEach(function(element){
      let attributeList = [];
      element.attrs.forEach(function(attribute) {
        if (!attribute.name.startsWith(`aria`) || !attribute.name.startsWith(`[aria`))
          attributeList.push(attribute.name);
      })
      output.push({
          'name': element.tagName,
          'attributes': attributeList
      });      
    })
  }
  let emailAttrs = [];
  makeObj(emailTags, emailAttrs);
  let webAttrsOutput = [];
  makeObj(webAttrs, webAttrsOutput);

  // compare list of attributes on each object. 
  // place attributes that only appear on websites into array.
  let listOfInvalid = [];
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
  // write list of email component and invalid attributes to .csv file 
  csvWriter
  .writeRecords(listOfInvalid)
  .then(()=> console.log('The CSV file was written successfully'));
})();