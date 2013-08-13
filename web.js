// Generated by CoffeeScript 1.3.3
(function() {
  var Feed, app, express, getNearest, loremIpsum, moment, port, seedRandom, units, _;

  express = require('express');

  Feed = require('feed');

  moment = require('moment');

  _ = require('lodash');

  loremIpsum = require('lorem-ipsum');

  seedRandom = require('seed-random');

  app = express();

  app.use(express.logger());

  units = {
    second: {
      nextUp: 'minute',
      mustDivide: 60
    },
    minute: {
      nextUp: 'hour',
      mustDivide: 60
    },
    hour: {
      nextUp: 'day',
      mustDivide: 24
    },
    day: {
      nextUp: 'year',
      mustDivide: 1
    },
    month: {
      nextUp: 'year',
      mustDivide: 12
    },
    year: {
      mustDivide: 1
    }
  };

  getNearest = function(interval, unit) {
    var now, returnDate, unitOptions;
    if (interval === 1) {
      return moment().utc().startOf(unit);
    } else {
      unitOptions = units[unit];
      if (unitOptions.mustDivide % interval !== 0) {
        throw "When using " + unit + "s the interval must divide " + unitOptions.mustDivide;
      }
      now = moment().utc();
      returnDate = now.clone().startOf(unitOptions.nextUp || unit);
      returnDate[unit](now[unit]() - now[unit]() % interval);
      return returnDate;
    }
  };

  app.get('/', function(request, response) {
    return response.send("<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <title>Lorem RSS</title>\n    <meta name=\"description\" content=\"Web service that generates lorem ipsum RSS feeds\">\n\n    <link rel=\"stylesheet\" href=\"//cdnjs.cloudflare.com/ajax/libs/foundation/4.2.3/css/normalize.min.css\">\n    <link rel=\"stylesheet\" href=\"//cdnjs.cloudflare.com/ajax/libs/foundation/4.2.3/css/foundation.min.css\">\n\n    <style type=\"text/css\">\n        ul.indent {\n            position: relative;\n            left: 20px;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"row\">\n        <div class=\"large-12 columns\">\n            <h1>Lorem RSS</h1>\n            <p>\n                Generates RSS feeds with content updated at regular intervals. I wrote this to\n                answer a <a href=\"http://stackoverflow.com/questions/18202048/are-there-any-constantly-updating-rss-feed-services-to-use-for-testing-or-just\">question I asked on Stack Overflow</a>.\n            </p>\n            <p>\n                The code for this service is <a href=\"https://github.com/mbertolacci/lorem-rss\">available on GitHub</a>.\n            <h2>API</h2>\n            <p>\n                Visit <a href=\"/feed\">/feed</a>, with the following optional parameters:\n            </p>        \n            <ul class=\"disc indent\">\n                <li>\n                    <em>unit</em>: one of second, minute, day, month, or year\n                </li>\n                <li>\n                    <em>interval</em>: an integer to repeat the units at.\n                    For seconds and minutes this interval must evenly divide 60,\n                    for month it must evenly divide 12, and for day and year it\n                    can only be 1.\n                </li>\n            </ul>\n            <h2>Examples</h2>\n            <ul class=\"disc indent\">\n                <li>\n                    The default, updates once a minute: <a href=\"/feed\">/feed</a>\n                </li>\n                <li>\n                    Update every second instead of minute: <a href=\"/feed?unit=minute\">/feed?unit=minute</a>\n                </li>\n                <li>\n                    Update every 30 seconds: <a href=\"/feed?unit=second&interval=30\">/feed?unit=second&interval=30</a>\n                </li>\n                <li>\n                    Update once a day: <a href=\"/feed?unit=day\">/feed?unit=day</a>\n                </li>\n                <li>\n                    Update every 6 months: <a href=\"/feed?unit=month&interval=6\">/feed?unit=month&interval=6</a>\n                </li>\n                <li>\n                    Update once a year: <a href=\"/feed?unit=year\">/feed?unit=year</a>\n                </li>\n                <li>\n                    <strong>Invalid example:</strong>\n                    update every 7 minutes (does not evenly divide 60):\n                    <a href=\"/feed?unit=minute&interval=7\">/feed?unit=minute&interval=7</a>\n                </li>\n            </ul>\n            <hr/>\n            <p class=\"copyright\">\n                <a rel=\"license\" href=\"http://creativecommons.org/licenses/by/3.0/deed.en_US\"><img alt=\"Creative Commons License\" style=\"border-width:0\" src=\"http://i.creativecommons.org/l/by/3.0/88x31.png\" /></a><br /><span xmlns:dct=\"http://purl.org/dc/terms/\" href=\"http://purl.org/dc/dcmitype/Text\" property=\"dct:title\" rel=\"dct:type\">Lorem RSS</span> (this page and the feeds generated) by <span xmlns:cc=\"http://creativecommons.org/ns#\" property=\"cc:attributionName\">Michael Bertolacci</span> are licensed under a <a rel=\"license\" href=\"http://creativecommons.org/licenses/by/3.0/deed.en_US\">Creative Commons Attribution 3.0 Unported License</a>.\n            </p>\n        </div>\n    </div>\n</body>\n</html>");
  });

  app.get('/feed', function(request, response) {
    var feed, i, interval, pubDate, unit, _i;
    if (request.query.interval != null) {
      interval = parseInt(request.query.interval);
    } else {
      interval = 1;
    }
    if (!interval) {
      response.send(500, "Interval must be an integer");
      return;
    }
    if (interval <= 0) {
      response.send(500, "Interval must be greater than 0");
      return;
    }
    unit = request.query.unit || 'minute';
    if (!units[unit]) {
      response.send(500, "Unit must be one of " + (_.keys(units).join(', ')));
      return;
    }
    feed = new Feed({
      title: "Lorem ipsum feed for an interval of " + interval + " " + unit + "s",
      description: 'This is a constantly updating lorem ipsum feed',
      link: 'http://example.com/',
      image: 'http://example.com/image.png',
      copyright: 'Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.',
      author: {
        name: 'Michael Bertolacci',
        email: '',
        link: 'https://mgnbsoftware.com'
      }
    });
    pubDate = getNearest(interval, unit);
    for (i = _i = 0; _i < 10; i = ++_i) {
      feed.item({
        title: "Lorem ipsum " + (pubDate.format()),
        description: loremIpsum({
          random: function() {
            return seedRandom(pubDate.unix())();
          }
        }),
        link: "http://example.com/test/" + (pubDate.format('X')),
        date: pubDate.clone().toDate()
      });
      pubDate = pubDate.subtract(interval, unit);
    }
    response.set('Content-Type', 'application/rss+xml');
    return response.send(feed.render('rss-2.0'));
  });

  port = process.env.PORT || 5000;

  app.listen(port, function() {
    return console.log("Listening on " + port);
  });

}).call(this);
