/**
 * config winston
 *http://stackoverflow.com/questions/20880540/node-js-winston-logging
 * Created by wmzy on 14-12-4.
 */
var logger = require('winston');
logger.setLevels({debug:0,info: 1,silly:2,warn: 3,error:4});
logger.addColors({debug: 'green',info:  'cyan',silly: 'magenta',warn:  'yellow',error: 'red'});
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { level: 'debug', colorize:true });
