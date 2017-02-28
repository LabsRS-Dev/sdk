/*globals Sys, Ajax*/

/**
 *  CSS/JS/HTML加载器
 *  @created 2017-2-27 17:13:09
 */

import { webHelper } from './webHelper'
const RTYWebHelper = webHelper.RTYWebHelper

var uu$ = {}

// Creates a gloabl object called templateLoader with a single method "loadExtTemplate"
uu$.templateLoader = (function ($, host) {
  // Loads external templates from path and injects in to page DOM
  return {
    cache: [],
    // Method: loadExtTemplate
    // Params: (string) path: the relative path to a file that contains template definition(s)
    loadExtTemplate: function (path, next) {
      var t$ = this
      // Check Cache
      if ($.inArray(path, t$.cache) > -1) {
        return next && next()
      }

      // Use jQuery Ajax to fetch the template file
      var tmplLoader = $.get(path)
        .success(function (result) {
          if ($.inArray(path, t$.cache) === -1) {
            t$.cache.push(path)
            // On success, Add templates to DOM (assumes file only has template definitions)
            $('body').append(result)
          }
        })
        .error(function (result) {
          alert('Error Loading Templates -- TODO: Better Error Handling')
        })

      tmplLoader.complete(function () {
        // Publish an event that indicates when a template is done loading
        $(host).trigger('TEMPLATE_LOADED', [path])
        next && next()
      })
    }
  }
})(window.jQuery, document)

uu$.templateLoaderAgent = function (templateFileList, successCallBack) {
  var loadedList = []
  var list = templateFileList

  var t$ = this
  list.forEach(function (path, index, array) {
    t$.templateLoader.loadExtTemplate(path, function () {
      if (list.findIndex(function (value, index, err) {
        return value === path
      }) > -1) {
        loadedList.push(path)
        if (loadedList.length === list.length) {
          successCallBack && successCallBack()
        }
      }
    })
  })
}

// 动态加载JS或者CSS通用方式
uu$.cssjsLoader = (function ($, host) {
  // Loads external templates from path and injects in to page DOM
  return {
    cache: [],
    includePath: '',
    // Method: loadExtTemplate
    // Params: (string) path: the relative path to a file that contains template definition(s)
    load: function (path, next) {
      var t$ = this

      var files = typeof path === 'string' ? [path] : path

      for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s|\s$/g, '')
        var att = name.split('.')
        var ext = att[att.length - 1].toLowerCase()
        var isCSS = ext === 'css'
        var tag = isCSS ? 'link' : 'script'
        var attr = isCSS ? ' type=\'text/css\' rel=\'stylesheet\' ' : ' language=\'javascript\' type=\'text/javascript\' '
        var link = (isCSS ? 'href' : 'src') + '=\'' + t$.includePath + name + '\''
        if ($(tag + '[' + link + ']').length === 0) {
          if ($.inArray(path, t$.cache) === -1) {
            t$.cache.push(path)
            var content = '<' + tag + attr + link + '></' + tag + '>'
            isCSS ? $('head').append(content) : $('head').append(content)
          }
        }
      }
      next && next()
    }
  }
})(window.jQuery, document)

