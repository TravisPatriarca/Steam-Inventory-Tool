const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

//get inventory items
async function getInvItems() {
    const SUPPORTED_GAME_IDS = [730];
    let gameInvUrl = 'https://steamcommunity.com/id/vintendi/inventory/json/' + SUPPORTED_GAME_IDS[0] + '/2/';
    let gameInvResponse = await fetch(gameInvUrl);
    let gameInvJson = await gameInvResponse.json();

    let itemArray = [];
    Object.values(gameInvJson['rgInventory']).forEach(element => {
        let itemID = element['classid'];
        if (typeof itemArray[itemID] === 'undefined') {
            itemArray[itemID] = {
                item_id: itemID,
                amount: 1
            }

            Object.values(gameInvJson['rgDescriptions']).forEach(element => {
                if (element['classid'] == itemID) {
                    itemArray[itemID].market_name = element['market_name'];
                    itemArray[itemID].colour = typeof element['tags'][2]['color'] !== 'undefined' ? element['tags'][2]['color'] : 'bfbfbf' ;
                }
            });
        }
        else
        {
            itemArray[itemID].amount++;
        }
    });

    
    return itemArray;
}

//create html page
function createHtml(inputPath, outputPath, itemArray) {
    let $ = cheerio.load(fs.readFileSync(inputPath), {
        xmlMode: true,
        decodeEntities: false
    });
    let tableContent = '';

    for (var key in itemArray) {
        tableContent += '<tr>' + itemArray[key].market_name + '</tr>';
    }

    console.log(tableContent);
    $('#item-table').text(tableContent.toString());

    fs.writeFile(outputPath, $.root().html(), {'encoding': 'utf-8'}, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

async function main() {
    const HTML_FILE_PATH_IN = path.join(__dirname, 'template.html');
    const HTML_FILE_PATH_OUT = path.join(__dirname, 'index.html');
    let itemArray = await getInvItems();
    createHtml(HTML_FILE_PATH_IN, HTML_FILE_PATH_OUT, itemArray);
}

main();