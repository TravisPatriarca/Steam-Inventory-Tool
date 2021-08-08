const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

let invItems = [];
const genreOptions = {
    headers: {
        cookie: 'birthtime=36000000'
    }
}
//GET INVENTORY ITEMS
async function getInvItems() {
    const SUPPORTED_GAME_IDS = [730];
    let gameInvUrl = 'https://steamcommunity.com/id/vintendi/inventory/#' + SUPPORTED_GAME_IDS[0];
    let gameInvResponse = await fetch(gameInvUrl);
    let gameInvHtml = await gameInvResponse.text();

    let $ = cheerio.load(gameInvHtml, genreOptions);
    console.log($.html());
    $('.inventory_item_link').each(function(i, obj) {
        invItems[i] = $(this).attr('href');
    });

    console.log(invItems.length);
    console.log(gameInvUrl)

    fs.writeFile(path.join(__dirname, 'test.html'), $.root().html(), {'encoding': 'utf-8'}, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}
getInvItems();

/*//SAVE CHEERIO FILE
const HTML_FILE_PATH_IN = path.join(__dirname, 'template.html');
const HTML_FILE_PATH_OUT = path.join(__dirname, 'index.html');
let $ = cheerio.load(fs.readFileSync(HTML_FILE_PATH_IN));
$('#item-info').html('testing 123');

console.log($.root().html());

fs.writeFile(HTML_FILE_PATH_OUT, $.root().html(), {'encoding': 'utf-8'}, function (err) {
    if (err) {
        return console.log(err);
    }
});*/