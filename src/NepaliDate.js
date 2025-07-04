'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _config = require('./config');

var _format2 = require('./format');

var _format3 = _interopRequireDefault(_format2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SUM_IDX = 14;

function _parse(dateString) {
  // Expected date formats are yyyy-mm-dd, yyyy.mm.dd yyyy/mm/dd
  var parts = dateString.split(/[-./]/, 3);

  var _parts$map = parts.map(function (d) {
    var n = parseInt(d, 10);
    if (Number.isNaN(n)) {
      throw new Error('Invalid date');
    }
    return n;
  }),
      _parts$map2 = _slicedToArray(_parts$map, 3),
      year = _parts$map2[0],
      _parts$map2$ = _parts$map2[1],
      month = _parts$map2$ === undefined ? 1 : _parts$map2$,
      _parts$map2$2 = _parts$map2[2],
      day = _parts$map2$2 === undefined ? 1 : _parts$map2$2;

  // Make sure we are within range


  if (year < _config.START_YEAR || year >= _config.START_YEAR + _config.NEPALI_DATE_MAP.length) {
    throw new Error('Nepal year out of range');
  }

  if (month < 1 || month > 12) {
    throw new Error('Invalid nepali month must be between 1 - 12');
  }

  var daysInMonth = _config.NEPALI_DATE_MAP[year - _config.START_YEAR][month];
  if (day < 1 || day > daysInMonth) {
    throw new Error('Invalid nepali date must be between 1 - ' + daysInMonth + ' in ' + year + ' ' + month);
  }

  return [year, month - 1, day];
}

var NepaliDate = function () {
  function NepaliDate() {
    _classCallCheck(this, NepaliDate);
    
    if (arguments.length === 0) {
      this.setEnglishDate(new Date());
    } else if (arguments.length === 1) {
      var e = arguments[0];
      
      // Check if the argument is not undefined and not null before proceeding
      if (e != null && e !== undefined) {
        if (e instanceof Date) {
          this.setEnglishDate(e);
        } else if (e instanceof NepaliDate) {
          this.timestamp = e.timestamp;
          this.year = e.year;
          this.month = e.month;
          this.day = e.day;
        } else if (typeof e === 'number') {
          this.setEnglishDate(new Date(e));
        } else if (typeof e === 'string' && e.trim() !== '') {
          // Try to parse the date
          try {
            var parsedDate = _parse(e);
            if (parsedDate && parsedDate.length >= 3) {
              this.set.apply(this, _toConsumableArray(parsedDate));
            } else {
              this.setEnglishDate(new Date());
            }
          } catch (err) {
            this.setEnglishDate(new Date());
          }
        } else {
          this.setEnglishDate(new Date());
        }
      } else {
        // Handle undefined/null case - set to current date
        this.setEnglishDate(new Date());
      }
    } else if (arguments.length === 3) {
      var year = arguments[0];
      var month = arguments[1];
      var day = arguments[2];
      
      // Check if all date components are valid numbers
      if (year != null && month != null && day != null && 
          !isNaN(year) && !isNaN(month) && !isNaN(day)) {
        this.set(year, month, day);
      } else {
        this.setEnglishDate(new Date());
      }
    } else {
      throw new Error('Invalid argument syntax');
    }
  }

  _createClass(NepaliDate, [{
    key: 'setEnglishDate',
    value: function setEnglishDate(date) {
      
    try{
      this.timestamp = date;
      var daysCount = Math.floor((this.timestamp - _config.EPOCH) / 86400000);
      // Look for a index based on number of days since epoch.
      // it is just to save some iterations searching from idx 0.
      // So dividing by a number slightly higher than number of days in a year (365.25)
      var idx = Math.floor(daysCount / 366);
      while (daysCount >= _config.NEPALI_DATE_MAP[idx][SUM_IDX]) {
        idx += 1;
      }

      daysCount -= _config.NEPALI_DATE_MAP[idx - 1][SUM_IDX];
      var tmp = _config.NEPALI_DATE_MAP[idx];

      // eslint-disable-next-line prefer-destructuring
      this.year = tmp[0];

      // Month starts at 0, check for remaining days left
      this.month = 0;
      while (daysCount >= tmp[this.month + 1]) {
        this.month += 1;
        daysCount -= tmp[this.month];
      }

      // The day of month is the remaining days + 1
      this.day = daysCount + 1;
    } catch (err) {
      console.log(err);
      this.setEnglishDate(new Date());
    }
  }}, {
    key: 'getEnglishDate',
    value: function getEnglishDate() {
      return this.timestamp;
    }
  }, {
    key: 'parse',
    value: function parse(dateString) {
      this.set.apply(this, _toConsumableArray(_parse(dateString)));
    }
  }, {
    key: 'getYear',
    value: function getYear() {
      return this.year;
    }
  }, {
    key: 'getMonth',
    value: function getMonth() {
      return this.month;
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      return this.day;
    }
  }, {
    key: 'getDay',
    value: function getDay() {
      return this.timestamp.getDay();
    }
  }, {
    key: 'getHours',
    value: function getHours() {
      return this.timestamp.getHours();
    }
  }, {
    key: 'getMinutes',
    value: function getMinutes() {
      return this.timestamp.getMinutes();
    }
  }, {
    key: 'getSeconds',
    value: function getSeconds() {
      return this.timestamp.getSeconds();
    }
  }, {
    key: 'getMilliseconds',
    value: function getMilliseconds() {
      return this.timestamp.getMilliseconds();
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      return this.timestamp.getTime();
    }
  }, {
    key: 'setYear',
    value: function setYear(year) {
      this.set(year, this.month, this.day);
    }
  }, {
    key: 'setMonth',
    value: function setMonth(month) {
      this.set(this.year, month, this.day);
    }
  }, {
    key: 'setDate',
    value: function setDate(day) {
      this.set(this.year, this.month, day);
    }
  }, {
    key: 'set',
    value: function set(year, month, date) {
      var idx = year + Math.floor(month / 12) - _config.START_YEAR;
      var tmp = _config.NEPALI_DATE_MAP[idx];
      var d = tmp[SUM_IDX] - tmp[SUM_IDX - 1];

      var m = month % 12;
      var mm = m < 0 ? 12 + m : m;

      for (var i = 0; i < mm; i += 1) {
        d += tmp[i + 1];
      }
      d += date - 1;
      this.setEnglishDate(new Date(_config.EPOCH + d * 86400000));
    }
  }, {
    key: 'format',
    value: function format(formatStr) {
      return (0, _format3.default)(this, formatStr);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.year + '/' + (this.month + 1) + '/' + this.day;
    }
  }]);

  return NepaliDate;
}();

NepaliDate.minimum = function () {
  return new Date(_config.EPOCH);
};
NepaliDate.maximum = function () {
  return new Date(_config.EPOCH + _config.NEPALI_DATE_MAP[_config.NEPALI_DATE_MAP.length - 1][SUM_IDX] * 86400000);
};

exports.default = NepaliDate;
