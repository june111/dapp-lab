export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

import { BigNumber } from 'bignumber.js';

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param {Object}
 * @return {Boolean}
 */
var isBigNumber = function(object) {
  return object instanceof BigNumber ||
    (object && object.constructor && object.constructor.name === 'BigNumber');
};
/**
 * Returns true if object is string, otherwise false
 *
 * @method isString
 * @param {Object}
 * @return {Boolean}
 */
var isString = function(object) {
  return typeof object === 'string' ||
    (object && object.constructor && object.constructor.name === 'String');
};

var toBigNumber = function(number) {
  /*jshint maxcomplexity:5 */
  number = number || 0;
  if (isBigNumber(number))
    return number;

  if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
    return new BigNumber(number.replace('0x', ''), 16);
  }

  return new BigNumber(number.toString(10), 10);
};

export function toNum(val) {
  // let x = new BigNumber(val)
  // x = x.toNumber()
  let x = toBigNumber(val).toNumber()
  return x
}

// 高亮json
export function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

// 16进制转字符串
export function hex2str(hex) {
  var trimedStr = hex.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return character(resultStr.join(""));
}

// 清除空白字符
function character(str) {
    return str.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f|\u007F/g, "");
}

// 生成指定长度随机字符串可封装成方法
export function random(length) {
    var str = Math.random().toString(36).substr(2);
    if (str.length>=length) {
        return str.substr(0, length);
    }
    str += random(length-str.length);
    return str;
}