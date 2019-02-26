var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var router = express.Router()
var path = require('path');
var filePath = path.join(__dirname,'haha.html')
const axios = require('axios')

// app.get('/scrape', function(req, res){

// var arr = []
// request(url, function(error, response, html){
//     if(!error){
//         var $ = cheerio.load(html);

//     var title, release, rating;
//     var json = { title : "", description : "", rating : ""};

//     $('.views-row-1').filter(function(){
//         var data = $(this);
//         title = data.children().first().text();            
//         release = data.children().last().children().text();

//         json.title = data.children('div').find('.title').html();
//         json.description = data.children('div').find('.description').html();
//         data.children('div').find('.thumbnail').children().children().children().children().children().each( (index, value) => {
//             var link = $(value).attr('src');
//             json.image = link
//          });
//         arr.push(json)
//     })
// console.log(arr);
//     $('.star-box-giga-star').filter(function(){
//         var data = $(this);
//         rating = data.text();

//         json.rating = rating;
//     })
// }

// // To write to the system we will use the built in 'fs' library.
// // In this example we will pass 3 parameters to the writeFile function
// // Parameter 1 :  output.json - this is what the created filename will be called
// // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// // Parameter 3 :  callback function - a callback function to let us know the status of our function

// fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

//     console.log('File successfully written! - Check your project directory for the output.json file');

// })

// // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
// res.send('Check your console!')

//     }) ;
// })

// app.listen('8081')
// console.log('Magic happens on port 8081');
// exports = module.exports = app;

var url = "file:///home/faheelkhan/Desktop/crawler/haha.html";
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
    for (let index = 0; index < 20; index++) {
        
            var a = $(`div.views-row-${j}`);
            var htmlNodes = a.children().children().children();
            var expiryDateTemp = htmlNodes.find('span');
            var expiryDate = expiryDateTemp[0]?expiryDateTemp[0].attribs : '';
            
            var metadata = {
                brandName: '',
                linkUrl: htmlNodes.children().find('a').attr('href'),
                thumbnailUrl: htmlNodes.children().find('img').attr('src'),
                title: a.children('div').find('.title').text(),
                description: htmlNodes.text
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
        scrapedAllDescriptions.push($(this).html());
        });

      var sDateEdate = {
        startDate: $('.date-display-single').html(),
        expiryDate: $('.date-display-single').last().html(),
        location: `https:${scrapedAllDescriptions[2].match(/href="([^"]*)/)? scrapedAllDescriptions[2].match(/href="([^"]*)/)[1] : ''}` || '',
        description: scrapedAllDescriptions[0],
        // shipping: 
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
