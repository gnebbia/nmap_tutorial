;if(CloudflareApps.matchPage(CloudflareApps.installs['ZVOO62TtAjhu'].URLPatterns)){(function(){"use strict"
if(!window.addEventListener)return
var options=CloudflareApps.installs['ZVOO62TtAjhu'].options
var element
function getMaxZIndex(){var max=0
var elements=document.getElementsByTagName('*')
Array.prototype.slice.call(elements).forEach(function(element){var zIndex=parseInt(document.defaultView.getComputedStyle(element).zIndex,10)
max=zIndex?Math.max(max,zIndex):max})
return max}
function inIframe(){try{if("ZVOO62TtAjhu"==='preview'){return window.top!==window.parent.parent}
return window.self!==window.top}catch(e){return true}}
function updateElement(){var localStorageValid=localStorage.tibrrCookieConsent&&new Date(parseInt(localStorage.tibrrCookieConsent,10))>=new Date()
if((!inIframe())&&("ZVOO62TtAjhu"==='preview'||((localStorageValid===false)||(localStorageValid===undefined)))){for(var option in options){if(option===undefined)return false}
let popupLocation={"selector":"body","method":"prepend"}
if(options.popupPositioning=="static"){popupLocation=options.popupLocation}
element=CloudflareApps.createElement(popupLocation,element)
element.setAttribute('app','tibrr-cookie-consent')
element.style.backgroundColor=options.backgroundColor
element.style.opacity=options.backgroundOpacity
if(options.location=='top'){element.style.top='0'}else{element.style.bottom='0'}
element.style.zIndex=(options.popupPositioning=="static")?element.style.zIndex:getMaxZIndex()+1
element.style.position=options.popupPositioning
var elementContainer=document.createElement('DIV')
elementContainer.className='tibrr-cookie-consent-container'
if(options.splitTextAndButton){elementContainer.style.justifyContent="space-between"}else{elementContainer.style.justifyContent="center"}
element.appendChild(elementContainer)
var elementTextLink=document.createElement("a")
elementTextLink.textContent=options.textLink
elementTextLink.title=options.textLink
elementTextLink.href=options.textLinkUrl
if(options.textLinkNewTab){elementTextLink.target="_blank"}
var elementText=document.createElement("DIV")
elementText.className='tibrr-cookie-consent-text'
elementText.textContent=options.message+' '
elementText.style.fontSize=options.textSize.value+options.textSize.unit
elementText.style.color=options.textColor
elementText.appendChild(elementTextLink)
var elementButtonContainer=document.createElement('DIV')
elementButtonContainer.className='tibrr-cookie-consent-button'
if(options.buttonLocation=="right"){elementContainer.appendChild(elementText)
elementContainer.appendChild(elementButtonContainer)}else if(options.buttonLocation=="left"){elementContainer.appendChild(elementButtonContainer)
elementContainer.appendChild(elementText)}
var elementButton=document.createElement('BUTTON')
elementButton.textContent=options.buttonText
elementButton.style.borderColor=options.buttonBorderColor
elementButton.style.fontSize=options.buttonTextSize.value+options.buttonTextSize.unit
elementButtonContainer.appendChild(elementButton)
var elementStyle=document.createElement('STYLE')
elementStyle.innerHTML='cloudflare-app[app="tibrr-cookie-consent"] > .tibrr-cookie-consent-container > .tibrr-cookie-consent-button > button {background-color: '+options.buttonColor+'; color: '+options.buttonTextColor+';} cloudflare-app[app="tibrr-cookie-consent"] > .tibrr-cookie-consent-container > .tibrr-cookie-consent-button > button:hover {background-color: '+options.buttonHoverColor+'; color: '+options.buttonHoverTextColor+';} cloudflare-app[app="tibrr-cookie-consent"] > .tibrr-cookie-consent-container > .tibrr-cookie-consent-text > a {color: '+options.textLinkColor+'} cloudflare-app[app="tibrr-cookie-consent"] > .tibrr-cookie-consent-container > .tibrr-cookie-consent-text > a:hover {color: '+options.textLinkHoverColor+'}';element.appendChild(elementStyle)
elementButton.onclick=function(){if("ZVOO62TtAjhu"!='preview'){element.style.display='none'
var askAgainIn=new Date()
if(options.cookieLifetime){askAgainIn.setDate(askAgainIn.getDate()+30)}else{askAgainIn.setDate(askAgainIn.getDate()+365)}
localStorage.tibrrCookieConsent=askAgainIn.getTime()}}}}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",updateElement)}else{updateElement()}
window.CloudflareApps.installs['ZVOO62TtAjhu'].scope={setOptions:function setOptions(nextOptions){options=nextOptions
updateElement()}}}())};(function(){try{var link=document.createElement('link');link.rel='stylesheet';link.href='data:text/css;charset=utf-8;base64,Y2xvdWRmbGFyZS1hcHBbYXBwPSJ0aWJyci1jb29raWUtY29uc2VudCJdIHsNCglmb250LXNpemU6IDEuMmVtOw0KCXdpZHRoOiAxMDAlOw0KCWxlZnQ6IDA7DQp9DQpjbG91ZGZsYXJlLWFwcFthcHA9InRpYnJyLWNvb2tpZS1jb25zZW50Il0gPiAudGlicnItY29va2llLWNvbnNlbnQtY29udGFpbmVyIHsNCglkaXNwbGF5OiAtd2Via2l0LWZsZXg7DQogICAgZGlzcGxheTogZmxleDsNCglwYWRkaW5nOiAwLjVlbTsNCiAgICAtd2Via2l0LWFsaWduLWl0ZW1zOiBjZW50ZXI7DQogICAgYWxpZ24taXRlbXM6IGNlbnRlcjsNCiAgICAtd2Via2l0LWZsZXgtd3JhcDogbm93cmFwOw0KICAgIGZsZXgtd3JhcDogbm93cmFwOw0KfQ0KY2xvdWRmbGFyZS1hcHBbYXBwPSJ0aWJyci1jb29raWUtY29uc2VudCJdID4gLnRpYnJyLWNvb2tpZS1jb25zZW50LWNvbnRhaW5lciA+IGRpdiB7DQoJbWFyZ2luOiAwLjVlbTsNCn0NCmNsb3VkZmxhcmUtYXBwW2FwcD0idGlicnItY29va2llLWNvbnNlbnQiXSA+IC50aWJyci1jb29raWUtY29uc2VudC1jb250YWluZXIgPiAudGlicnItY29va2llLWNvbnNlbnQtdGV4dCB7DQoJdGV4dC1hbGlnbjogY2VudGVyOw0KfQ0KY2xvdWRmbGFyZS1hcHBbYXBwPSJ0aWJyci1jb29raWUtY29uc2VudCJdID4gLnRpYnJyLWNvb2tpZS1jb25zZW50LWNvbnRhaW5lciA+IC50aWJyci1jb29raWUtY29uc2VudC1idXR0b24gew0KCXRleHQtYWxpZ246IHJpZ2h0Ow0KfQ0KY2xvdWRmbGFyZS1hcHBbYXBwPSJ0aWJyci1jb29raWUtY29uc2VudCJdID4gLnRpYnJyLWNvb2tpZS1jb25zZW50LWNvbnRhaW5lciA+IC50aWJyci1jb29raWUtY29uc2VudC1idXR0b24gPiBidXR0b24gew0KCWJvcmRlci1yYWRpdXM6IDAuNWVtOw0KCWJvcmRlcjogMC4wNWVtIHNvbGlkOw0KCXBhZGRpbmc6IDAuNGVtIDFlbTsNCn0NCmNsb3VkZmxhcmUtYXBwW2FwcD0idGlicnItY29va2llLWNvbnNlbnQiXSA+IC50aWJyci1jb29raWUtY29uc2VudC1jb250YWluZXIgPiAudGlicnItY29va2llLWNvbnNlbnQtYnV0dG9uID4gYnV0dG9uOmhvdmVyIHsNCgljdXJzb3I6IHBvaW50ZXI7DQp9';document.getElementsByTagName('head')[0].appendChild(link);}catch(e){}})();