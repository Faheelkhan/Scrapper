
const rp = require('request-promise');
const $ = require('cheerio');
var cheerio = require('cheerio');
var HTMLParser = require('node-html-parser');
const potusParse = function(url) {
    return rp(url)
      .then(function(html) {
        return {
          name: $('.firstHeading', html).text(),
          birthday: $('.bday', html).text(),
        };
      })
      .catch(function(err) {
        //handle error
      });
  };
// const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

rp(url)
  .then(function(html){
    //success!
    collectIMG (html);
    collectTitle (html);
    console.log($('.img-responsive', html).text());
    // console.log($('.title', html).text());
  })
  .catch(function(err){
    //handle error
  });

  function collectIMG (html) {
    var m,
    urls = [], 
    str = html,
    rex = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/g;

    while ( m = rex.exec( str ) ) {
        urls.push( m[1] );
    }

    console.log( urls ); 
    // return urls
  }
  function collectTitle (html){
    // var root = HTMLParser.parse(html);
    // console.log(root);
    // $('ul[data-role="listview"] > li > a[href]').each(function(i,e){
    //     console.log("cartoon " + $(this).text());
    // });
    var $ = cheerio.load(html);
var x = []
    $('.offer').each(function(i, elm) {
        var change = $(this).text().replace(/\n|\r/g, " ") // for testing do text() 
        x.push(change);
    });
   
  }
  $(this).text().replace(/[\r\n]\s*/g, '\n')

   // urls = [], 
    // str = html,
    // rex = /<a[^>]+href="?([^"\s]+)"?[^>]*\/>/g;

    // while ( m = rex.exec( str ) ) {
    //     urls.push( m[1] );
    // }

    // console.log( urls ); 


  // rp(url)
//   .then(function(html) {
//     //success!
//     const wikiUrls = [];
//     for (let i = 0; i < 45; i++) {
//       wikiUrls.push($('big > a', html)[i].attribs.href);
//     }
//     return Promise.all(
//       wikiUrls.map(function(url) {
//         return potusParse('https://whatsonsale.com.pk' + url);
//       })    
//     );
//   })
//   .then(function(presidents) {
//     console.log(presidents);
//   })
//   .catch(function(err) {
//     //handle error
//     console.log(err);
//   });

