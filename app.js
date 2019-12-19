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
  let emailTags = gotRules.getTagsForFormat('AMP4EMAIL')
  // .filter((value) => value.tagName.startsWith('AMP-'));
  let ampTags = gotRules.getTagsForFormat('AMP')
  // .filter((value) => value.tagName.startsWith('AMP-'));

  let webAttrs = new Map();
  let emailAttrs = new Map();
  emailTags.forEach(function(element) {
    let currentTag = ampTags.filter((value) => (value.tagName == element.tagName))
    let webTagAttribute = []
    currentTag[0].attrs.forEach(function(attribute) {
      webTagAttribute.push(attribute.name);
    })
    let emailTagAttribute = []
    element.attrs.forEach(function(attribute) {
      emailTagAttribute.push(attribute.name);
    })
    webAttrs.set(currentTag[0].tagName, webTagAttribute);
    emailAttrs.set(element.tagName, emailTagAttribute)
  })

let listOfInvalid = [];
emailAttrs.forEach(function(values, key) {
  webList = webAttrs.get(key);
  let filteredAttributes = webList.filter((word) => !values.includes(word));
  if(filteredAttributes.length > 0) {
    listOfInvalid.push({
      'name': key,
      'attributes': filteredAttributes
    });
  }

})
  // write list of email component and invalid attributes to .csv file 
  csvWriter
  .writeRecords(listOfInvalid)
  .then(()=> console.log('The CSV file was written successfully'));
})();