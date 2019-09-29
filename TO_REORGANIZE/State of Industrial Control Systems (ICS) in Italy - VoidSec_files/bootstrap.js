!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("jquery"),require("popper.js")):"function"==typeof define&&define.amd?define(["exports","jquery","popper.js"],e):e(t.bootstrap={},t.jQuery,t.Popper)}(this,function(t,e,n){"use strict";function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function r(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}e=e&&e.hasOwnProperty("default")?e.default:e,n=n&&n.hasOwnProperty("default")?n.default:n;var a=function(t){function e(t){return{}.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase()}function n(e){var n=this,i=!1;return t(this).one(o.TRANSITION_END,function(){i=!0}),setTimeout(function(){i||o.triggerTransitionEnd(n)},e),this}function i(){t.fn.emulateTransitionEnd=n,t.event.special[o.TRANSITION_END]={bindType:r,delegateType:r,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}}var r="transitionend",o={TRANSITION_END:"bsTransitionEnd",getUID:function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},getSelectorFromElement:function(t){var e=t.getAttribute("data-target");e&&"#"!==e||(e=t.getAttribute("href")||"");try{return document.querySelector(e)?e:null}catch(t){return null}},getTransitionDurationFromElement:function(e){if(!e)return 0;var n=t(e).css("transition-duration");return parseFloat(n)?(n=n.split(",")[0],1e3*parseFloat(n)):0},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(e){t(e).trigger(r)},supportsTransitionEnd:function(){return Boolean(r)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,n,i){for(var r in i)if(Object.prototype.hasOwnProperty.call(i,r)){var s=i[r],a=n[r],l=a&&o.isElement(a)?"element":e(a);if(!new RegExp(s).test(l))throw new Error(t.toUpperCase()+': Option "'+r+'" provided type "'+l+'" but expected type "'+s+'".')}}};return i(),o}(e),l=function(t){var e=t.fn.alert,n={CLOSE:"close.bs.alert",CLOSED:"closed.bs.alert",CLICK_DATA_API:"click.bs.alert.data-api"},i={ALERT:"alert",FADE:"fade",SHOW:"show"},o=function(){function e(t){this._element=t}var o=e.prototype;return o.close=function(t){var e=this._element;t&&(e=this._getRootElement(t));this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},o.dispose=function(){t.removeData(this._element,"bs.alert"),this._element=null},o._getRootElement=function(e){var n=a.getSelectorFromElement(e),r=!1;return n&&(r=document.querySelector(n)),r||(r=t(e).closest("."+i.ALERT)[0]),r},o._triggerCloseEvent=function(e){var i=t.Event(n.CLOSE);return t(e).trigger(i),i},o._removeElement=function(e){var n=this;if(t(e).removeClass(i.SHOW),t(e).hasClass(i.FADE)){var r=a.getTransitionDurationFromElement(e);t(e).one(a.TRANSITION_END,function(t){return n._destroyElement(e,t)}).emulateTransitionEnd(r)}else this._destroyElement(e)},o._destroyElement=function(e){t(e).detach().trigger(n.CLOSED).remove()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),r=i.data("bs.alert");r||(r=new e(this),i.data("bs.alert",r)),"close"===n&&r[n](this)})},e._handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this)}},r(e,null,[{key:"VERSION",get:function(){return"4.1.3"}}]),e}();return t(document).on(n.CLICK_DATA_API,'[data-dismiss="alert"]',o._handleDismiss(new o)),t.fn.alert=o._jQueryInterface,t.fn.alert.Constructor=o,t.fn.alert.noConflict=function(){return t.fn.alert=e,o._jQueryInterface},o}(e),c=function(t){var e="button",n=t.fn[e],i={ACTIVE:"active",BUTTON:"btn",FOCUS:"focus"},o={DATA_TOGGLE_CARROT:'[data-toggle^="button"]',DATA_TOGGLE:'[data-toggle="buttons"]',INPUT:"input",ACTIVE:".active",BUTTON:".btn"},s={CLICK_DATA_API:"click.bs.button.data-api",FOCUS_BLUR_DATA_API:"focus.bs.button.data-api blur.bs.button.data-api"},a=function(){function e(t){this._element=t}var n=e.prototype;return n.toggle=function(){var e=!0,n=!0,r=t(this._element).closest(o.DATA_TOGGLE)[0];if(r){var s=this._element.querySelector(o.INPUT);if(s){if("radio"===s.type)if(s.checked&&this._element.classList.contains(i.ACTIVE))e=!1;else{var a=r.querySelector(o.ACTIVE);a&&t(a).removeClass(i.ACTIVE)}if(e){if(s.hasAttribute("disabled")||r.hasAttribute("disabled")||s.classList.contains("disabled")||r.classList.contains("disabled"))return;s.checked=!this._element.classList.contains(i.ACTIVE),t(s).trigger("change")}s.focus(),n=!1}}n&&this._element.setAttribute("aria-pressed",!this._element.classList.contains(i.ACTIVE)),e&&t(this._element).toggleClass(i.ACTIVE)},n.dispose=function(){t.removeData(this._element,"bs.button"),this._element=null},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data("bs.button");i||(i=new e(this),t(this).data("bs.button",i)),"toggle"===n&&i[n]()})},r(e,null,[{key:"VERSION",get:function(){return"4.1.3"}}]),e}();return t(document).on(s.CLICK_DATA_API,o.DATA_TOGGLE_CARROT,function(e){e.preventDefault();var n=e.target;t(n).hasClass(i.BUTTON)||(n=t(n).closest(o.BUTTON)),a._jQueryInterface.call(t(n),"toggle")}).on(s.FOCUS_BLUR_DATA_API,o.DATA_TOGGLE_CARROT,function(e){var n=t(e.target).closest(o.BUTTON)[0];t(n).toggleClass(i.FOCUS,/^focus(in)?$/.test(e.type))}),t.fn[e]=a._jQueryInterface,t.fn[e].Constructor=a,t.fn[e].noConflict=function(){return t.fn[e]=n,a._jQueryInterface},a}(e),u=function(t){var e="collapse",n="bs.collapse",i=t.fn[e],o={toggle:!0,parent:""},l={toggle:"boolean",parent:"(string|element)"},c={SHOW:"show.bs.collapse",SHOWN:"shown.bs.collapse",HIDE:"hide.bs.collapse",HIDDEN:"hidden.bs.collapse",CLICK_DATA_API:"click.bs.collapse.data-api"},u={SHOW:"show",COLLAPSE:"collapse",COLLAPSING:"collapsing",COLLAPSED:"collapsed"},h={WIDTH:"width",HEIGHT:"height"},f={ACTIVES:".show, .collapsing",DATA_TOGGLE:'[data-toggle="collapse"]'},g=function(){function i(e,n){this._isTransitioning=!1,this._element=e,this._config=this._getConfig(n),this._triggerArray=t.makeArray(document.querySelectorAll('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var i=[].slice.call(document.querySelectorAll(f.DATA_TOGGLE)),r=0,o=i.length;r<o;r++){var s=i[r],l=a.getSelectorFromElement(s),c=[].slice.call(document.querySelectorAll(l)).filter(function(t){return t===e});null!==l&&c.length>0&&(this._selector=l,this._triggerArray.push(s))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var g=i.prototype;return g.toggle=function(){t(this._element).hasClass(u.SHOW)?this.hide():this.show()},g.show=function(){var e=this;if(!this._isTransitioning&&!t(this._element).hasClass(u.SHOW)){var r,o;if(this._parent&&0===(r=[].slice.call(this._parent.querySelectorAll(f.ACTIVES)).filter(function(t){return t.getAttribute("data-parent")===e._config.parent})).length&&(r=null),!(r&&(o=t(r).not(this._selector).data(n))&&o._isTransitioning)){var s=t.Event(c.SHOW);if(t(this._element).trigger(s),!s.isDefaultPrevented()){r&&(i._jQueryInterface.call(t(r).not(this._selector),"hide"),o||t(r).data(n,null));var l=this._getDimension();t(this._element).removeClass(u.COLLAPSE).addClass(u.COLLAPSING),this._element.style[l]=0,this._triggerArray.length&&t(this._triggerArray).removeClass(u.COLLAPSED).attr("aria-expanded",!0),this.setTransitioning(!0);var h="scroll"+(l[0].toUpperCase()+l.slice(1)),g=a.getTransitionDurationFromElement(this._element);t(this._element).one(a.TRANSITION_END,function(){t(e._element).removeClass(u.COLLAPSING).addClass(u.COLLAPSE).addClass(u.SHOW),e._element.style[l]="",e.setTransitioning(!1),t(e._element).trigger(c.SHOWN)}).emulateTransitionEnd(g),this._element.style[l]=this._element[h]+"px"}}}},g.hide=function(){var e=this;if(!this._isTransitioning&&t(this._element).hasClass(u.SHOW)){var n=t.Event(c.HIDE);if(t(this._element).trigger(n),!n.isDefaultPrevented()){var i=this._getDimension();this._element.style[i]=this._element.getBoundingClientRect()[i]+"px",a.reflow(this._element),t(this._element).addClass(u.COLLAPSING).removeClass(u.COLLAPSE).removeClass(u.SHOW);var r=this._triggerArray.length;if(r>0)for(var o=0;o<r;o++){var s=this._triggerArray[o],l=a.getSelectorFromElement(s);if(null!==l){t([].slice.call(document.querySelectorAll(l))).hasClass(u.SHOW)||t(s).addClass(u.COLLAPSED).attr("aria-expanded",!1)}}this.setTransitioning(!0);this._element.style[i]="";var h=a.getTransitionDurationFromElement(this._element);t(this._element).one(a.TRANSITION_END,function(){e.setTransitioning(!1),t(e._element).removeClass(u.COLLAPSING).addClass(u.COLLAPSE).trigger(c.HIDDEN)}).emulateTransitionEnd(h)}}},g.setTransitioning=function(t){this._isTransitioning=t},g.dispose=function(){t.removeData(this._element,n),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},g._getConfig=function(t){return t=s({},o,t),t.toggle=Boolean(t.toggle),a.typeCheckConfig(e,t,l),t},g._getDimension=function(){return t(this._element).hasClass(h.WIDTH)?h.WIDTH:h.HEIGHT},g._getParent=function(){var e=this,n=null;a.isElement(this._config.parent)?(n=this._config.parent,void 0!==this._config.parent.jquery&&(n=this._config.parent[0])):n=document.querySelector(this._config.parent);var r='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]',o=[].slice.call(n.querySelectorAll(r));return t(o).each(function(t,n){e._addAriaAndCollapsedClass(i._getTargetFromElement(n),[n])}),n},g._addAriaAndCollapsedClass=function(e,n){if(e){var i=t(e).hasClass(u.SHOW);n.length&&t(n).toggleClass(u.COLLAPSED,!i).attr("aria-expanded",i)}},i._getTargetFromElement=function(t){var e=a.getSelectorFromElement(t);return e?document.querySelector(e):null},i._jQueryInterface=function(e){return this.each(function(){var r=t(this),a=r.data(n),l=s({},o,r.data(),"object"==typeof e&&e?e:{});if(!a&&l.toggle&&/show|hide/.test(e)&&(l.toggle=!1),a||(a=new i(this,l),r.data(n,a)),"string"==typeof e){if(void 0===a[e])throw new TypeError('No method named "'+e+'"');a[e]()}})},r(i,null,[{key:"VERSION",get:function(){return"4.1.3"}},{key:"Default",get:function(){return o}}]),i}();return t(document).on(c.CLICK_DATA_API,f.DATA_TOGGLE,function(e){"A"===e.currentTarget.tagName&&e.preventDefault();var i=t(this),r=a.getSelectorFromElement(this),o=[].slice.call(document.querySelectorAll(r));t(o).each(function(){var e=t(this),r=e.data(n)?"toggle":i.data();g._jQueryInterface.call(e,r)})}),t.fn[e]=g._jQueryInterface,t.fn[e].Constructor=g,t.fn[e].noConflict=function(){return t.fn[e]=i,g._jQueryInterface},g}(e),h=function(t){var e="dropdown",i="bs.dropdown",o="."+i,l=t.fn[e],c=new RegExp("38|40|27"),u={HIDE:"hide"+o,HIDDEN:"hidden"+o,SHOW:"show"+o,SHOWN:"shown"+o,CLICK:"click"+o,CLICK_DATA_API:"click.bs.dropdown.data-api",KEYDOWN_DATA_API:"keydown.bs.dropdown.data-api",KEYUP_DATA_API:"keyup.bs.dropdown.data-api"},h={DISABLED:"disabled",SHOW:"show",DROPUP:"dropup",DROPRIGHT:"dropright",DROPLEFT:"dropleft",MENURIGHT:"dropdown-menu-right",MENULEFT:"dropdown-menu-left",POSITION_STATIC:"position-static"},f={DATA_TOGGLE:'[data-toggle="dropdown"]',FORM_CHILD:".dropdown form",MENU:".dropdown-menu",NAVBAR_NAV:".navbar-nav",VISIBLE_ITEMS:".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)"},g={TOP:"top-start",TOPEND:"top-end",BOTTOM:"bottom-start",BOTTOMEND:"bottom-end",RIGHT:"right-start",RIGHTEND:"right-end",LEFT:"left-start",LEFTEND:"left-end"},d={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic"},_={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string"},p=function(){function l(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var p=l.prototype;return p.toggle=function(){if(!this._element.disabled&&!t(this._element).hasClass(h.DISABLED)){var e=l._getParentFromElement(this._element),i=t(this._menu).hasClass(h.SHOW);if(l._clearMenus(),!i){var r={relatedTarget:this._element},o=t.Event(u.SHOW,r);if(t(e).trigger(o),!o.isDefaultPrevented()){if(!this._inNavbar){if(void 0===n)throw new TypeError("Bootstrap dropdown require Popper.js (https://popper.js.org)");var s=this._element;"parent"===this._config.reference?s=e:a.isElement(this._config.reference)&&(s=this._config.reference,void 0!==this._config.reference.jquery&&(s=this._config.reference[0])),"scrollParent"!==this._config.boundary&&t(e).addClass(h.POSITION_STATIC),this._popper=new n(s,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===t(e).closest(f.NAVBAR_NAV).length&&t(document.body).children().on("mouseover",null,t.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),t(this._menu).toggleClass(h.SHOW),t(e).toggleClass(h.SHOW).trigger(t.Event(u.SHOWN,r))}}}},p.dispose=function(){t.removeData(this._element,i),t(this._element).off(o),this._element=null,this._menu=null,null!==this._popper&&(this._popper.destroy(),this._popper=null)},p.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},p._addEventListeners=function(){var e=this;t(this._element).on(u.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},p._getConfig=function(n){return n=s({},this.constructor.Default,t(this._element).data(),n),a.typeCheckConfig(e,n,this.constructor.DefaultType),n},p._getMenuElement=function(){if(!this._menu){var t=l._getParentFromElement(this._element);t&&(this._menu=t.querySelector(f.MENU))}return this._menu},p._getPlacement=function(){var e=t(this._element.parentNode),n=g.BOTTOM;return e.hasClass(h.DROPUP)?(n=g.TOP,t(this._menu).hasClass(h.MENURIGHT)&&(n=g.TOPEND)):e.hasClass(h.DROPRIGHT)?n=g.RIGHT:e.hasClass(h.DROPLEFT)?n=g.LEFT:t(this._menu).hasClass(h.MENURIGHT)&&(n=g.BOTTOMEND),n},p._detectNavbar=function(){return t(this._element).closest(".navbar").length>0},p._getPopperConfig=function(){var t=this,e={};"function"==typeof this._config.offset?e.fn=function(e){return e.offsets=s({},e.offsets,t._config.offset(e.offsets)||{}),e}:e.offset=this._config.offset;var n={placement:this._getPlacement(),modifiers:{offset:e,flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return"static"===this._config.display&&(n.modifiers.applyStyle={enabled:!1}),n},l._jQueryInterface=function(e){return this.each(function(){var n=t(this).data(i);if(n||(n=new l(this,"object"==typeof e?e:null),t(this).data(i,n)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},l._clearMenus=function(e){if(!e||3!==e.which&&("keyup"!==e.type||9===e.which))for(var n=[].slice.call(document.querySelectorAll(f.DATA_TOGGLE)),r=0,o=n.length;r<o;r++){var s=l._getParentFromElement(n[r]),a=t(n[r]).data(i),c={relatedTarget:n[r]};if(e&&"click"===e.type&&(c.clickEvent=e),a){var g=a._menu;if(t(s).hasClass(h.SHOW)&&!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&9===e.which)&&t.contains(s,e.target))){var d=t.Event(u.HIDE,c);t(s).trigger(d),d.isDefaultPrevented()||("ontouchstart"in document.documentElement&&t(document.body).children().off("mouseover",null,t.noop),n[r].setAttribute("aria-expanded","false"),t(g).removeClass(h.SHOW),t(s).removeClass(h.SHOW).trigger(t.Event(u.HIDDEN,c)))}}}},l._getParentFromElement=function(t){var e,n=a.getSelectorFromElement(t);return n&&(e=document.querySelector(n)),e||t.parentNode},l._dataApiKeydownHandler=function(e){if((/input|textarea/i.test(e.target.tagName)?!(32===e.which||27!==e.which&&(40!==e.which&&38!==e.which||t(e.target).closest(f.MENU).length)):c.test(e.which))&&(e.preventDefault(),e.stopPropagation(),!this.disabled&&!t(this).hasClass(h.DISABLED))){var n=l._getParentFromElement(this),i=t(n).hasClass(h.SHOW);if((i||27===e.which&&32===e.which)&&(!i||27!==e.which&&32!==e.which)){var r=[].slice.call(n.querySelectorAll(f.VISIBLE_ITEMS));if(0!==r.length){var o=r.indexOf(e.target);38===e.which&&o>0&&o--,40===e.which&&o<r.length-1&&o++,o<0&&(o=0),r[o].focus()}}else{if(27===e.which){var s=n.querySelector(f.DATA_TOGGLE);t(s).trigger("focus")}t(this).trigger("click")}}},r(l,null,[{key:"VERSION",get:function(){return"4.1.3"}},{key:"Default",get:function(){return d}},{key:"DefaultType",get:function(){return _}}]),l}();return t(document).on(u.KEYDOWN_DATA_API,f.DATA_TOGGLE,p._dataApiKeydownHandler).on(u.KEYDOWN_DATA_API,f.MENU,p._dataApiKeydownHandler).on(u.CLICK_DATA_API+" "+u.KEYUP_DATA_API,p._clearMenus).on(u.CLICK_DATA_API,f.DATA_TOGGLE,function(e){e.preventDefault(),e.stopPropagation(),p._jQueryInterface.call(t(this),"toggle")}).on(u.CLICK_DATA_API,f.FORM_CHILD,function(t){t.stopPropagation()}),t.fn[e]=p._jQueryInterface,t.fn[e].Constructor=p,t.fn[e].noConflict=function(){return t.fn[e]=l,p._jQueryInterface},p}(e),f=function(t){var e="tooltip",i=".bs.tooltip",o=t.fn[e],l=new RegExp("(^|\\s)bs-tooltip\\S+","g"),c={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)"},u={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},h={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent"},f={SHOW:"show",OUT:"out"},g={HIDE:"hide"+i,HIDDEN:"hidden"+i,SHOW:"show"+i,SHOWN:"shown"+i,INSERTED:"inserted"+i,CLICK:"click"+i,FOCUSIN:"focusin"+i,FOCUSOUT:"focusout"+i,MOUSEENTER:"mouseenter"+i,MOUSELEAVE:"mouseleave"+i},d={FADE:"fade",SHOW:"show"},_={TOOLTIP:".tooltip",TOOLTIP_INNER:".tooltip-inner",ARROW:".arrow"},p={HOVER:"hover",FOCUS:"focus",CLICK:"click",MANUAL:"manual"},m=function(){function o(t,e){if(void 0===n)throw new TypeError("Bootstrap tooltips require Popper.js (https://popper.js.org)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}var m=o.prototype;return m.enable=function(){this._isEnabled=!0},m.disable=function(){this._isEnabled=!1},m.toggleEnabled=function(){this._isEnabled=!this._isEnabled},m.toggle=function(e){if(this._isEnabled)if(e){var n=this.constructor.DATA_KEY,i=t(e.currentTarget).data(n);i||(i=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(n,i)),i._activeTrigger.click=!i._activeTrigger.click,i._isWithActiveTrigger()?i._enter(null,i):i._leave(null,i)}else{if(t(this.getTipElement()).hasClass(d.SHOW))return void this._leave(null,this);this._enter(null,this)}},m.dispose=function(){clearTimeout(this._timeout),t.removeData(this.element,this.constructor.DATA_KEY),t(this.element).off(this.constructor.EVENT_KEY),t(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&t(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,null!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},m.show=function(){var e=this;if("none"===t(this.element).css("display"))throw new Error("Please use show on visible elements");var i=t.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){t(this.element).trigger(i);var r=t.contains(this.element.ownerDocument.documentElement,this.element);if(i.isDefaultPrevented()||!r)return;var o=this.getTipElement(),s=a.getUID(this.constructor.NAME);o.setAttribute("id",s),this.element.setAttribute("aria-describedby",s),this.setContent(),this.config.animation&&t(o).addClass(d.FADE);var l="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,c=this._getAttachment(l);this.addAttachmentClass(c);var u=!1===this.config.container?document.body:t(document).find(this.config.container);t(o).data(this.constructor.DATA_KEY,this),t.contains(this.element.ownerDocument.documentElement,this.tip)||t(o).appendTo(u),t(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new n(this.element,o,{placement:c,modifiers:{offset:{offset:this.config.offset},flip:{behavior:this.config.fallbackPlacement},arrow:{element:_.ARROW},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){e._handlePopperPlacementChange(t)}}),t(o).addClass(d.SHOW),"ontouchstart"in document.documentElement&&t(document.body).children().on("mouseover",null,t.noop);var h=function(){e.config.animation&&e._fixTransition();var n=e._hoverState;e._hoverState=null,t(e.element).trigger(e.constructor.Event.SHOWN),n===f.OUT&&e._leave(null,e)};if(t(this.tip).hasClass(d.FADE)){var g=a.getTransitionDurationFromElement(this.tip);t(this.tip).one(a.TRANSITION_END,h).emulateTransitionEnd(g)}else h()}},m.hide=function(e){var n=this,i=this.getTipElement(),r=t.Event(this.constructor.Event.HIDE),o=function(){n._hoverState!==f.SHOW&&i.parentNode&&i.parentNode.removeChild(i),n._cleanTipClass(),n.element.removeAttribute("aria-describedby"),t(n.element).trigger(n.constructor.Event.HIDDEN),null!==n._popper&&n._popper.destroy(),e&&e()};if(t(this.element).trigger(r),!r.isDefaultPrevented()){if(t(i).removeClass(d.SHOW),"ontouchstart"in document.documentElement&&t(document.body).children().off("mouseover",null,t.noop),this._activeTrigger[p.CLICK]=!1,this._activeTrigger[p.FOCUS]=!1,this._activeTrigger[p.HOVER]=!1,t(this.tip).hasClass(d.FADE)){var s=a.getTransitionDurationFromElement(i);t(i).one(a.TRANSITION_END,o).emulateTransitionEnd(s)}else o();this._hoverState=""}},m.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},m.isWithContent=function(){return Boolean(this.getTitle())},m.addAttachmentClass=function(e){t(this.getTipElement()).addClass("bs-tooltip-"+e)},m.getTipElement=function(){return this.tip=this.tip||t(this.config.template)[0],this.tip},m.setContent=function(){var e=this.getTipElement();this.setElementContent(t(e.querySelectorAll(_.TOOLTIP_INNER)),this.getTitle()),t(e).removeClass(d.FADE+" "+d.SHOW)},m.setElementContent=function(e,n){var i=this.config.html;"object"==typeof n&&(n.nodeType||n.jquery)?i?t(n).parent().is(e)||e.empty().append(n):e.text(t(n).text()):e[i?"html":"text"](n)},m.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},m._getAttachment=function(t){return u[t.toUpperCase()]},m._setListeners=function(){var e=this;this.config.trigger.split(" ").forEach(function(n){if("click"===n)t(e.element).on(e.constructor.Event.CLICK,e.config.selector,function(t){return e.toggle(t)});else if(n!==p.MANUAL){var i=n===p.HOVER?e.constructor.Event.MOUSEENTER:e.constructor.Event.FOCUSIN,r=n===p.HOVER?e.constructor.Event.MOUSELEAVE:e.constructor.Event.FOCUSOUT;t(e.element).on(i,e.config.selector,function(t){return e._enter(t)}).on(r,e.config.selector,function(t){return e._leave(t)})}t(e.element).closest(".modal").on("hide.bs.modal",function(){return e.hide()})}),this.config.selector?this.config=s({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},m._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},m._enter=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusin"===e.type?p.FOCUS:p.HOVER]=!0),t(n.getTipElement()).hasClass(d.SHOW)||n._hoverState===f.SHOW?n._hoverState=f.SHOW:(clearTimeout(n._timeout),n._hoverState=f.SHOW,n.config.delay&&n.config.delay.show?n._timeout=setTimeout(function(){n._hoverState===f.SHOW&&n.show()},n.config.delay.show):n.show())},m._leave=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusout"===e.type?p.FOCUS:p.HOVER]=!1),n._isWithActiveTrigger()||(clearTimeout(n._timeout),n._hoverState=f.OUT,n.config.delay&&n.config.delay.hide?n._timeout=setTimeout(function(){n._hoverState===f.OUT&&n.hide()},n.config.delay.hide):n.hide())},m._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},m._getConfig=function(n){return"number"==typeof(n=s({},this.constructor.Default,t(this.element).data(),"object"==typeof n&&n?n:{})).delay&&(n.delay={show:n.delay,hide:n.delay}),"number"==typeof n.title&&(n.title=n.title.toString()),"number"==typeof n.content&&(n.content=n.content.toString()),a.typeCheckConfig(e,n,this.constructor.DefaultType),n},m._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},m._cleanTipClass=function(){var e=t(this.getTipElement()),n=e.attr("class").match(l);null!==n&&n.length&&e.removeClass(n.join(""))},m._handlePopperPlacementChange=function(t){var e=t.instance;this.tip=e.popper,this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},m._fixTransition=function(){var e=this.getTipElement(),n=this.config.animation;null===e.getAttribute("x-placement")&&(t(e).removeClass(d.FADE),this.config.animation=!1,this.hide(),this.show(),this.config.animation=n)},o._jQueryInterface=function(e){return this.each(function(){var n=t(this).data("bs.tooltip"),i="object"==typeof e&&e;if((n||!/dispose|hide/.test(e))&&(n||(n=new o(this,i),t(this).data("bs.tooltip",n)),"string"==typeof e)){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},r(o,null,[{key:"VERSION",get:function(){return"4.1.3"}},{key:"Default",get:function(){return h}},{key:"NAME",get:function(){return e}},{key:"DATA_KEY",get:function(){return"bs.tooltip"}},{key:"Event",get:function(){return g}},{key:"EVENT_KEY",get:function(){return i}},{key:"DefaultType",get:function(){return c}}]),o}();return t.fn[e]=m._jQueryInterface,t.fn[e].Constructor=m,t.fn[e].noConflict=function(){return t.fn[e]=o,m._jQueryInterface},m}(e),g=function(t){var e="scrollspy",n=t.fn[e],i={offset:10,method:"auto",target:""},o={offset:"number",method:"string",target:"(string|element)"},l={ACTIVATE:"activate.bs.scrollspy",SCROLL:"scroll.bs.scrollspy",LOAD_DATA_API:"load.bs.scrollspy.data-api"},c={DROPDOWN_ITEM:"dropdown-item",DROPDOWN_MENU:"dropdown-menu",ACTIVE:"active"},u={DATA_SPY:'[data-spy="scroll"]',ACTIVE:".active",NAV_LIST_GROUP:".nav, .list-group",NAV_LINKS:".nav-link",NAV_ITEMS:".nav-item",LIST_ITEMS:".list-group-item",DROPDOWN:".dropdown",DROPDOWN_ITEMS:".dropdown-item",DROPDOWN_TOGGLE:".dropdown-toggle"},h={OFFSET:"offset",POSITION:"position"},f=function(){function n(e,n){var i=this;this._element=e,this._scrollElement="BODY"===e.tagName?window:e,this._config=this._getConfig(n),this._selector=this._config.target+" "+u.NAV_LINKS+","+this._config.target+" "+u.LIST_ITEMS+","+this._config.target+" "+u.DROPDOWN_ITEMS,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,t(this._scrollElement).on(l.SCROLL,function(t){return i._process(t)}),this.refresh(),this._process()}var f=n.prototype;return f.refresh=function(){var e=this,n=this._scrollElement===this._scrollElement.window?h.OFFSET:h.POSITION,i="auto"===this._config.method?n:this._config.method,r=i===h.POSITION?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight();[].slice.call(document.querySelectorAll(this._selector)).map(function(e){var n,o=a.getSelectorFromElement(e);if(o&&(n=document.querySelector(o)),n){var s=n.getBoundingClientRect();if(s.width||s.height)return[t(n)[i]().top+r,o]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},f.dispose=function(){t.removeData(this._element,"bs.scrollspy"),t(this._scrollElement).off(".bs.scrollspy"),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},f._getConfig=function(n){if("string"!=typeof(n=s({},i,"object"==typeof n&&n?n:{})).target){var r=t(n.target).attr("id");r||(r=a.getUID(e),t(n.target).attr("id",r)),n.target="#"+r}return a.typeCheckConfig(e,n,o),n},f._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},f._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},f._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},f._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var r=this._offsets.length;r--;){this._activeTarget!==this._targets[r]&&t>=this._offsets[r]&&(void 0===this._offsets[r+1]||t<this._offsets[r+1])&&this._activate(this._targets[r])}}},f._activate=function(e){this._activeTarget=e,this._clear();var n=this._selector.split(",");n=n.map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'});var i=t([].slice.call(document.querySelectorAll(n.join(","))));i.hasClass(c.DROPDOWN_ITEM)?(i.closest(u.DROPDOWN).find(u.DROPDOWN_TOGGLE).addClass(c.ACTIVE),i.addClass(c.ACTIVE)):(i.addClass(c.ACTIVE),i.parents(u.NAV_LIST_GROUP).prev(u.NAV_LINKS+", "+u.LIST_ITEMS).addClass(c.ACTIVE),i.parents(u.NAV_LIST_GROUP).prev(u.NAV_ITEMS).children(u.NAV_LINKS).addClass(c.ACTIVE)),t(this._scrollElement).trigger(l.ACTIVATE,{relatedTarget:e})},f._clear=function(){var e=[].slice.call(document.querySelectorAll(this._selector));t(e).filter(u.ACTIVE).removeClass(c.ACTIVE)},n._jQueryInterface=function(e){return this.each(function(){var i=t(this).data("bs.scrollspy");if(i||(i=new n(this,"object"==typeof e&&e),t(this).data("bs.scrollspy",i)),"string"==typeof e){if(void 0===i[e])throw new TypeError('No method named "'+e+'"');i[e]()}})},r(n,null,[{key:"VERSION",get:function(){return"4.1.3"}},{key:"Default",get:function(){return i}}]),n}();return t(window).on(l.LOAD_DATA_API,function(){for(var e=[].slice.call(document.querySelectorAll(u.DATA_SPY)),n=e.length;n--;){var i=t(e[n]);f._jQueryInterface.call(i,i.data())}}),t.fn[e]=f._jQueryInterface,t.fn[e].Constructor=f,t.fn[e].noConflict=function(){return t.fn[e]=n,f._jQueryInterface},f}(e),d=function(t){var e=t.fn.tab,n={HIDE:"hide.bs.tab",HIDDEN:"hidden.bs.tab",SHOW:"show.bs.tab",SHOWN:"shown.bs.tab",CLICK_DATA_API:"click.bs.tab.data-api"},i={DROPDOWN_MENU:"dropdown-menu",ACTIVE:"active",DISABLED:"disabled",FADE:"fade",SHOW:"show"},o={DROPDOWN:".dropdown",NAV_LIST_GROUP:".nav, .list-group",ACTIVE:".active",ACTIVE_UL:"> li > .active",DATA_TOGGLE:'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',DROPDOWN_TOGGLE:".dropdown-toggle",DROPDOWN_ACTIVE_CHILD:"> .dropdown-menu .active"},s=function(){function e(t){this._element=t}var s=e.prototype;return s.show=function(){var e=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&t(this._element).hasClass(i.ACTIVE)||t(this._element).hasClass(i.DISABLED))){var r,s,l=t(this._element).closest(o.NAV_LIST_GROUP)[0],c=a.getSelectorFromElement(this._element);if(l){var u="UL"===l.nodeName?o.ACTIVE_UL:o.ACTIVE;s=t.makeArray(t(l).find(u)),s=s[s.length-1]}var h=t.Event(n.HIDE,{relatedTarget:this._element}),f=t.Event(n.SHOW,{relatedTarget:s});if(s&&t(s).trigger(h),t(this._element).trigger(f),!f.isDefaultPrevented()&&!h.isDefaultPrevented()){c&&(r=document.querySelector(c)),this._activate(this._element,l);var g=function(){var i=t.Event(n.HIDDEN,{relatedTarget:e._element}),r=t.Event(n.SHOWN,{relatedTarget:s});t(s).trigger(i),t(e._element).trigger(r)};r?this._activate(r,r.parentNode,g):g()}}},s.dispose=function(){t.removeData(this._element,"bs.tab"),this._element=null},s._activate=function(e,n,r){var s,l=this,c=(s="UL"===n.nodeName?t(n).find(o.ACTIVE_UL):t(n).children(o.ACTIVE))[0],u=r&&c&&t(c).hasClass(i.FADE),h=function(){return l._transitionComplete(e,c,r)};if(c&&u){var f=a.getTransitionDurationFromElement(c);t(c).one(a.TRANSITION_END,h).emulateTransitionEnd(f)}else h()},s._transitionComplete=function(e,n,r){if(n){t(n).removeClass(i.SHOW+" "+i.ACTIVE);var s=t(n.parentNode).find(o.DROPDOWN_ACTIVE_CHILD)[0];s&&t(s).removeClass(i.ACTIVE),"tab"===n.getAttribute("role")&&n.setAttribute("aria-selected",!1)}if(t(e).addClass(i.ACTIVE),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!0),a.reflow(e),t(e).addClass(i.SHOW),e.parentNode&&t(e.parentNode).hasClass(i.DROPDOWN_MENU)){var l=t(e).closest(o.DROPDOWN)[0];if(l){var c=[].slice.call(l.querySelectorAll(o.DROPDOWN_TOGGLE));t(c).addClass(i.ACTIVE)}e.setAttribute("aria-expanded",!0)}r&&r()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),r=i.data("bs.tab");if(r||(r=new e(this),i.data("bs.tab",r)),"string"==typeof n){if(void 0===r[n])throw new TypeError('No method named "'+n+'"');r[n]()}})},r(e,null,[{key:"VERSION",get:function(){return"4.1.3"}}]),e}();return t(document).on(n.CLICK_DATA_API,o.DATA_TOGGLE,function(e){e.preventDefault(),s._jQueryInterface.call(t(this),"show")}),t.fn.tab=s._jQueryInterface,t.fn.tab.Constructor=s,t.fn.tab.noConflict=function(){return t.fn.tab=e,s._jQueryInterface},s}(e);!function(t){if(void 0===t)throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");var e=t.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1===e[0]&&9===e[1]&&e[2]<1||e[0]>=4)throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(e),t.Util=a,t.Alert=l,t.Button=c,t.Collapse=u,t.Dropdown=h,t.Scrollspy=g,t.Tab=d,t.Tooltip=f,Object.defineProperty(t,"__esModule",{value:!0})});