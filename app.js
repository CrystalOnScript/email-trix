const validatorRules = require('@ampproject/toolbox-validator-rules');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'attributes', title: "Attributes"}
  ]
});
async function getAllValidatorRules() {
  const gotRules = await validatorRules.fetch();
  return gotRules;
 };
(async function () {
  const gotRules = await getAllValidatorRules()

  let emailTags = gotRules.getTagsForFormat('AMP4EMAIL')
  let ampTags = gotRules.getTagsForFormat('AMP')

  let listOfInvalid = [];
  emailTags.map(function(element) {
    let found = ampTags.find((value) => (value.tagName == element.tagName));
    webAttributes = found.attrs.map(function(attribute) {
      return attribute.name
    })
    emailAttributes = element.attrs.map(function(attribute) {
      return attribute.name
    })
    emailAttributes = webAttributes.filter((word) => !emailAttributes.includes(word));
    if(emailAttributes.length > 0) {
      listOfInvalid.push({
        'name': element.tagName,
        'attributes': emailAttributes
      });
    }
  });
  csvWriter
  .writeRecords(listOfInvalid)
  .then(()=> console.log('The CSV file was written successfully'));
})();