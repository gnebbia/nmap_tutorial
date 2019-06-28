/**
 The MIT License

 Copyright (c) 2010 Daniel Park (http://metaweb.com, http://postmessage.freebaseapps.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 **/
var NO_JQUERY = {};
(function(window, $, undefined) {

     if (!("console" in window)) {
         var c = window.console = {};
         c.log = c.warn = c.error = c.debug = function(){};
     }

     if ($ === NO_JQUERY) {
         // jQuery is optional
         $ = {
             fn: {},
             extend: function() {
                 var a = arguments[0];
                 for (var i=1,len=arguments.length; i<len; i++) {
                     var b = arguments[i];
                     for (var prop in b) {
                         a[prop] = b[prop];
                     }
                 }
                 return a;
             }
         };
     }

     $.fn.pm = function() {
         console.log("usage: \nto send:    $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");
         return this;
     };

     // send postmessage
     $.pm = window.pm = function(options) {
         pm.send(options);
     };

     // bind postmessage handler
     $.pm.bind = window.pm.bind = function(type, fn, origin, hash, async_reply) {
         pm.bind(type, fn, origin, hash, async_reply === true);
     };

     // unbind postmessage handler
     $.pm.unbind = window.pm.unbind = function(type, fn) {
         pm.unbind(type, fn);
     };

     // default postmessage origin on bind
     $.pm.origin = window.pm.origin = null;

     // default postmessage polling if using location hash to pass postmessages
     $.pm.poll = window.pm.poll = 200;

     var pm = {

         send: function(options) {
             var o = $.extend({}, pm.defaults, options),
             target = o.target;
             if (!o.target) {
                 console.warn("postmessage target window required");
                 return;
             }
             if (!o.type) {
                 console.warn("postmessage type required");
                 return;
             }
             var msg = {data:o.data, type:o.type};
             if (o.success) {
                 msg.callback = pm._callback(o.success);
             }
             if (o.error) {
                 msg.errback = pm._callback(o.error);
             }
             if (("postMessage" in target) && !o.hash) {
                 pm._bind();
                 target.postMessage(JSON.stringify(msg), o.origin || '*');
             }
             else {
                 pm.hash._bind();
                 pm.hash.send(o, msg);
             }
         },

         bind: function(type, fn, origin, hash, async_reply) {
           pm._replyBind ( type, fn, origin, hash, async_reply );
         },

         _replyBind: function(type, fn, origin, hash, isCallback) {
           if (("postMessage" in window) && !hash) {
               pm._bind();
           }
           else {
               pm.hash._bind();
           }
           var l = pm.data("listeners.postmessage");
           if (!l) {
               l = {};
               pm.data("listeners.postmessage", l);
           }
           var fns = l[type];
           if (!fns) {
               fns = [];
               l[type] = fns;
           }
           fns.push({fn:fn, callback: isCallback, origin:origin || $.pm.origin});
         },

         unbind: function(type, fn) {
             var l = pm.data("listeners.postmessage");
             if (l) {
                 if (type) {
                     if (fn) {
                         // remove specific listener
                         var fns = l[type];
                         if (fns) {
                             var m = [];
                             for (var i=0,len=fns.length; i<len; i++) {
                                 var o = fns[i];
                                 if (o.fn !== fn) {
                                     m.push(o);
                                 }
                             }
                             l[type] = m;
                         }
                     }
                     else {
                         // remove all listeners by type
                         delete l[type];
                     }
                 }
                 else {
                     // unbind all listeners of all type
                     for (var i in l) {
                       delete l[i];
                     }
                 }
             }
         },

         data: function(k, v) {
             if (v === undefined) {
                 return pm._data[k];
             }
             pm._data[k] = v;
             return v;
         },

         _data: {},

         _CHARS: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),

         _random: function() {
             var r = [];
             for (var i=0; i<32; i++) {
                 r[i] = pm._CHARS[0 | Math.random() * 32];
             };
             return r.join("");
         },

         _callback: function(fn) {
             var cbs = pm.data("callbacks.postmessage");
             if (!cbs) {
                 cbs = {};
                 pm.data("callbacks.postmessage", cbs);
             }
             var r = pm._random();
             cbs[r] = fn;
             return r;
         },

         _bind: function() {
             // are we already listening to message events on this w?
             if (!pm.data("listening.postmessage")) {
                 if (window.addEventListener) {
                     window.addEventListener("message", pm._dispatch, false);
                 }
                 else if (window.attachEvent) {
                     window.attachEvent("onmessage", pm._dispatch);
                 }
                 pm.data("listening.postmessage", 1);
             }
         },

         _dispatch: function(e) {
             //console.log("$.pm.dispatch", e, this);
             try {
                 var msg = JSON.parse(e.data);
             }
             catch (ex) {
                 //console.warn("postmessage data invalid json: ", ex); //message wasn't meant for pm
                 return;
             }
             if (!msg.type) {
                 //console.warn("postmessage message type required"); //message wasn't meant for pm
                 return;
             }
             var cbs = pm.data("callbacks.postmessage") || {},
             cb = cbs[msg.type];
             if (cb) {
                 cb(msg.data);
             }
             else {
                 var l = pm.data("listeners.postmessage") || {};
                 var fns = l[msg.type] || [];
                 for (var i=0,len=fns.length; i<len; i++) {
                     var o = fns[i];
                     if (o.origin && o.origin !== '*' && e.origin !== o.origin) {
                         console.warn("postmessage message origin mismatch", e.origin, o.origin);
                         if (msg.errback) {
                             // notify post message errback
                             var error = {
                                 message: "postmessage origin mismatch",
                                 origin: [e.origin, o.origin]
                             };
                             pm.send({target:e.source, data:error, type:msg.errback});
                         }
                         continue;
                     }

                     function sendReply ( data ) {
                       if (msg.callback) {
                           pm.send({target:e.source, data:data, type:msg.callback});
                       }
                     }

                     try {
                         if ( o.callback ) {
                           o.fn(msg.data, sendReply, e);
                         } else {
                           sendReply ( o.fn(msg.data, e) );
                         }
                     }
                     catch (ex) {
                         if (msg.errback) {
                             // notify post message errback
                             pm.send({target:e.source, data:ex, type:msg.errback});
                         } else {
                             throw ex;
                         }
                     }
                 };
             }
         }
     };

     // location hash polling
     pm.hash = {

         send: function(options, msg) {
             //console.log("hash.send", target_window, options, msg);
             var target_window = options.target,
             target_url = options.url;
             if (!target_url) {
                 console.warn("postmessage target window url is required");
                 return;
             }
             target_url = pm.hash._url(target_url);
             var source_window,
             source_url = pm.hash._url(window.location.href);
             if (window == target_window.parent) {
                 source_window = "parent";
             }
             else {
                 try {
                     for (var i=0,len=parent.frames.length; i<len; i++) {
                         var f = parent.frames[i];
                         if (f == window) {
                             source_window = i;
                             break;
                         }
                     };
                 }
                 catch(ex) {
                     // Opera: security error trying to access parent.frames x-origin
                     // juse use window.name
                     source_window = window.name;
                 }
             }
             if (source_window == null) {
                 console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list");
                 return;
             }
             var hashmessage = {
                 "x-requested-with": "postmessage",
                 source: {
                     name: source_window,
                     url: source_url
                 },
                 postmessage: msg
             };
             var hash_id = "#x-postmessage-id=" + pm._random();
             target_window.location = target_url + hash_id + encodeURIComponent(JSON.stringify(hashmessage));
         },

         _regex: /^\#x\-postmessage\-id\=(\w{32})/,

         _regex_len: "#x-postmessage-id=".length + 32,

         _bind: function() {
             // are we already listening to message events on this w?
             if (!pm.data("polling.postmessage")) {
                 setInterval(function() {
                                 var hash = "" + window.location.hash,
                                 m = pm.hash._regex.exec(hash);
                                 if (m) {
                                     var id = m[1];
                                     if (pm.hash._last !== id) {
                                         pm.hash._last = id;
                                         pm.hash._dispatch(hash.substring(pm.hash._regex_len));
                                     }
                                 }
                             }, $.pm.poll || 200);
                 pm.data("polling.postmessage", 1);
             }
         },

         _dispatch: function(hash) {
             if (!hash) {
                 return;
             }
             try {
                 hash = JSON.parse(decodeURIComponent(hash));
                 if (!(hash['x-requested-with'] === 'postmessage' &&
                       hash.source && hash.source.name != null && hash.source.url && hash.postmessage)) {
                     // ignore since hash could've come from somewhere else
                     return;
                 }
             }
             catch (ex) {
                 // ignore since hash could've come from somewhere else
                 return;
             }
             var msg = hash.postmessage,
             cbs = pm.data("callbacks.postmessage") || {},
             cb = cbs[msg.type];
             if (cb) {
                 cb(msg.data);
             }
             else {
                 var source_window;
                 if (hash.source.name === "parent") {
                     source_window = window.parent;
                 }
                 else {
                     source_window = window.frames[hash.source.name];
                 }
                 var l = pm.data("listeners.postmessage") || {};
                 var fns = l[msg.type] || [];
                 for (var i=0,len=fns.length; i<len; i++) {
                     var o = fns[i];
                     if (o.origin) {
                         var origin = /https?\:\/\/[^\/]*/.exec(hash.source.url)[0];
                         if (o.origin !== '*' && origin !== o.origin) {
                             console.warn("postmessage message origin mismatch", origin, o.origin);
                             if (msg.errback) {
                                 // notify post message errback
                                 var error = {
                                     message: "postmessage origin mismatch",
                                     origin: [origin, o.origin]
                                 };
                                 pm.send({target:source_window, data:error, type:msg.errback, hash:true, url:hash.source.url});
                             }
                             continue;
                         }
                     }

                     function sendReply ( data ) {
                       if (msg.callback) {
                         pm.send({target:source_window, data:data, type:msg.callback, hash:true, url:hash.source.url});
                       }
                     }

                     try {
                         if ( o.callback ) {
                           o.fn(msg.data, sendReply);
                         } else {
                           sendReply ( o.fn(msg.data) );
                         }
                     }
                     catch (ex) {
                         if (msg.errback) {
                             // notify post message errback
                             pm.send({target:source_window, data:ex, type:msg.errback, hash:true, url:hash.source.url});
                         } else {
                             throw ex;
                         }
                     }
                 };
             }
         },

         _url: function(url) {
             // url minus hash part
             return (""+url).replace(/#.*$/, "");
         }

     };

     $.extend(pm, {
                  defaults: {
                      target: null,  /* target window (required) */
                      url: null,     /* target window url (required if no window.postMessage or hash == true) */
                      type: null,    /* message type (required) */
                      data: null,    /* message data (required) */
                      success: null, /* success callback (optional) */
                      error: null,   /* error callback (optional) */
                      origin: "*",   /* postmessage origin (optional) */
                      hash: false    /* use location hash for message passing (optional) */
                  }
              });

 })(this, typeof jQuery === "undefined" ? NO_JQUERY : jQuery);