var userAgent = navigator.userAgent.toLowerCase()
var $du = {}
var HttpLibrary = $du.HttpLibrary = {
  browser: {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: RTYWebHelper.isSafari(),
    opera: RTYWebHelper.isOpera(),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
  },

  loadedUrls: {},

  isUrlLoaded: function (url) {
    return HttpLibrary.loadedUrls[url] === true
  },
  unregisterUrl: function (url) {
    HttpLibrary.loadedUrls[url] = false
  },
  registerUrl: function (url) {
    HttpLibrary.loadedUrls[url] = true
  },

  createScriptTag: function (url, success, error) {
    var scriptTag = document.createElement('script')
    scriptTag.setAttribute('id', 'dove-js-' + url.replace(/[\./]+/g, '-'))
    scriptTag.setAttribute('type', 'text/javascript')
    scriptTag.setAttribute('charset', 'utf-8')
    scriptTag.setAttribute('src', url)

    scriptTag.onload = scriptTag.onreadystatechange = function () {
      if ((!this.readyState ||
          this.readyState === 'loaded' || this.readyState === 'complete')) {
        success()
      }
    }
    scriptTag.onerror = function () {
      error && error(url, url + ' failed to load')
    }

    var toBody = true
    if (!toBody) {
      var head = HttpLibrary.getHead()
      head.appendChild(scriptTag)
    } else {
      var body = HttpLibrary.getBody()
      body.appendChild(scriptTag)
    }
  },
  getHead: function () {
    return document.getElementsByTagName('head')[0] || document.documentElement
  },
  getBody: function () {
    return document.body
  },
  globalEval: function (data, url, into) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'dove-js-' + url.replace(/[\./]+/g, '-')
    script.charset = 'UTF-8'
    if (HttpLibrary.browser.msie) {
      script.text = data
    } else {
      script.appendChild(document.createTextNode(data))
    }

    into = into || 'head'
    if (into === 'head') {
      var head = HttpLibrary.getHead()
      head.appendChild(script)
    } else {
      var body = HttpLibrary.getBody()
      body.appendChild(script)
    }
  },
  loadJavascript_jQuery: function (data) {
    if (HttpLibrary.browser.safari) {
      return window.jQuery.ajax({
        type: 'GET',
        url: data.url,
        data: null,
        success: function (content) {
          HttpLibrary.globalEval(content, data.url, 'body')
          data.success()
        },
        error: function (xml, status, e) {
          if (xml && xml.responseText) {
            data.error(xml.responseText)
          } else {
            data.error(data.url + '\n' + e.message)
          }
        },
        dataType: 'html'
      })
    } else {
      HttpLibrary.createScriptTag(data.url, data.success, data.error)
    }
  },
  loadJavascript_MSAJAX: function (data) {
    if (HttpLibrary.browser.safari) {
      var params = {
        url: data.url,
        success: function (content) {
          HttpLibrary.globalEval(content)
          data.success(content)
        },
        error: data.error
      }
      HttpLibrary.httpGet_MSAJAX(params)
    } else {
      HttpLibrary.createScriptTag(data.url, data.success, data.error)
    }
  },
  loadJavascript_Prototype: function (data) {
    if (HttpLibrary.browser.safari) {
      var params = {
        url: data.url,
        success: function (content) {
          HttpLibrary.globalEval(content)
          data.success(content)
        },
        error: data.error
      }
      HttpLibrary.httpGet_Prototype(params)
    } else {
      HttpLibrary.createScriptTag(data.url, data.success, data.error)
    }
  },
  httpGet_jQuery: function (data) {
    return window.jQuery.ajax({
      type: 'GET',
      url: data.url,
      data: null,
      success: data.success,
      error: function (xml, status, e) {
        if (xml && xml.responseText) {
          data.error(xml.responseText)
        } else {
          data.error('Error occured while loading: ' + data.url + '\n' + e.message)
        }
      },
      dataType: data.type || 'html'
    })
  },
  httpGet_MSAJAX: function (data) {
    var _wRequest = new Sys.Net.WebRequest()
    _wRequest.set_url(data.url)
    _wRequest.set_httpVerb('GET')
    _wRequest.add_completed(function (result) {
      var errorMsg = 'Failed to load:' + data.url
      if (result.get_timedOut()) {
        errorMsg = 'Timed out'
      }
      if (result.get_aborted()) {
        errorMsg = 'Aborted'
      }

      if (result.get_responseAvailable()) data.success(result.get_responseData())
      else data.error(errorMsg)
    })

    var executor = new Sys.Net.XMLHttpExecutor()
    _wRequest.set_executor(executor)
    executor.executeRequest()
  },
  httpGet_Prototype: function (data) {
    new Ajax.Request(data.url, {
      method: 'get',
      evalJS: false, // Make sure prototype does not automatically evan scripts
      onSuccess: function (transport, json) {
        data.success(transport.responseText || '')
      },
      onFailure: data.error
    })
  }
}
$du.EnsureExecutor = function (data, callback, failCall, scope) {
  this.data = this.clone(data)
  this.callback = (typeof scope === 'undefined' || scope === null ? callback : this.delegate(callback, scope))
  this.failCall = (typeof scope === 'undefined' || scope === null ? failCall : this.delegate(failCall, scope))
  this.loadStack = []

  if (data.js && data.js.constructor !== Array) this.data.js = [data.js]
  if (data.html && data.html.constructor !== Array) this.data.html = [data.html]
  if (data.css && data.css.constructor !== Array) this.data.css = [data.css]

  if (typeof data.js === 'undefined') this.data.js = []
  if (typeof data.html === 'undefined') this.data.html = []
  if (typeof data.css === 'undefined') this.data.css = []

  this.init()
  this.load()
}
$du.EnsureExecutor.prototype = {
  init: function () {
    // Fetch Javascript using Framework specific library
    if (typeof jQuery !== 'undefined') {
      this.getJS = HttpLibrary.loadJavascript_jQuery
      this.httpGet = HttpLibrary.httpGet_jQuery
    } else if (typeof Prototype !== 'undefined') {
      this.getJS = HttpLibrary.loadJavascript_Prototype
      this.httpGet = HttpLibrary.httpGet_Prototype
    } else if (typeof Sys !== 'undefined') {
      this.getJS = HttpLibrary.loadJavascript_MSAJAX
      this.httpGet = HttpLibrary.httpGet_MSAJAX
    } else {
      throw new Error('jQuery, Prototype or MS AJAX framework not found')
    }
  },
  getJS: function (data) {
    // abstract function to get Javascript and execute it
  },
  httpGet: function (url, callback) {
    // abstract function to make HTTP GET call
  },
  load: function () {
    var fnc_fail = function (urlList) {
      this.failcall && this.failcall(urlList)
    }

    this.loadJavascripts(
      this.delegate(function () {
        this.loadCSS(this.delegate(function () {
          this.loadHtml(this.delegate(function () {
            this.callback && this.callback()
          }), this.delegate(fnc_fail))
        }), this.delegate(fnc_fail))
      }), this.delegate(fnc_fail))
  },
  loadJavascripts: function (complete, fail) {
    var scriptsToLoad = this.data.js.length
    if (scriptsToLoad === 0) return complete()

    var hasError = false
    var hasErrorJsList = []
    this.forEach(this.data.js, function (href) {
      if (HttpLibrary.isUrlLoaded(href) || this.isTagLoaded('script', 'src', href)) {
        scriptsToLoad--
      } else {
        this.getJS({
          url: href,
          success: this.delegate(function (content) {
            scriptsToLoad--
            HttpLibrary.registerUrl(href)
          }),
          error: this.delegate(function (msg) {
            scriptsToLoad--
            if (typeof this.data.error === 'function') {
              this.data.error(href, msg)
            }

            console.log('[Error] loadJavascripts: ' + href + ' \t[Meesage]: ' + msg)
            hasErrorJsList.push(href)
            hasError = true
          })
        })
      }
    })

    // wait until all the external scripts are downloaded
    this.until({
      test: function () {
        return scriptsToLoad === 0
      },
      delay: 50,
      callback: this.delegate(function () {
        if (hasError) {
          fail && fail(hasErrorJsList)
        } else {
          complete && complete()
        }
      })
    })
  },
  loadCSS: function (complete, fail) {
    if (this.data.css.length === 0) return complete()

    var hasError = false
    var hasErrorCSSList = []

    var head = HttpLibrary.getHead()
    this.forEach(this.data.css, function (href) {
      if (HttpLibrary.isUrlLoaded(href) || this.isTagLoaded('link', 'href', href)) {
        // Do nothing
      } else {
        var self = this
        try {
          (function (href, head) {
            var link = document.createElement('link')
            link.setAttribute('href', href)
            link.setAttribute('rel', 'Stylesheet')
            link.setAttribute('type', 'text/css')
            head.appendChild(link)

            HttpLibrary.registerUrl(href)
          }).apply(window, [href, head])
        } catch (e) {
          if (typeof self.data.error === 'function') {
            self.data.error(href, e.message)
            console.log('[Error] loadCSS: ' + href + ' \t[Meesage]: ' + e.message)
          }
          hasErrorCSSList.push(href)
          hasError = true
        }
      }
    })

    if (!hasError) {
      complete && complete()
    } else {
      fail && fail(hasErrorCSSList)
    }
  },
  loadHtml: function (complete, fail) {
    var htmlToDownload = this.data.html.length
    if (htmlToDownload === 0) return complete()

    var hasError = false
    var hasErrorHtmlList = []
    this.forEach(this.data.html, function (href) {
      if (HttpLibrary.isUrlLoaded(href)) {
        htmlToDownload--
      } else {
        this.httpGet({
          url: href,
          success: this.delegate(function (content) {
            htmlToDownload--
            HttpLibrary.registerUrl(href)

            var parent = (this.data.parent || document.body.appendChild(document.createElement('div')))
            if (typeof parent === 'string') parent = document.getElementById(parent)
            parent.innerHTML = content
          }),
          error: this.delegate(function (msg) {
            htmlToDownload--
            if (typeof this.data.error === 'function') this.data.error(href, msg)

            console.log('[Error] loadHtml: ' + href + ' \t[Meesage]: ' + msg)
            hasErrorHtmlList.push(href)
            hasError = true
          })
        })
      }
    })

    // wait until all the external scripts are downloaded
    this.until({
      test: function () {
        return htmlToDownload === 0
      },
      delay: 50,
      callback: this.delegate(function () {
        if (hasError) {
          fail && fail(hasErrorHtmlList)
        } else {
          complete && complete()
        }
      })
    })
  },
  clone: function (obj) {
    var cloned = {}
    for (var p in obj) {
      var x = obj[p]

      if (typeof x === 'object') {
        if (x.constructor === Array) {
          var a = []
          for (var i = 0; i < x.length; i++) a.push(x[i])
          cloned[p] = a
        } else {
          cloned[p] = this.clone(x)
        }
      } else {
        cloned[p] = x
      }
    }

    return cloned
  },
  forEach: function (arr, callback) {
    var self = this
    for (var i = 0; i < arr.length; i++) {
      callback.apply(self, [arr[i]])
    }
  },
  delegate: function (func, obj) {
    var context = obj || this
    return function () {
      func.apply(context, arguments)
    }
  },
  until: function (o) {
    if (o.test() === true) {
      o.callback()
    } else {
      window.setTimeout(this.delegate(function () {
        this.until(o)
      }), o.delay || 50)
    }
  },
  isTagLoaded: function (tagName, attName, value) {
    // Create a temporary tag to see what value browser eventually
    // gives to the attribute after doing necessary encoding
    var tag = document.createElement(tagName)
    tag[attName] = value
    var tagFound = false
    var tags = document.getElementsByTagName(tagName)
    this.forEach(tags, function (t) {
      if (tag[attName] === t[attName]) {
        tagFound = true
        return false
      }
    })
    return tagFound
  }
}
$du.ensure = function (data, callback, failCall, scope) {
  if (typeof jQuery === 'undefined' && typeof Sys === 'undefined' && typeof Prototype === 'undefined') {
    return alert('jQuery, Microsoft ASP.NET AJAX or Prototype library not found. One must be present for ensure to work')
  }

  // There's a test criteria which when false, the associated components must be loaded. But if true,
  // no need to load the components
  if (typeof data.test !== 'undefined') {
    var test = function () {
      return data.test
    }

    if (typeof data.test === 'string') {
      test = function () {
        // If there's no such Javascript variable and there's no such DOM element with ID then
        // the test fails. If any exists, then test succeeds
        return !(window.eval('typeof ' + data.test) === 'undefined' &&
          document.getElementById(data.test) == null)
      }
    } else if (typeof data.test === 'function') {
      test = data.test
    }

    // Now we have test prepared, time to execute the test and see if it returns null, undefined or false in any
    // scenario. If it does, then load the specified javascript/html/css
    if (test() === false || typeof test() === 'undefined' || test() == null) {
      new $du.EnsureExecutor(data, callback, failCall, scope)
    } else {
      // Test succeeded! Just fire the callback
      callback()
    }
  } else {
    // No test specified. So, load necessary javascript/html/css and execute the callback
    new $du.EnsureExecutor(data, callback, failCall, scope)
  }
}

uu$['RTY_3rd_Ensure'] = $du

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */
function autoForJquery (ref) {
  var t$ = ref
  if (window.jQuery && window.$) {
    window.$.templateLoader = t$.templateLoader
    window.$.templateLoaderAgent = t$.templateLoaderAgent
    window.$.cssjsLoader = t$.cssjsLoader

    window.$['RTY_3rd_Ensure'] = t$['RTY_3rd_Ensure']

    window.$ = window.$.extend(window.$, t$)
  }
}

const loaderWrapper = uu$
autoForJquery(uu$)

export {
  loaderWrapper
}
