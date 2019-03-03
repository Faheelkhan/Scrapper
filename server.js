var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var router = express.Router()
var path = require('path');
var filePath = path.join(__dirname,'haha.html')
const axios = require('axios')



var url = "https://whatsonsale.com.pk/";
// router.get ('/', function (req, res) {
    request (url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = scrapeDataFromHtml(body);
            console.log(data);
        }else {
            fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
                if(!err) {
                    var data = scrapeDataFromHtml(data);
                } else {
                    console.log(err);
                }
            })
        }
    });

// });
var dealsSchema = {
    brandName: '',
    contact: '',
    description: '',
    expiryDate: '',
    hotSale: '',
    id: '',
    linkUrl: '',
    location: '',
    shipping: '',
    startDate: '',
    thumbnailUrl: '',
    title: ''
}
var scrapeDataFromHtml = async function (html) {
    var data = {};
    var $ = cheerio.load(html);
    var j = 1;
    for (let index = 0; index < 15; index++) {
        
            var a = $(`div.views-row-${j}`);
            var htmlNodes = a.children().children().children();
            var expiryDateTemp = htmlNodes.find('span');
            var expiryDate = expiryDateTemp[0]?expiryDateTemp[0].attribs : '';
            
            var metadata = {
                brandName: '',
                linkUrl: htmlNodes.children().find('a').attr('href'),
                thumbnailUrl: htmlNodes.children().find('img').attr('src'),
                title: a.children('div').find('.title').text(),
                description: htmlNodes.text,
                id: index+1
            };
            let mergerd = await getWebsiteContent(metadata.linkUrl)
            metadata = { ...metadata , ...mergerd}
            data[j] = metadata;
            console.log(data)
            j++;
    }
   
    return data;
};


const getWebsiteContent = async (url) => {
    url = `https://whatsonsale.com.pk${url}`
    try {
      const response = await axios.get(url)
      const $ = cheerio.load(response.data)
      let html = $(`.description .clearfix`);
        
      console.log(html);
      var x = $(`.description`).find('p').children()
      var scrapedAllDescriptions =[]

    $('.description').children().each(function(i, elem) {
        if ($(this).text().substring(0, $(this).text().indexOf(":")) === 'Locations') {
            scrapedAllDescriptions.push($(this).html());
        } else {
            scrapedAllDescriptions.push($(this).text());
        }
    });

      var sDateEdate = {
        startDate: $('.date-display-single').html(),
        expiryDate: ($('.date-display-single').last().html() === $('.date-display-single').first().html())? '' : $('.date-display-single').last().html() ,
        description: scrapedAllDescriptions[0],
        ...( scrapedAllDescriptions[2].substring(0, scrapedAllDescriptions[2].indexOf(":")) === '<b>Locations'? {location: `https:${scrapedAllDescriptions[2].match(/href="([^"]*)/)? scrapedAllDescriptions[2].match(/href="([^"]*)/)[1] : ''}` || ''} : {shipping: scrapedAllDescriptions[2].substring(scrapedAllDescriptions[2].indexOf(':') + 1)}),
        ...( scrapedAllDescriptions[2].substring(0, scrapedAllDescriptions[2].indexOf(":")) === 'Shipping & Delivery'? {shipping: scrapedAllDescriptions[2].substring(scrapedAllDescriptions[2].indexOf(':') + 1)} : '' )
      }
       console.log(sDateEdate)
       return(sDateEdate)

    } catch (error) {
  
      console.error(error)
    }
  }


app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