/**
 * http://www.JSON.org/json2.js
 **/
if (! ("JSON" in window && window.JSON)){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());
;
/*
jed.js
v0.5.0beta

https://github.com/SlexAxton/Jed
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton
WTFPL license for use
Dojo CLA for contributions

Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages"
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      // Default the value to the singular case
      val = typeof val == 'undefined' ? 1 : val;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      // Handle invalid numbers, but try casting strings for good measure
      if ( typeof val != 'number' ) {
        val = parseInt( val, 10 );

        if ( isNaN( val ) ) {
          throw new Error('The number that was passed in is not a number.');
        }
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          pluralForms = dict[""].plural_forms || (locale_data.messages || this.defaults.locale_data.messages)[""].plural_forms,
          val_idx = getPluralFormFunc(pluralForms)(val) + 1,
          val_list,
          res;

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx >= val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key);
        }
        res = [ null, singular_key, plural_key ];
        return res[ getPluralFormFunc(pluralForms)( val ) + 1 ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ null, singular_key, plural_key ];
        return res[ getPluralFormFunc(pluralForms)( val ) + 1 ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      var res;
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] }; 
break;
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] }; 
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] }; 
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] }; 
break;
case 13:this.$ = { type: 'VAR' }; 
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) }; 
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define('jed', function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);
;
/*
 * WordPress REST Proxy Request
 * Name:   WPCOM_Proxy_Request
 * Author: Dan Walmsley <dan.walmsley@automattic.com>, Beau Collins <beaucollins@gmail.com>
 *
 * A function that makes proxy requests (using window.postMessage) to the
 * WordPress.com REST api (https://public-api.wordpress.com/rest/v1/help)
 *
 * Usage:
 * 	window.WPCOM_Proxy_Request( path );
 * 	window.WPCOM_Proxy_Request( path, request );
 * 	window.WPCOM_Proxy_Request( request );
 *
 * Arguments:
 * 	path     : the REST URL path to request (will be appended to the rest base URL)
 * 	request  : request parameters: method (string), path (string), query (object), body (object)
 *
 * Returns
 * 	A promise()-like object whose callbacks accept the following arguments:
 * 		response : the JSON response for your request
 * 		statusCode : the HTTP statusCode for your request
 *
 * Example:
 * 	// For simple GET requests
 * 	window.WPCOM_Proxy_Request( '/me' ).done( function( response, statusCode ){
 * 		/// ...
 * 	} );
 *
 * 	// More Advanced GET request
 * 	window.WPCOM_Proxy_Request( {
 * 		path: '/sites/en.blog.wordpress.com/posts',
 * 		query: { number: 100 }
 * 	} );
 *
 * 	// POST request
 * 	window.WPCOM_Proxy_Request( {
 * 		method: 'POST',
 * 		path: '/sites/en.blog.wordpress.com/posts/9776/replies/new',
 * 		body: { content: 'This is a comment' }
 * 	} );
 */
