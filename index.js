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
    Object.values(gameInvJson['rgDescriptions']).forEach(element => {
        let item = {
            icon_url: element['icon_url'],
            market_name: element['market_name'],
            colour: typeof element['tags'][2]['color'] !== 'undefined' ? element['tags'][2]['color'] : 'bfbfbf' 
        }

        itemArray.push(item);
    });

    //console.log(itemArray);
    return itemArray;
}


//create html page
function createHtml(inputPath, outputPath, itemArray) {
    let $ = cheerio.load(fs.readFileSync(inputPath));
    $('#item-info').html('testing 123');

    fs.writeFile(outputPath, $.root().html(), {'encoding': 'utf-8'}, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

function main() {
    const HTML_FILE_PATH_IN = path.join(__dirname, 'template.html');
    const HTML_FILE_PATH_OUT = path.join(__dirname, 'index.html');
    let itemArray = getInvItems();
    createHtml(HTML_FILE_PATH_IN, HTML_FILE_PATH_OUT, itemArray);
}

main();