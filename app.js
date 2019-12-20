const validatorRules = require('@ampproject/toolbox-validator-rules');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


async function getAllValidatorRules() {
  const gotRules = await validatorRules.fetch();
  return gotRules;
 };
async function getWhiteList() {
  const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
      {id: 'name', title: 'Name'},
      {id: 'attributes', title: "Attributes"}
    ]
  });
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
};
// getWhiteList();

async function getBlackList() {
  const csvWriter = createCsvWriter({
    path: 'blacklist.csv',
    header: [
      {id: 'name', title: 'Name'},
      {id: 'attributes', title: "Attributes"}
    ]
  });
  const gotRules = await getAllValidatorRules();
  let emailTags = gotRules.getTagsForFormat('AMP4EMAIL');
  emailTags = emailTags.map(tag => tag.tagName)
  let tags = gotRules.raw.tags
  let printBlackList = [];
  emailTags = emailTags.map(function(element) {
    return found = tags.filter((value) => (value.tagName == element))
  })

  emailTags.map(function(foundTags) {
    foundTags.forEach(function(object) {
      if (object.hasOwnProperty('attrs')){
        object.attrs.forEach(function(attribute) {
          if (attribute.hasOwnProperty('disabledBy')) {
            if(attribute.disabledBy.includes('amp4email')) {
              printBlackList.push({'name': object.tagName,
              'attributes': attribute.name
              })
            }
          }
        })

      }

    })
  })
  csvWriter
  .writeRecords(printBlackList)
  .then(()=> console.log('The CSV file was written successfully'));
};

getBlackList();