(function(){
	// don't run this more than once per context
	if ( window.WPCOM_Proxy_Request) {
		return;
	}

	// polyfill for jQuery Deferred
	var Deferred = function() {
		this._done = [];
		this._fail = [];
	};

	Deferred.prototype = {
		execute: function(list, args){
			var i = list.length;

			// convert arguments to an array
			// so they can be sent to the
			// callbacks via the apply method
			args = Array.prototype.slice.call(args);

			while(i--) list[i].apply(null, args);
		},
		resolve: function(){
			this.execute(this._done, arguments);
		},
		reject: function(){
			this.execute(this._fail, arguments);
		},
		done: function(callback){
			this._done.push(callback);
			return this;
		},
		fail: function(callback){
			this._fail.push(callback);
			return this;
		},
		promise: function() {
			var x = {};
			x.done = this.done.bind( this );
			x.fail = this.fail.bind( this );
			return x;
		}
	};

	// polyfill for jQuery.extend
	var extend = function( out ) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i])
				continue;

			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key))
					out[key] = arguments[i][key];
			}
		}

		return out;
	}

	var proxy,
	origin         = window.location.protocol + '//' + window.location.hostname,
	proxyOrigin    = 'https://public-api.wordpress.com',

	ready          = false,
	supported      = true, // assume window.postMessage is supported
	usingPM        = false, // If we don't have window.postMessage, postmessage.js may be available
	structuredData = true, // supports passing of structured data

	bufferedOps    = [],   // store requests while we wait for the proxy iframe to initialize

	// Store `Deferred` objects for each pending request.
	deferreds      = {},

	// Store `this` context objects for each pending request, if given.
	callbackContexts = {},

	/**
	 * Firefox apparently doesn't like sending `File` instances cross-domain.
	 * It results in a "DataCloneError: The object could not be cloned." error.
	 * Apparently this is for "security purposes" but it's actually silly if that's
	 * the argument because we can just read the File manually into an ArrayBuffer
	 * and we can work around this "security restriction".
	 *
	 * See: https://bugzilla.mozilla.org/show_bug.cgi?id=722126#c8
	 */
	 hasFileSerializationBug = false,

	 // Can we pass structured data via postMessage or just strings?
	check = function( event ){
		structuredData = 'object' === typeof event.data;
		window.removeEventListener( 'message', check );
		buildProxy();
	},

	// Initialize the proxy iframe
	buildProxy = function() {
		// Start listening to messages
		if ( !usingPM ) {
			window.addEventListener( 'message', receive );
		} else {
			pm.bind( 'proxy', function( e ) { receive( e ); } );
		}

		proxy = document.createElement( 'iframe' );
		proxy.src = 'https://public-api.wordpress.com/wp-admin/rest-proxy/#' + origin;
		proxy.style.display = 'none';

		// Process any buffered API calls after the iframe proxy is ready
		proxy.addEventListener( 'load', function() {
			var request;
			ready = true;
			while ( request = bufferedOps.shift() ) {
				postRequest( request );
			}
		});

		var appendProxy = function() {
			document.body.appendChild( proxy );
		};

		// Bring it
		if (document.readyState === 'complete' || document.readyState !== 'loading') {
			appendProxy();
		} else {
			document.addEventListener('DOMContentLoaded', appendProxy);
		}
	},

	// Message event listener
	receive = function( e ){
		var data,
			deferred_id,
			deferred,
			context;

		if ( !usingPM ) {
			if ( e.origin !== proxyOrigin ) {
				return;
			}

			data = structuredData ? e.data : JSON.parse( e.data );
		} else {
			data = e;
		}

		if ( !data || !data.length ) {
			return;
		}

		deferred_id = data[ data.length - 1 ];

		if ( 'undefined' === typeof deferreds[deferred_id] ) {
			return;
		}

		deferred = deferreds[deferred_id];
		delete deferreds[deferred_id];

		context = callbackContexts[ deferred_id ];
		if ( context ) {
			// `resolveWith` takes args as an array.
			deferred.resolveWith.call( deferred, context, data.slice( 0, -1 ) );
			delete callbackContexts[ deferred_id ];
		} else {
			// `resolve` takes args as a list of parameters.
			deferred.resolve.apply( deferred, data.slice( 0, -1 ) );
		}
	},

	// Calls API
	perform = function() {
		var request = buildRequest.apply( null, arguments );

		postRequest( request );

		return deferreds[request.callback].promise();
	},

	// Buffers API request
	buffer = function() {
		var request = buildRequest.apply( null, arguments );

		bufferedOps.push( request );

		return deferreds[request.callback].promise();
	},

	// Submits the API request to the proxy iframe
	postRequest = function( request ) {
		var files = findFilesInRequest( request ),
	 		data = structuredData ? request : JSON.stringify( request );

		if ( hasFileSerializationBug && files.has_files ) {
			postAsArrayBuffer( request, files );
		} else {
			try {
				sendPostMessage( data );
			} catch( e ) {
				// were we trying to serialize a `File`?
				if ( files.has_files ) {

					// cache this check for the next API request
					hasFileSerializationBug = true;
					postAsArrayBuffer( request, files );
				} else {
					// not interested, rethrow
					throw e;
				}
			}
		}
	},

	sendPostMessage = function( data ) {
		if ( !usingPM ) {
			proxy.contentWindow.postMessage( data, proxyOrigin );
		} else if ( window.pm ) {
			pm( {
				data  : data,
				type  : 'proxy',
				target: proxy.contentWindow,
				url   : 'https://public-api.wordpress.com/wp-admin/rest-proxy/#' + origin,
				origin: proxyOrigin
			} );
		}
	},

	postAsArrayBuffer = function( request, files ) {
		if ( ! files.has_files )
			return;

		for(i=0; i<files.file_keys.length; ++i) {
			var reader = new FileReader(),
				key = request.formData[i][0],
				file = request.formData[i][1];

			reader.onload = function(e) {
				request.formData[i] = [ key, {
					fileContents: e.target.result,
					fileName : file.name,
					mimeType: file.type
				} ];

				var are_there_still_files = findFilesInRequest( request );
				if ( ! are_there_still_files.has_files ) {
					proxy.contentWindow.postMessage( request, proxyOrigin );
				}
			};

			reader.readAsArrayBuffer( file );
		}
	},

	findFilesInRequest = function( request ) {
		var files = {
			has_files : false,
			file_keys : []
		};

		if ( ! structuredData || ! request.formData || request.formData.length <= 0 )
			return files;

		for(i=0; i<request.formData.length; i++) {
			var arr = request.formData[i];
			var maybe_a_file = arr[1];
			if ( 'object' == typeof maybe_a_file && '[object File]' == Object.prototype.toString.call( maybe_a_file ) ) {
				files.has_files = true;
				files.file_keys.push( i );
			}
		}

		return files;
	},

	// Builds the postMessage request object
	buildRequest = function() {
		var args     = [].slice.call( arguments );
		    request  = args.pop(),
		    path     = args.pop(),
		    deferred = new Deferred(),
			deferred_id = Math.random();

		// @todo - remove this back-compat code
		if ( 'function' === typeof( request ) ) {
			deferred.done( request );
			request = path;
			path    = args.pop();
		}

		if ( 'string' === typeof( request ) ) {
			request = { path: request };
		}

		if ( path ) {
			request.path = path;
		}

		deferreds[deferred_id] = deferred;

		if ( request.context ) {
			callbackContexts[ deferred_id ] = request.context;
			// Trying to pass functions through `postMessage` is a bad time.
			request = extend( {}, request );
			delete request.context;
		}

		request.callback = deferred_id;
		request.supports_args = true; // supports receiving variable amount of arguments
		return request;
	};

	// Step 1: do we have postMessage? ( in IE8, typeof window.postMessage == 'object' )
	if ( [ 'function', 'object' ].indexOf( typeof window.postMessage ) >= 0 ) {
		// Step 2: Check if we can pass structured data or just strings
		window.addEventListener( 'message', check );
		window.postMessage( {}, origin );
	} else if ( window.pm ) {
		usingPM = true;
		// Step 2: We can always just used structured data.
		buildProxy();
	} else {
		supported = false;
	}

	window.WPCOM_Proxy_Request = function(){
		if ( !supported ) {
			throw( 'Browser does not support window.postMessage' );
		}

		if ( ready ) {
			// Make API request
			return perform.apply( null, arguments );
		} else {
			// Buffer API request
			return buffer.apply( null, arguments );
		}
	};

	window.WPCOM_Proxy_Rebuild = function() {
		if ( !ready )
			return;

		ready = false;
		proxy.parentNode.removeChild( proxy );

		buildProxy();
	};
})();
;
/*
*  - wpLikes wraps all the proxied REST calls
*/

var wpLikes;

/*!
	https://gist.github.com/marlun78/2701678
	Underscore.js templates as a standalone implementation.
	JavaScript micro-templating, similar to John Resig's implementation.
	Underscore templates documentation: http://documentcloud.github.com/underscore/#template
	Modifyed by marlun78
*/
(function () {

	'use strict';

	// By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	var settings = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};

	// When customizing `templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch = /.^/;

	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes = {
		'\\': '\\',
		"'": "'",
		'r': '\r',
		'n': '\n',
		't': '\t',
		'u2028': '\u2028',
		'u2029': '\u2029'
	};

	for (var p in escapes) {
		escapes[escapes[p]] = p;
	}

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

	var tmpl = function (text, data, objectName) {
		settings.variable = objectName;

		// Compile the template source, taking care to escape characters that
		// cannot be included in a string literal and then unescape them in code
		// blocks.
		var source = "__p+='" + text
			.replace(escaper, function (match) {
				return '\\' + escapes[match];
			})
			.replace(settings.escape || noMatch, function (match, code) {
				return "'+\nwindow.escapeHTML(" + unescape(code) + ")+\n'";
			})
			.replace(settings.interpolate || noMatch, function (match, code) {
				return "'+\n(" + unescape(code) + ")+\n'";
			})
			.replace(settings.evaluate || noMatch, function (match, code) {
				return "';\n" + unescape(code) + "\n;__p+='";
			}) + "';\n";

		// If a variable is not specified, place data values in local scope.
		if (!settings.variable) {
			source = 'with(obj||{}){\n' + source + '}\n';
		}

		source = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";

		var render = new Function(settings.variable || 'obj', source);

		if (data) {
			return render(data);
		}

		var template = function (data) {
			return render.call(this, data);
		};

		// Provide the compiled function source as a convenience for build time
		// precompilation.
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;
	};

	window.tmpl = tmpl;

}());

/**
 * Escape function brought in from Underscore.js
 */

(function(){
	var escapeMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&#x60;'
	};

	var createEscaper = function(map) {
		var escaper = function(match) {
		  return map[match];
		};

		var source = '(?:' + Object.keys(map).join('|') + ')';
		var testRegexp = RegExp(source);
		var replaceRegexp = RegExp(source, 'g');
		return function(string) {
			string = string == null ? '' : '' + string;
			return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
		};
	};

	window.escapeHTML = createEscaper(escapeMap);
}());

( function( $ ) {

	var extWin;

	wpLikes = {
		version:          '',
		lang:             'en',

		jsonAPIbase:      'https://public-api.wordpress.com/rest/v1',
		hasUpgradedProxy: false,
		isLoggedIn:       false,
		queue:            [],
		masterReady:      false,
		requests:         {},
		me:               false,
		askedMe:          false,
		cache:            [],
		batchFinished:    false,
		batchWaiting:     [],
		adminBarEnabled:  false,
		reblogsEnabled:   false,

		widgetDims:       {},

		login_blog_id:    false,
		login_post_id:    false,
		login_comment_id: false,
		login_obj_id:     false,
		login_domain:     false,

		textStyles:       {},
		linkStyles:       {},
		adminBarStyles:   {},

		likers:           [],
		total:            [],

		wpLikes: function() {
			var info = wpLikes.splitParams( location.hash.replace( /^#/, '' ) );
			if ( 'ver' in info ) {
				wpLikes.version = info.ver;
			}
		},

		resizeFrame: function( name ) {
			var likeBox = window.parent.frames[name].document.querySelector( '.wpl-likebox' );
			var slim = this.hasClass( 'wpl-slim-likebox', likeBox );

			// Make sure slim likeboxes are actually inline-block - always
			if ( slim ) {
				var cssDisplay = likeBox.style.display;
				if ( 'inline-block' !== cssDisplay  ) {
					likeBox.style.display = 'inline-block';
				}
			}

			var likeboxHeight = this.outerHeight( likeBox );
			var likeboxWidth = this.outerWidth( likeBox );

			wpLikes.postMessage( {
				action: 'resize',
				name: name,
				height: likeboxHeight,
				width: likeboxWidth
			}, parent, 'resizeMessage' );
		},

		likePost: function( blog_id, post_id, source, success, fail ) {
			return this.ajax({
				type:    'POST',
				path:    '/sites/' + blog_id + '/posts/' + post_id + '/likes/new',
				query:   'source=' + source,
				success: success,
				error:   fail
			});
		},

		unlikePost: function( blog_id, post_id, success, fail ) {
			return this.ajax({
				type:    'POST',
				path:    '/sites/' + blog_id + '/posts/' + post_id + '/likes/mine/delete',
				success: success,
				error:   fail
			});
		},

		likeComment: function( blog_id, comment_id, success, fail ) {
			if ( wpLikes.commentLikesKillSwitch ) {
				return;
			}
			return this.ajax({
				type:    'POST',
				path:    '/sites/' + blog_id + '/comments/' + comment_id + '/likes/new',
				success: success,
				error:   fail
			});
		},

		unlikeComment: function( blog_id, comment_id, success, fail ) {
			if ( wpLikes.commentLikesKillSwitch ) {
				return;
			}
			return this.ajax({
				type:    'POST',
				path:    '/sites/' + blog_id + '/comments/' + comment_id + '/likes/mine/delete',
				success: success,
				error:   fail
			});
		},

		afterlikeFollow: function( blog_id, success, fail ) {
			return this.ajax({
				type:    'POST',
				path:    '/sites/' + blog_id + '/follows/new',
				success: success,
				error:   fail
			});
		},

		getFollowingStatus: function( blog_id, success, fail ) {
			return this.ajax({
				type:    'GET',
				path:    '/sites/' + blog_id + '/follows/mine',
				success: success,
				error:   fail
			});
		},

		getPost: function( blog_id, post_id, success, fail ) {
			return this.ajax( {
				type:    'GET',
				path:    '/sites/' + blog_id + '/posts/' + post_id,
				success: success,
				error:   fail
			});
		},

		getPostLikeStatus: function( blog_id, post_id, success, fail ) {
			return this.ajax({
				type:    'GET',
				path:    '/sites/' + blog_id + '/posts/' + post_id + '/likes/mine',
				success: success,
				error:   fail
			});
		},

		getPostLikes: function( blog_id, post_id, success, fail, fromCache ) {
			if ( 'undefined' === typeof fromCache ) {
				var info = wpLikes.splitParams( location.hash.replace( /^#/, '' ) );
				if ( 'ver' in info ) {
					wpLikes.version = info.ver;
				}
			}
			return this.ajax({
				type:    'GET',
				path:    '/sites/' + blog_id + '/posts/' + post_id + '/likes',
				success: success,
				error:   fail,
				fromCache: fromCache
			});
		},

		getCommentLikeStatus: function( blog_id, comment_id, success, fail ) {
			if ( wpLikes.commentLikesKillSwitch ) {
				return;
			}
			return this.ajax({
				type:    'GET',
				path:    '/sites/' + blog_id + '/comments/' + comment_id + '/likes/mine',
				success: success,
				error:   fail
			});
		},

		getCommentLikes: function( blog_id, comment_id, success, fail, fromCache ) {
			if ( wpLikes.commentLikesKillSwitch ) {
				return;
			}
			if ( 'undefined' === typeof fromCache ) {
				fromCache = true;
			}
			return this.ajax({
				type:    'GET',
				path:    '/sites/' + blog_id + '/comments/' + comment_id + '/likes',
				success: success,
				error:   fail,
				fromCache: fromCache
			});
		},

		getMyInfo: function( success, fail ) {
			if ( wpLikes.me ) {
				success( wpLikes.me, '/me' );
				return;
			}

			return this.ajax({
				type:    'GET',
				path:    '/me',
				success: success,
				error:   fail
			});
		},

		splitParams: function( queryString ) {
			var params = {};

			queryString.split( '&' ).forEach( function( value, i ) {
				var pair = value.split( '=' );
				params[pair[0]] = decodeURIComponent( pair[1] );
			} );

			return params;
		},

		/**
		 * [ajax description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		ajax: function( options ) {
			var request = {
				path:   options.path,
				method: options.type,
				url:    wpLikes.jsonAPIbase + options.path
			};

			if ( ! wpLikes.batchFinished && '/batch' !== options.path ) {
				wpLikes.batchWaiting.push( options );
				return;
			}

			if ( 'undefined' === typeof options.fromCache ) {
				options.fromCache = true;
			}

			if ( options.path in wpLikes.cache && options.fromCache ) {
				'function' === typeof options.success && options.success( wpLikes.cache[ options.path ], options.path );
				return;
			}

			if ( options.type.toLowerCase() === 'post' ) {
				request.body = options.data;
				request.query = options.query;
			} else {
				request.query = options.data;
			}

			var makeProxyCall = function() {
				return window.WPCOM_Proxy_Request( request, function( response, statusCode ) {
					if ( 200 === statusCode ) {
						'function' === typeof options.success && options.success( response, request.path );
					} else {
						'function' === typeof options.error && options.error( statusCode, request.path );
					}
				} );
			};

			if ( wpLikes.hasUpgradedProxy ) {
				return makeProxyCall();
			} else {
				return window.WPCOM_Proxy_Request( { metaAPI: { accessAllUsersBlogs: true } } ).done( function() {
					wpLikes.hasUpgradedProxy = true;
					makeProxyCall();
				} );
			}
		},

		/* postMessage */
		/* The messageType argument specifies the message type */
		/* Likes messages use likesMessage */
		/* An example of a message that doesn't use likesMessage is the resize request */
		postMessage: function( message, target, messageType ) {
			if ( 'string' === typeof message ){
				try{
					message = JSON.parse( message );
				}
				catch(e) {
					return;
				}
			}

			if ( 'undefined' === typeof messageType ) {
				messageType = 'likesMessage';
			}

			pm( { target: target,
				type: messageType,
				data: message
				} );
		},

		openLoginWindow: function() {
			// Remove any lingering login window from any previous aborted login
			if ( extWin ) {
				if ( ! extWin.closed ) {
					extWin.close();
				}
				extWin = false;
			}

			// Remove any lingering cookie polling iframe from any previous aborted login
			var loginIframe = document.querySelector( '#wp-login-polling-iframe' );

			if ( loginIframe ) {
				loginIframe.parentNode.removeChild( loginIframe );
			}

			// Open new window for user to login in
			// We want to open it here (from the master iframe) so that our popup won't be blocked
			// (this keeps us in the context of the user's click)
			var url = 'https://wordpress.com/public.api/connect/?action=request&service=wordpress';
			if ( typeof wpLikes.login_domain === 'string' ) {
				url += '&domain=' + encodeURIComponent( wpLikes.login_domain );
			}
			extWin = window.open( url, 'likeconn', 'status=0,toolbar=0,location=1,menubar=0,directories=0,resizable=1,scrollbars=1,height=660,width=500' );

			// Append cookie polling login iframe to original window to wait for user to finish logging in (or cancel)
			var loginIframe = document.createElement( 'iframe' );
			loginIframe.id = 'wp-login-polling-iframe';
			loginIframe.src = 'https://wordpress.com/public.api/connect/?iframe=true';
			loginIframe.style.display = 'none';
			document.body.appendChild( loginIframe );
		},

		hasClass: function( className, el ) {
			if (el.classList) {
				return el.classList.contains(className);
			} else {
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			}
		},

		addClass: function( className, el ) {
			if (el.classList) {
				el.classList.add(className);
			} else {
				el.className += ' ' + className;
			}
		},

		removeClass: function( className, el ) {
			if (el.classList) {
				el.classList.remove(className);
			} else {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		},

		outerWidth: function(el) {
			var width = el.offsetWidth;
			var style = getComputedStyle(el);
			if ( style ) {
				width += parseInt(style.marginLeft) + parseInt(style.marginRight);
			}
			return width;
		},

		outerHeight: function(el) {
			var height = el.offsetHeight;
			var style = getComputedStyle(el);
			if ( style ) {
				height += parseInt(style.marginTop) + parseInt(style.marginBottom);
			}
			return height;
		},

		triggerClick: function( data, el ) {
			var event = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});
			// if (window.CustomEvent) {
			// 	var event = new CustomEvent('my-event', {detail: {some: 'data'}});
			// } else {
			// 	var event = document.createEvent('CustomEvent');
			// 	event.initCustomEvent('my-event', true, true, {some: 'data'});
			// }

			el.dispatchEvent(event);
		},

		readMessage: function( event ) {
			if ( 'undefined' === typeof event.event ) {
				return;
			} else if ( 'login' === event.event && event.success ) {
				// Remove any lingering login window
				if ( extWin ) {
					if ( ! extWin.closed ) {
						extWin.close();
					}
					extWin = false;
				}

				// Remove the cookie polling iframe that was added by openLoginWindow
				var pollingIframe = document.querySelector( '#wp-login-polling-iframe' );
				if ( pollingIframe ) {
					pollingIframe.parentNode.removeChild( pollingIframe );
				}

				// If the cookie is available, then we must have auth'd successfully
				wpLikes.isLoggedIn = true;
				wpLikes.hasUpgradedProxy = false;
				window.WPCOM_Proxy_Rebuild();

				if ( wpLikes.login_post_id ) {
					wpLikes.getPostLikes( wpLikes.login_blog_id, wpLikes.login_post_id, function( results ) {

						var slim = this.hasClass( 'wpl-slim-likebox', window.parent.frames[ 'like-post-frame-' + wpLikes.login_obj_id ].document.querySelector( '.wpl-likebox' ) );
						wpLikes.updatePostFeedback( results, wpLikes.login_blog_id, wpLikes.login_post_id, slim, wpLikes.login_obj_id );

						if ( !results.i_like ) {
							wpLikes.doLike( wpLikes.login_blog_id, wpLikes.login_post_id, wpLikes.login_obj_id );
						}

						var likeButton = window.parent.frames[ 'like-post-frame-' + wpLikes.login_obj_id ].document.querySelector( '.wpl-button a.like, .wpl-button a.liked' );

						likeButton.onclick = function( e ) {
							e.preventDefault();
							wpLikes.doLike( wpLikes.login_blog_id, wpLikes.login_post_id, wpLikes.login_obj_id );
						};
					}.bind(this), function() {}, false );
				}

				if ( wpLikes.login_comment_id && ! wpLikes.commentLikesKillSwitch ) {
					wpLikes.getCommentLikes( wpLikes.login_blog_id, wpLikes.login_comment_id, function( results ) {
						var links = window.parent.frames[ 'like-comment-frame-' + wpLikes.login_obj_id ].document.querySelectorAll( 'a.comment-like-link' );

						if ( links.length === 0 ) {
							return;
						}

						links.forEach( function( link ) {
							this.addClass( 'loading', link );

							if ( ! results.i_like ) {
								wpLikes.likeComment( wpLikes.login_blog_id, wpLikes.login_comment_id, function() {
									link.parent().removeClass( 'comment-not-liked' );
									link.parent().addClass( 'comment-liked' );

									var feedback = getCommentLikeFeedback( true, results.found + 1 );
									link.textContent = feedback;
								}.bind(this) );
							} else {
								link.parent().removeClass( 'comment-not-liked' );
								link.parent().addClass( 'comment-liked' );

								var feedback = getCommentLikeFeedback( true, results.found );
								link.textContent = feedback;
							}

							link.removeClass( 'loading' );
						}.bind(this) );
					}.bind(this), function() {}, false );
				}
			} else if ( 'injectStyles' === event.event ) {
				wpLikes.textStyles = event.textStyles;
				wpLikes.linkStyles = event.linkStyles;

				if ( wpLikes.adminBarEnabled ) {
					wpLikes.adminBarStyles = event.adminBarStyles;
				}
			} else if ( 'initialBatch' === event.event ) {
				wpLikes.initialBatch( event.requests );
			} else if ( 'adminBarEnabled' === event.event ) {
				wpLikes.adminBarEnabled = true;
			} else if ( 'reblogsEnabled' === event.event ) {
				wpLikes.reblogsEnabled = true;
			} else if ( 'loadLikeWidget' === event.event ) {
				if ( event.name in window.parent.frames ) {
					var info = wpLikes.splitParams( window.parent.frames[ event.name ].location.hash.replace( /^#/, '' ) );
					var path, request;

					// This gets used for reverse remote login, we need to pass
					// the target login domain all the way down to the login
					// form.
					try {
						if ( typeof event.domain === 'string' ) {
							wpLikes.login_domain = event.domain;
						}
					} catch( error ) { }

					if ( info.blog_id && info.post_id && info.origin ) {

						path = '/sites/' + info.blog_id + '/posts/' + info.post_id + '/likes';
						if ( typeof info.slim === 'undefined' ) {
							info.slim = false;
						}

						request = {
								type:    'post',
								blog_id: info.blog_id,
								post_id: info.post_id,
								obj_id:  info.obj_id,
								width:   event.width,
								slim:    info.slim
							};
						wpLikes.requests[path] = request;
						wpLikes.getPostLikes( info.blog_id, info.post_id, wpLikes.displayWidget );
					} else if ( info.blog_id && info.comment_id && info.origin && ! wpLikes.commentLikesKillSwitch ) {
						path = '/sites/' + info.blog_id + '/comments/' + info.comment_id + '/likes';
						request = {
								type:       'comment',
								blog_id:    info.blog_id,
								comment_id: info.comment_id,
								obj_id:     info.obj_id,
								width:      event.width
							};
						wpLikes.requests[path] = request;

						wpLikes.getCommentLikes( info.blog_id, info.comment_id, wpLikes.displayWidget );
					}
				}
			} else if ( 'didReblog' === event.event && 'obj_id' in event ) {
				// Update the display of the button
				var wplbuttonlink = window.parent.frames[ 'like-post-frame-' + event.obj_id ].document.querySelector( '.wpl-button a.reblog' );
				this.removeClass('reblog', wplbuttonlink);
				this.addClass('reblogged', wplbuttonlink);

				wplbuttonlink.innerHTML = '<span>' + i18n.translate( 'Reblogged' ).fetch() + '</span> ';
				wplbuttonlink.style.display = null;
			}
		},

		handlePromptClicks: function( blog_id, post_id , obj_id) {
			var $doc = window.parent.frames[ 'like-post-frame-' + obj_id ].document;

			var commentLink = $doc.querySelector( '.wpl-comment > a' );
			if ( commentLink ) {
				commentLink.onclick = function() {
					// Bump stat and redirect
					new Image().src = document.location.protocol+'//pixel.wp.com/b.gif?v=wpcom-no-pv&x_follow-click-prompt=comment-prompt&baba='+Math.random();
				};
			}

			var followLink = $doc.querySelector( '.wpl-follow a' );
			if ( followLink ) {
				this.setCss( followLink, wpLikes.linkStyles );
				followLink.onclick = function(e) {
					e.preventDefault();
					wpLikes.afterlikeFollow( blog_id );
					$doc.querySelector( '.wpl-follow' ).innerHTML = i18n.translate( 'Following.' ).fetch();
					return false;
				};
			}
		},

		siblings: function( selector, el ) {
			return Array.prototype.filter.call(el.parentNode.children, function(child) {
				var matches = el.parentNode.querySelectorAll( selector ),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== child) {}
				return child !== el && i > -1;
			} );
		},

		doLike: function( blog_id, post_id, obj_id ) {
			function postLikePrompts() {
				wpLikes.getFollowingStatus( blog_id, function( result ) {
					var $doc = window.parent.frames[ 'like-post-frame-' + obj_id ].document;
					if ( $doc.offsetWidth < 350 ) {
						// If the contentWidth isn't wide enough, the prompts won't display properly.
						return;
					}
					if ( !result.is_following ) {
						var followEl = $doc.querySelector( '.wpl-follow' );
						if ( followEl ) {
							followEl.style.display = null;
						}
						this.setCss( followEl.querySelector( 'a' ), wpLikes.linkStyles );
						wpLikes.handlePromptClicks( blog_id, post_id, obj_id );
					} else {
						wpLikes.getPost( blog_id, post_id, function( post ) {
							if ( post.comments_open ) {
								var commentLink = $doc.querySelector( '.wpl-comment a');
								if ( commentLink ) {
									this.setCss( commentLink, wpLikes.linkStyles );
									commentLink.href = post.URL + '#respond';
								}

								var comment = $doc.querySelector( '.wpl-comment' );
								if ( comment ) {
									comment.style.display = null;
								}
								wpLikes.handlePromptClicks( blog_id, post_id, obj_id );
							}
						}.bind(this) );
					}
				}.bind(this) );
			}

			if ( ! wpLikes.isLoggedIn ) {
				wpLikes.login_blog_id = blog_id;
				wpLikes.login_post_id = post_id;
				wpLikes.login_obj_id  = obj_id;

				new Image().src = document.location.protocol+'//pixel.wp.com/b.gif?v=wpcom-no-pv&x_likes=loggedout_like_click&baba='+Math.random();

				// User isn't logged in, so we should get them to do that.
				wpLikes.openLoginWindow();
				return;
			}

			/**
		 	* After Like Prompts
		 	* After liking a post, we show a "follow this blog"? prompt to get readers to subscribe to the blog.
		 	* or a "comment on this post?" prompt if they are already following
		 	*/
			var followPromptText = ' <span class="wpl-follow" style="display:none;"><a href="#">' + i18n.translate( 'Follow this Blog?' ).fetch() + '</a></span>';
			var commentPromptText = ' <span class="wpl-comment" style="display:none;"><a href="#" target="_parent">' + i18n.translate( 'Comment on this post?' ).fetch() + '</a></span>';

			var wplbuttonlink = window.parent.frames[ 'like-post-frame-' + obj_id ].document.querySelector( '.wpl-button a.like, .wpl-button a.liked' );
			var wplbutton = wplbuttonlink.parentNode;
			var wplcount = this.siblings( '.wpl-count', wplbutton )[0];
			var wplavatars = this.siblings( '.wpl-avatars', wplbutton );
			var wplcounttext = wplcount.querySelector( '.wpl-count-text' );

			var likeText = '';

			if ( this.hasClass( 'like', wplbuttonlink ) ) {
				var slim = this.hasClass( 'wpl-slim-likebox', wplbutton.parentNode );

				// Figure out what the feedback text should say
				if ( wplcounttext &&  i18n.translate( 'Be the first to like this.' ).fetch() === wplcounttext.innerHTML ) {
					likeText = '<span class="wpl-count-text">' + i18n.translate( 'You like this.' ).fetch() + '</span>' + followPromptText + commentPromptText;
				}
				else if ( wplcounttext && i18n.translate( 'One blogger likes this.' ).fetch() === wplcounttext.innerHTML ) {
					likeText = '<span class="wpl-count-text">' + i18n.translate( 'You and one other blogger like this.' ).fetch() +'</span>' + followPromptText + commentPromptText;
				} else {
					var countEl = wplcount.querySelector('.wpl-count-number');
					if ( countEl ) {
						var count = countEl.textContent;
						likeText = '<span class="wpl-count-text">' +
							i18n.sprintf( i18n.translate( 'You and <a href="%1$s" id="%2$s">%3$s other bloggers</a> like this.' ).fetch(), '#', 'other-gravatars', '<span class="wpl-count-number">' + count + '</span>' ) + '</span>' + followPromptText + commentPromptText;
					}
				}

				// Update the display of the button
				this.removeClass( 'like', wplbuttonlink );
				this.addClass( 'liked', wplbuttonlink );
				this.removeClass( 'like', wplbutton );
				this.addClass( 'liked', wplbutton)

				if ( !slim ) {
					wplcount.innerHTML = likeText;
					wplcount.style.display = null;
					this.setCss( window.parent.frames[ 'like-post-frame-' + obj_id ].document.body.querySelector( '.wpl-count a' ), wpLikes.linkStyles );
				}

				postLikePrompts.bind(this).call();

				if ( !slim ) {
					wpLikes.getMyInfo( function( me ) {
						me.css_class = 'wp-liker-me';

						wpLikes.likers[blog_id + '-' + post_id].unshift( me );

						if ( !wplbutton.parentNode.querySelectorAll( '.wp-liker-me' ).length ) {
							if ( !wplavatars.length ) {
								wplbutton.insertAdjacentHTML('afterend',
									'<ul class="wpl-avatars">' +
										'<li class="wp-liker-me">' +
											'<a title="' + window.escapeHTML( me.display_name ) +'" href="' + window.escapeHTML( me.profile_URL ) + '" class="wpl-liker" rel="nofollow" target="_parent">' +
												'<img src="' + window.escapeHTML( me.avatar_URL ) + '" alt="' + window.escapeHTML( i18n.translate( 'My Grav.' ).fetch() ) + '" width="30" height="30" />' +
											'</a>' +
										'</li>' +
									'</ul>'
								);
							} else {
								wplavatars[0].insertAdjacentHTML('afterbegin',
									'<li class="wp-liker-me">' +
										'<a title="' + window.escapeHTML( me.display_name ) +'" href="' + window.escapeHTML( me.profile_URL ) + '" class="wpl-liker" rel="nofollow" target="_parent">' +
											'<img src="' + window.escapeHTML( me.avatar_URL ) + '" alt="' + window.escapeHTML( i18n.translate( 'My Grav.' ).fetch() ) + '" width="30" height="30" style="padding-right: 3px;" />' +
										'</a>' +
									'</li>'
								);
							}
						}
					}.bind( this ));
				}

				wplbuttonlink.innerHTML = '<span>' + i18n.translate( 'Liked' ).fetch() + '</span> ';

				// Ask parent to resize the frame
				wpLikes.resizeFrame( 'like-post-frame-' + obj_id );

				if ( wpLikes.adminBarEnabled ) {
					var widgetDocument = window.parent.frames['admin-bar-likes-widget'].document;
					widgetDocument.querySelector( 'a.like' ).textContent = i18n.translate( 'Liked' ).fetch();
				}

				// ANNNNND like it
				if ( 'undefined' !== typeof arguments[3] && 'adminbar' === arguments[3] ) {
					wpLikes.likePost( blog_id, post_id, 'adminbar' );
				} else {
					wpLikes.likePost( blog_id, post_id, 'post_flair' );
				}

			} else if ( this.hasClass( 'liked', wplbuttonlink ) ) {
				this.removeClass( 'liked', wplbuttonlink );
				this.addClass( 'like', wplbuttonlink );

				this.removeClass('liked', wplbutton );
				this.addClass('like', wplbutton);

				if ( wplcounttext && i18n.translate( 'You like this.' ).fetch() === wplcounttext.innerHTML ) {
					likeText = '<span class="wpl-count-text">' + i18n.translate( 'Be the first to like this.' ).fetch() + '</span>';
				} else if ( wplcounttext && i18n.translate( 'You and one other blogger like this.' ).fetch() === wplcounttext.innerHTML ) {
					likeText = '<span class="wpl-count-text">' + i18n.translate( 'One blogger likes this.' ).fetch() +'</span>';
				} else {
					var countEl = wplcount.querySelector('.wpl-count-number');
					if ( countEl ) {
						var count = countEl.textContent;
						likeText = '<span class="wpl-count-text">' + i18n.sprintf( i18n.translate( '<a href="%1$s" id="%2$s">%3$s bloggers</a> like this.' ).fetch(), '#', 'other-gravatars', '<span class="wpl-count-number">' + count + '</span>' ) + '</span>';
					}
				}

				wplcount.innerHTML = likeText;
				wplcount.style.display = null;
				this.setCss( window.parent.frames[ 'like-post-frame-' + obj_id ].document.body.querySelector( '.wpl-count a'), wpLikes.linkStyles );

				wpLikes.likers[blog_id + '-' + post_id].shift();

				var wpLikerMe = wplbutton.parentNode.querySelector('li.wp-liker-me');
				if ( wpLikerMe ) {
					wpLikerMe.parentNode.removeChild( wpLikerMe );
				}

				wplbuttonlink.innerHTML = '<span>' + i18n.translate( 'Like' ).fetch() + '</span>';

				// Ask parent to resize the frames
				wpLikes.resizeFrame( 'like-post-frame-' + obj_id );

				if ( wpLikes.adminBarEnabled ) {
					window.parent.frames[ 'admin-bar-likes-widget' ].document.querySelector( 'a.like' ).textContent = i18n.translate( 'Like' ).fetch();
				}

				// ANNNNND unlike it
				wpLikes.unlikePost( blog_id, post_id );
			}
		},

		// replacement for jQuery(el).css({some: style})
		setCss: function( el, styles ) {
			if ( ! el ) {
				return;
			}

			Object.keys(styles).forEach(function(key) {
				el.style[key] = styles[key];
			});
		},

		updatePostFeedback: function( likes, blog_id, post_id, slim, obj_id ) {
			if ( !obj_id ) {
				obj_id = blog_id + '-' + post_id;
			}

			var isLiked = likes.i_like;
			var label = '';
			var css_state = '';
			var feedback = '';

			var canReblog = false;
			var canUserReblog = false;
			var reblog_css_state = 'reblog';
			var reblog_feedback_no_html = i18n.translate( 'Reblog this post on your main site.' ).fetch();
			var reblog_label = i18n.translate( 'Reblog' ).fetch();
			var reblog_path = '/sites/' + blog_id + '/posts/' + post_id + '/reblogs/mine';

			if ( ! this.reblogsEnabled ) {
				canReblog = false;
			} else if ( reblog_path in this.cache ) {
				if ( this.cache[reblog_path].can_reblog ) {
					canReblog = true;
				}
				if ( this.cache[reblog_path].can_user_reblog ) {
					canUserReblog = true;
				}
				if ( this.cache[reblog_path].is_reblogged ) {
					reblog_css_state = 'reblogged';
					reblog_label = i18n.translate( 'Reblogged' ).fetch();
				}
			}

			// Figure out the button label and css class for this button
			if ( isLiked ) {
				label = i18n.translate( 'Liked' ).fetch();
				css_state = 'liked';
			} else {
				label = i18n.translate( 'Like' ).fetch();
				css_state = 'like';
			}

			var hasLikes = true;

			// Figure out the inital feedback text
			if ( 0 === likes.found ) {
					hasLikes = false;
					feedback = i18n.translate( 'Be the first to like this.' ).fetch();
			} else if ( 1 === likes.found ) {
				if ( isLiked ) {
					feedback = i18n.translate( 'You like this.' ).fetch();
				} else {
					feedback = i18n.translate( 'One blogger likes this.' ).fetch();
				}
			} else {
				if ( isLiked ) {
					var user_count = likes.found - 1;
					if ( user_count !== 1 ) {
						feedback = i18n.sprintf( i18n.translate( 'You and <a href="%1$s" id="%2$s">%3$s other bloggers</a> like this.' ).fetch(), '#', 'other-gravatars', '<span class="wpl-count-number">' + user_count + '</span>' );
					} else {
						feedback = i18n.translate( 'You and one other blogger like this.' ).fetch();
					}
				} else {
					feedback = i18n.sprintf( i18n.translate( '<a href="%1$s" id="%2$s">%3$s bloggers</a> like this.' ).fetch(), '#', 'other-gravatars', '<span class="wpl-count-number">' + likes.found + '</span>' );
				}
			}

			feedback = '<span class="wpl-count-text">' + feedback + '</span>';

			function createPostLikeTemplate() {
				var template, cacheBuster, widgetDocument;

				if ( '' !== wpLikes.version ) {
					cacheBuster = '?ver=' + wpLikes.version;
				}

				if ( wpLikes.adminBarEnabled ) {
					template = window.tmpl( document.querySelector( '#admin-bar-likes' ).innerHTML );
					widgetDocument = window.parent.frames['admin-bar-likes-widget'].document;

					widgetDocument.querySelector( '#target' ).innerHTML = template( {
						label: label,
						isRtl: wpLikes.adminBarStyles.isRtl
					} );

					var style = document.createElement( 'link' );
					style.setAttribute( 'type', 'text/css' );
					style.setAttribute( 'rel', 'stylesheet' );
					style.setAttribute( 'href', '//s0.wp.com/wp-includes/css/admin-bar.min.css' + cacheBuster);
					widgetDocument.querySelector( 'head' ).appendChild( style );

					if ( wpLikes.adminBarStyles.isRtl ) {
						style.setAttribute( 'href', '//s0.wp.com/wp-content/mu-plugins/admin-bar/rtl/wpcom-admin-bar-rtl.css' + cacheBuster);
					} else {
						style.setAttribute( 'href', '//s0.wp.com/wp-content/mu-plugins/admin-bar/wpcom-admin-bar.css' + cacheBuster);
					}
					widgetDocument.querySelector( 'head' ).appendChild( style );
				}

				if ( slim ) {
					template = window.tmpl( document.querySelector( '#slim-likes' ).innerHTML );
				} else {
					template = window.tmpl( document.querySelector( '#post-likes' ).innerHTML );
				}
				widgetDocument = window.parent.frames[ 'like-post-frame-' + obj_id ].document;
				widgetDocument.querySelector( '#target' ).innerHTML = template( {
					likers:                  likers.slice( 0, 20 ),
					css_state:               css_state,
					label:                   label,
					feedback:                feedback,
					feedback_no_html:        feedback.replace( /(<.*?>)/ig, '' ),
					hasLikes:                hasLikes,
					reblog_css_state:        reblog_css_state,
					reblog_feedback_no_html: reblog_feedback_no_html,
					canReblog:               canReblog,
					canUserReblog:           canUserReblog,
					reblog_label:            reblog_label
				} );

				this.setCss( widgetDocument.body, wpLikes.textStyles );
				this.setCss( widgetDocument.body.querySelector('.wpl-count a'), wpLikes.linkStyles );

				if ( 'rtl' === wpLikes.textStyles.direction ) {
					this.addClass( 'rtl', widgetDocument.body );
				}

				wpLikes.postMessage( {
					event: 'showLikeWidget',
					id: 'like-post-wrapper-' + obj_id,
					blog_id: blog_id,
					post_id: post_id,
					obj_id: obj_id
				}, parent );

				if ( wpLikes.adminBarEnabled ) {
					widgetDocument = window.parent.frames['admin-bar-likes-widget'].document;
					widgetDocument.querySelector( 'a.like' ).click( function() {
						var doc = window.parent.frames[ 'like-post-frame-' + obj_id ].document;
						this.triggerClick( { source: 'adminbar' }, doc.querySelector( '.wpl-button > a.like, .wpl-button > a.liked' ) );
					}.bind(this) );
				}
			}

			// Build the likers array
			var likers = likes.likes;
			if ( likers.length > 0 ) {
				var max_remove = likers.length - 90;
				for ( i = likers.length - 1; i >= 0 && max_remove > 0; i-- ) {
					if ( likers[i].default_avatar && ( ! wpLikes.me || wpLikes.me.ID !== likers[i]['ID'] ) ) {
						likers.splice( i, 1 );
						max_remove--;
					}
				}
			}

			if ( wpLikes.me ) {
				wpLikes.isLoggedIn = true;

				for( var i = 0; i < likers.length; i++ ) {
					if ( likers[i].ID === wpLikes.me.ID ) {
						likers[i]['css_class'] = 'wp-liker-me';
						// Move this user's avatar to the front of the face pile
						likers.unshift( likers.splice( i, 1 )[0] );
						break;
					}
				}
			}

			wpLikes.likers[blog_id + '-' + post_id] = likers;
			wpLikes.total[blog_id + '-' + post_id] = likes.found;

			createPostLikeTemplate.bind(this).call();
		},

		initialBatch: function( requests ) {
			var info, request, path;

			wpLikes.queue = [];
			wpLikes.batchFinished = false;
			wpLikes.batchWaiting = [];

			if ( ! wpLikes.me && ! wpLikes.askedMe ) {
				wpLikes.queue.push( '/me' );
				wpLikes.askedMe = true;
			}

			for( var i = 0; i < requests.length; i++ ) {
				info = requests[i];

				if ( info.blog_id && info.post_id ) {
					path = '/sites/' + info.blog_id + '/posts/' + info.post_id + '/likes';
					request = {
							type:    'post',
							blog_id: info.blog_id,
							post_id: info.post_id,
							obj_id:  info.obj_id,
							width:   info.width
						};
					wpLikes.requests[path] = request;
					wpLikes.queue.push( path );
					path = '/sites/' + info.blog_id + '/posts/' + info.post_id + '/reblogs/mine';
					request = {
							blog_id: info.blog_id,
							post_id: info.post_id
						};
					wpLikes.requests[path] = request;
					wpLikes.queue.push( path );
				} else if ( info.blog_id && info.comment_id && ! wpLikes.commentLikesKillSwitch ) {
					path = '/sites/' + info.blog_id + '/comments/' + info.comment_id + '/likes';
					request = {
							type:       'comment',
							blog_id:    info.blog_id,
							comment_id: info.comment_id,
							width:      info.width
						};
					wpLikes.requests[path] = request;
					wpLikes.queue.push( path );
				}
			}

			var batchRequest = {
				path:    '/batch',
				type:    'GET',
				url:     'https://public-api.wordpress.com/rest/v1/batch',
				data:    '',
				success: function( response ) {
							for ( var path in response ) {
								if ( ! response[path]['error_data'] && ! response[path]['errors'] ) {
									if ( '/me' === path ) {
										wpLikes.me = response[path];
									} else {
										wpLikes.cache[path] = response[path];
									}
								}
							}

							wpLikes.batchFinished = true;
							for ( var item in wpLikes.batchWaiting ) {
								wpLikes.ajax( wpLikes.batchWaiting[ item ] );
							}
						},
				error: function() {
							wpLikes.batchFinished = true;
							for ( var item in wpLikes.batchWaiting ) {
								wpLikes.ajax( wpLikes.batchWaiting[ item ] );
							}
					}
			};

			var amp = '';
			for( var i = 0; i < wpLikes.queue.length; i++ ) {
				if ( i > 0 ) {
					amp = '&';
				}
				batchRequest.data += amp + 'urls[]=' + wpLikes.queue[i];
			}

			wpLikes.ajax( batchRequest );
		}
	};

	// wpLikes.displayWidget is called when the ajax request for post or comment likes completes successfully
	// it is used to display the widget with the likes data
	var i18n;
	wpLikes.displayWidget = function( response, path ) {
		/**
	 	* Translation
	 	*/
		var info = wpLikes.splitParams( location.hash.replace( /^#/, '' ) );
		if ( info.lang ) {
			wpLikes.lang = info.lang;
		}

		var load_default = true;
		var json_locale_data;
		if ( 'en' !== wpLikes.lang ) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', '/languages/' + wpLikes.lang + '.json' + '?ver=' + wpLikes.version, false);
			xhr.onload = function() {
				if (xhr.status === 200) {
					var json = JSON.parse( xhr.responseText );
					json_locale_data = json;
					load_default = false;
				}
			};
			xhr.send();
		}
		if ( null === json_locale_data ) {
			load_default = true;
		}

		if ( load_default ) {
			json_locale_data = { '': {
		  		'domain': 'messages',
		  		'lang': wpLikes.lang,
		  		'plural-forms': 'nplurals=2; plural=(n !== 1);'
			} };
		}

		i18n = new Jed( { locale_data : { 'messages' : json_locale_data }, 'domain' : 'messages' } );

		if ( path in wpLikes.requests ) {
			if ( 'post' === wpLikes.requests[path].type ) {
				displayPostLikeWidget( wpLikes.requests[path].blog_id, wpLikes.requests[path].post_id, wpLikes.requests[path].width, wpLikes.requests[path].slim, response, wpLikes.requests[path].obj_id );
			}
			if ( 'comment' === wpLikes.requests[path].type ) {
				displayCommentLikeWidget( wpLikes.requests[path].blog_id, wpLikes.requests[path].comment_id, wpLikes.requests[path].width, response, wpLikes.requests[path].obj_id );
			}
		}
	};

	// displayPostLikeWidget is called when a post's likes data arrives via ajax (see wpLikes.displayWidget i.e. the ajax success handler)
	function displayPostLikeWidget( blog_id, post_id, width, slim, result, obj_id ) {

		if ( !obj_id ) {
			obj_id = blog_id + '-' + post_id;
		}

		wpLikes.updatePostFeedback( result, blog_id, post_id, slim, obj_id );

		var likePostFrameDoc = window.parent.frames[ 'like-post-frame-' + obj_id ].document;

		function hasClass( className, el ) {
			if (el.classList) {
				return el.classList.contains(className);
			} else {
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			}
		}

		// Add a click handler to handle the liking action
		var likeButton = likePostFrameDoc.querySelector( '.wpl-button a.like, .wpl-button a.liked' );
		if ( likeButton ) {
			likeButton.onclick = function( e ) {
				e.preventDefault();
				var source = 'post_flair';
				if ( 'undefined' !== typeof arguments[1] && 'adminbar' === arguments[1].source ) {
					source = 'adminbar';
				}
				wpLikes.doLike( blog_id, post_id, obj_id, source );
			}.bind( this );
		}

		// Add a reblog handler to handle the reblog action
		var reblogButton = likePostFrameDoc.querySelector( '.wpl-button a.reblog' );
		if ( reblogButton ) {
			reblogButton.onclick = function( e ) {
				e.preventDefault();
				if ( hasClass( 'reblog', reblogButton ) ) {
					wpLikes.postMessage( { event: 'clickReblogFlair', obj_id: obj_id }, window.parent );
				}
			}.bind( this );
		}

		if ( !slim ) {
			// Handle the "n other bloggers" list
			var otherGravatars = likePostFrameDoc.querySelector('a#other-gravatars');
			if ( otherGravatars ) {
				otherGravatars.onclick = function( e ) {
					e.preventDefault();
					var $avatars = window.parent.frames[ 'like-post-frame-' + obj_id ].document.querySelector( '.wpl-avatars' );

					var likersToSend = 90;
					var myArrayId = -1;
					for ( var i = 0; i < likersToSend && i < wpLikes.likers[blog_id + '-' + post_id].length; i++ ) {
						if ( 'wpl-liker-me' === wpLikes.likers[blog_id + '-' + post_id][i].css_class ) {
							myArrayId = i;
						}
						wpLikes.likers[blog_id + '-' + post_id][i].css_class = 'wpl-liker';
					}

					// Send a message to the likes master iframe (jetpack-likes.php) to update this frame's gravatars (likers)
					var data = {
						event:    'showOtherGravatars',
						likers:   wpLikes.likers[blog_id + '-' + post_id].slice( 0, likersToSend ),
						total:    wpLikes.total[blog_id + '-' + post_id],
						parent:   'like-post-frame-' + obj_id,
						width:    $avatars.offsetWidth,
						position: {
							top:  $avatars.offsetTop,
							left: $avatars.offsetLeft
						}
					};

					wpLikes.postMessage( data, window.parent );

					if ( myArrayId >= 0 ) {
						wpLikes.likers[blog_id + '-' + post_id][myArrayId].css_class = 'wpl-liker-me';
					}
				};
			}
		}

		/**
	 	* End Prompts
	 	*/
	}

	function getCommentLikeFeedback( isLiked, found ) {
		var feedback = '';
		var likers = '';
		if ( 0 === found ) {
			feedback = i18n.translate( 'Like' ).fetch();
		} else if ( 1 === found ) {
			if ( isLiked ) {
				feedback = i18n.translate( 'Liked by you' ).fetch();
			} else {
				likers = i18n.translate( '%d person' ).fetch( 1 );
				feedback = i18n.translate( 'Liked by %s' ).fetch( likers );
			}
		} else {
			if ( isLiked ) {
				var userCount = found - 1;
				if ( userCount !== 1 ) {
					likers = i18n.translate( '%d other people' ).fetch( userCount );
					feedback = i18n.translate( 'Liked by you and %s' ).fetch( likers );
				} else {
					likers = i18n.translate( '%d other person' ).fetch( userCount );
					feedback = i18n.translate( 'Liked by you and %s' ).fetch( likers );
				}
			} else {
				likers = i18n.translate( '%d people' ).fetch( found );
				feedback = i18n.translate( 'Liked by %s' ).fetch( likers );
			}
		}
		return feedback;
	}

	function textToHtml( text ) {
		var temp = document.createElement('div');
		temp.innerHTML = text;
		return temp.firstChild;
	}

	// Display the widget
	function displayCommentLikeWidget( blog_id, comment_id, width, likes, obj_id ) {
		if ( wpLikes.commentLikesKillSwitch ) {
			return;
		}

		if ( wpLikes.me ) {
			wpLikes.isLoggedIn = true;
		}

		var isLiked = likes.i_like;

		var label = '';
		var css_state = '';

		var feedback = getCommentLikeFeedback( isLiked, likes.found );

		// Figure out the button label and css class for this button
		if ( isLiked ) {
			label = feedback;
			css_state = 'comment-liked';
		} else {
			label = feedback;
			css_state = 'comment-not-liked';
		}

		var widgetDocument = window.parent.frames[ 'like-comment-frame-' + obj_id ].document;

		// Just the star in the iframe
		var template = window.tmpl( document.querySelector( '#comment-likes' ).innerHTML );
		widgetDocument.querySelector( '#target' ).innerHTML = template( {
			css_state: css_state,
			label: label
		} );

		var cacheBuster;

		if ( '' !== wpLikes.version ) {
			cacheBuster = '?ver=' + wpLikes.version;
		}

		wpLikes.postMessage( {
			event: 'showCommentLikeWidget',
			id: 'like-comment-wrapper-' + obj_id,
			blog_id: blog_id,
			comment_id: comment_id,
			obj_id: obj_id
		}, window.parent );

		var likeLink = widgetDocument.querySelector( 'a.comment-like-link' );
		if ( likeLink ) {
			likeLink.onclick = function( e ) {
				e.preventDefault();

				if ( ! wpLikes.isLoggedIn ) {
					wpLikes.login_blog_id = blog_id;
					wpLikes.login_comment_id = comment_id;
					wpLikes.login_obj_id  = obj_id;

					new Image().src = document.location.protocol+'//pixel.wp.com/b.gif?v=wpcom-no-pv&x_likes=loggedout_comment_like_click&baba='+Math.random();

					// User isn't logged in, so we should get them to do that.
					wpLikes.openLoginWindow();
					return;
				}

				function addClass( className, el ) {
					if (el.classList) {
						el.classList.add(className);
					} else {
						el.className += ' ' + className;
					}
				}

				function removeClass( className, el ) {
					if (el.classList) {
						el.classList.remove(className);
					} else {
						el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
					}
				}

				function hasClass( className, el ) {
					if (el.classList) {
						return el.classList.contains(className);
					} else {
						return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
					}
				}

				var link = e.target;
				addClass( 'loading', link );

				function updateCommentFeedback( action, i_like, count ) {
					if ( 'like' === action ) {
						removeClass( 'comment-not-liked', link.parentNode );
						addClass( 'comment-liked', link.parentNode );
					} else {
						removeClass( 'comment-liked', link.parentNode );
						addClass( 'comment-not-liked', link.parentNode );
					}

					feedback = getCommentLikeFeedback( i_like, count );
					link.textContent = feedback;

					wpLikes.postMessage( {
						event: 'showCommentLikeWidget',
						id: 'like-comment-wrapper-' + obj_id,
						blog_id: blog_id,
						comment_id: comment_id,
						obj_id: obj_id
					}, window.parent );
				}

				if ( hasClass( 'comment-not-liked', link.parentNode ) ) {
					wpLikes.likeComment( blog_id, comment_id, function( e ) {
						updateCommentFeedback( 'like', true, e.like_count );
						removeClass( 'loading', link );
					} );
				} else {
					wpLikes.unlikeComment( blog_id, comment_id, function( e ) {
						updateCommentFeedback( 'unlike', false, e.like_count );
						removeClass( 'loading', link );
					} );
				}

				return false;
			};
		}
	}

	// Since we can't know definitively when an iframe has finished loading
	function updateWidgetDimensions() {
		for (var name in wpLikes.widgetDims ) {
			var widgetDocument = window.parent.frames[ name ].document;
			var likeboxWidth = this.outerWidth( widgetDocument.querySelector( '.wpl-likebox' ) );
			var likeboxHeight = this.outerHeight( widgetDocument.querySelector( '.wpl-likebox' ) );

			// For now, we only care about width changes really
			if ( ( likeboxWidth > 0 ) && ( likeboxWidth !== wpLikes.widgetDims[name].w ) ) {
				wpLikes.widgetDims[name].w = likeboxWidth;
				wpLikes.widgetDims[name].h = likeboxHeight;
				wpLikes.resizeFrame( name );
			}
		}
	}

	wpLikes.wpLikes();
	pm.bind( 'likesMessage', function( e ) { wpLikes.readMessage(e); } );
	pm.bind( 'loginMessage', function( e ) { wpLikes.readMessage(e); } );
	wpLikes.postMessage( { event: 'masterReady' }, parent );

	setInterval( updateWidgetDimensions, 500 );

} )();
;
