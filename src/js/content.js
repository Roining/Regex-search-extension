/*** CONSTANTS ***/
var ELEMENT_NODE_TYPE = 1;
var TEXT_NODE_TYPE = 3;
var UNEXPANDABLE = /(script|style|svg|audio|canvas|figure|video|select|input|textarea)/i;
var HIGHLIGHT_TAG = 'highlight-tag';
var HIGHLIGHT_CLASS = 'highlighted';
var SELECTED_CLASS = 'selected';
var DEFAULT_MAX_RESULTS = 500;
var DEFAULT_HIGHLIGHT_COLOR = '#ffff00';
var DEFAULT_SELECTED_COLOR = '#ff9900';
var DEFAULT_TEXT_COLOR = '#000000';
var DEFAULT_CASE_INSENSITIVE = false;
/*** CONSTANTS ***/

/*** VARIABLES ***/
var searchInfo;
/*** VARIABLES ***/

/*** LIBRARY FUNCTIONS ***/
//window.HTMLElement.prototype.scrollIntoView = function() {};
Element.prototype.documentOffsetTop = function () {
  return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
};
Element.prototype.visible = function() {
    return (!window.getComputedStyle(this) || window.getComputedStyle(this).getPropertyValue('display') == '' ||
           window.getComputedStyle(this).getPropertyValue('display') != 'none')
}
/*** LIBRARY FUNCTIONS ***/


/*** FUNCTIONS ***/
/* Initialize search information for this tab */
function initSearchInfo(pattern) {
  var pattern = typeof pattern !== 'undefined' ? pattern : '';
  searchInfo = {
    regexString : pattern,
    selectedIndex : 0,
    highlightedNodes : [],
    length : 0
  }
}

/* Send message with search information for this tab */
function returnSearchInfo(cause) {
  chrome.runtime.sendMessage({
    'message' : 'returnSearchInfo',
    'regexString' : searchInfo.regexString,
    'currentSelection' : searchInfo.selectedIndex,
    'numResults' : searchInfo.length,
    'cause' : cause
  });
}

/* Check if the given node is a text node */
function isTextNode(node) {
  return node && node.nodeType === TEXT_NODE_TYPE;
}

/* Check if the given node is an expandable node that will yield text nodes */
function isExpandable(node) {
  return node && node.nodeType === ELEMENT_NODE_TYPE && node.childNodes &&
         !UNEXPANDABLE.test(node.tagName) && node.visible();
}

/* Highlight all text that matches regex */
function highlight(regex, highlightColor, selectedColor, textColor, maxResults) {
  returnSearchInfo('highlightselect'); //TODO??
  console.log(highlightColor);
  console.log(regex);
  function highlightRecursive(node) {
    if(searchInfo.length >= maxResults){
      return;
    }
    if (isTextNode(node)) {
      
      
      var index = node.data.search(regex);
      if (index >= 0 && node.data.length > 0) {
        var matchedText = node.data.match(regex)[0];
        var matchedTextNode = node.splitText(index);
        matchedTextNode.splitText(matchedText.length);
        var spanNode = document.createElement(HIGHLIGHT_TAG);
        spanNode.className = HIGHLIGHT_CLASS;
        spanNode.style.backgroundColor = highlightColor;
        spanNode.style.color = textColor;
        //spanNode.style.zIndex = '2147483647';
        spanNode.appendChild(matchedTextNode.cloneNode(true));
        matchedTextNode.parentNode.replaceChild(spanNode, matchedTextNode);
        searchInfo.highlightedNodes.push(spanNode);
        searchInfo.length += 1;
        const clientRect = spanNode.getBoundingClientRect();
        if (clientRect.width && clientRect.height) {
          const scrollMarker = document.createElement('div');
          scrollMarker.className = 'highlighted_selection_scroll_marker';
          scrollMarker.id = getRandomColor().toString();
          scrollMarker.style.height = '2px';
         // scrollMarker.style.webkitTransform = "rotate(0deg)";//TODO:check if corret
          scrollMarker.style.width = '16px';
          scrollMarker.style.border = '1px solid grey';
          scrollMarker.style.boxSizing = 'content-box';
          scrollMarker.style.backgroundColor = highlightColor;
          scrollMarker.style.position = 'fixed';
          scrollMarker.style.top = `${window.innerHeight * (clientRect.top + (clientRect.top - clientRect.bottom) / 2 + window.scrollY) / document.body.clientHeight}px`;
          scrollMarker.style.right = '0px';
          scrollMarker.style.zIndex = '2147483647';
          spanNode.appendChild(scrollMarker);
        }
        return 1;
      }
    } else if (isExpandable(node)) {
        var children = node.childNodes;
        for (var i = 0; i < children.length; ++i) {
          var child = children[i];
          i += highlightRecursive(child);
        }
    }
    
    return 0;
  }
  highlightRecursive(document.getElementsByTagName('body')[0]);
};

/* Remove all highlights from page */
function removeHighlight() {
   while (node = document.body.querySelector(HIGHLIGHT_TAG + '.' + HIGHLIGHT_CLASS)) {
    document.querySelectorAll('.highlighted_selection_scroll_marker').forEach(element => {
      console.log("deleteeee");
     element.parentNode.removeChild(element); 
    }); 
    node.outerHTML = node.innerHTML;
     /* document.querySelectorAll('.highlighted_selection_scroll_marker').forEach(element => {
      console.log("deleteeee");
      document.body.removeChild(element); 
    }); 
  */
  }
    while (node = document.body.querySelector(HIGHLIGHT_TAG + '.' + SELECTED_CLASS)) {
      document.querySelectorAll('.highlighted_selection_scroll_marker').forEach(element => {
        element.parentNode.removeChild(element); 
      });
    node.outerHTML = node.innerHTML;
    /*   document.querySelectorAll('.highlighted_selection_scroll_marker').forEach(element => {
      document.body.removeChild(element);
    });
 */
    
    
  } 
};

function rainbow(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var color = '';
  switch(step){
      case 0: color = '#FFD700'; break;
      case 1: color = '#ADFF2F'; break;
      case 2: color = '#87CEEB'; break;
      case 3: color = '#FF0000'; break;
      case 4: color = '#EE82EE'; break;
      case 5: color = '#FFA500'; break;
      case 6: color = '#008000'; break;
      case 7: color = '#4169E1'; break;
      case 8: color = '#00FFFF'; break;
      case 9: color = '#F0E68C'; break;
      case 10: color = '#BC8F8F'; break;
      case 11: color = '#BC8F8F'; break;
      case 12: color = '#BC8F8F'; break;
      case 13: color = '#BC8F8F'; break;
      case 14: color = '#BC8F8F'; break;
  }
  //var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  return (color);
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
/* Scroll page to given element */
function scrollToElementMax(element) {
    element.scrollIntoView();
    var top = element.documentOffsetTop() - ( window.innerHeight / 2 );
    window.scrollTo( 0, Math.max(top, window.pageYOffset - (window.innerHeight/2))) ;
}



function scrollToElementMin(element) {
  element.scrollIntoView();
  var top = element.documentOffsetTop() - ( window.innerHeight / 2 );
  console.log(top);
  window.scrollTo( 0, Math.min(top, window.pageYOffset - (window.innerHeight/2))) ;
}

/* Select first regex match on page */
function selectFirstNode(selectedColor) {  
//returnSearchInfo('selectNode');
var length =  searchInfo.length;
if(length > 0) {
  searchInfo.highlightedNodes[0].className = SELECTED_CLASS;
  searchInfo.highlightedNodes[0].style.backgroundColor = selectedColor;
  parentNode = searchInfo.highlightedNodes[0].parentNode;
  if (parentNode.nodeType === 1) {
    parentNode.focus();
  } else if (parentNode.parentNode.nodeType == 1) {
    parentNode.parentNode.focus();
  }

  //scrollToElement(searchInfo.highlightedNodes[0]);
}

}


/* Helper for selecting a regex matched element */
function selectNode(highlightedColor, selectedColor, getNext) {
  var test = document.querySelectorAll('.highlighted_selection_scroll_marker');
console.log(test);
  var length = searchInfo.length;
  if(length > 0) {
    searchInfo.highlightedNodes[searchInfo.selectedIndex].className = HIGHLIGHT_CLASS;
    searchInfo.highlightedNodes[searchInfo.selectedIndex].style.backgroundColor = highlightedColor;
      if(getNext) {
        if(searchInfo.selectedIndex === length - 1) {
          searchInfo.selectedIndex = 0;
        } else {
          searchInfo.selectedIndex += 1;
        }
      } else {
        if(searchInfo.selectedIndex === 0) {
          searchInfo.selectedIndex = length - 1;
        } else {
          searchInfo.selectedIndex -= 1;
        }
      }
    searchInfo.highlightedNodes[searchInfo.selectedIndex].className = SELECTED_CLASS;
    searchInfo.highlightedNodes[searchInfo.selectedIndex].style.backgroundColor = selectedColor;
    parentNode = searchInfo.highlightedNodes[searchInfo.selectedIndex].parentNode;
    if (parentNode.nodeType === 1) {
      parentNode.focus();
    } else if (parentNode.parentNode.nodeType == 1) {
      parentNode.parentNode.focus();
    }
    returnSearchInfo('selectNode');
    console.log(searchInfo.highlightedNodes[searchInfo.selectedIndex]);
    scrollToElementMax(searchInfo.highlightedNodes[searchInfo.selectedIndex]);
    
  }
}
/* Forward cycle through regex matched elements */
function selectNextNode(highlightedColor, selectedColor) {
  selectNode(highlightedColor, selectedColor, true);
}

/* Backward cycle through regex matched elements */
function selectPrevNode(highlightedColor, selectedColor) {
  selectNode(highlightedColor, selectedColor, false);
}

/* Validate that a given pattern string is a valid regex */
function validateRegex(pattern) {
  try{
    var regex = new RegExp(pattern);
    return regex;
  } catch(e) {
    return false;
  }
  
  /* Find and highlight regex matches in web page from a given regex string or pattern */
}
function search(regexString, configurationChanged) {
  
  var regex = validateRegex(regexString);
  
  if (regex && regexString != '' && (configurationChanged || regexString !== searchInfo.regexString)) { // new valid regex string
    removeHighlight();
    chrome.storage.local.get({
      'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
      'selectedColor' : DEFAULT_SELECTED_COLOR,
      'textColor' : DEFAULT_TEXT_COLOR,
      'maxResults' : DEFAULT_MAX_RESULTS,
      'caseInsensitive' : DEFAULT_CASE_INSENSITIVE},
      function(result) {
        initSearchInfo(regexString);
        if(result.caseInsensitive){
          regex = new RegExp(regexString, 'i');
        }
        var del = '~';
        //var regexCollection = regex.toString().split(del);
        var regexCollection = regex.source.split(del);
        for(var i=0;i<regexCollection.length;i++){
          if(result.caseInsensitive){
            var re = new RegExp(regexCollection[i],'i');
          }
          else{

            re = new RegExp(regexCollection[i]);
          }
          
          chrome.storage.local.set({
            'highlightColor' : result.highlightColor,
            
          });
          
          console.log(re);
          console.log(regex);
          highlight(re,  rainbow(7,i), result.selectedColor, result.textColor, result.maxResults);
        }
      //selectFirstNode(result.selectedColor);
        returnSearchInfo('search');
      }
    );
  } else if (regex && regexString != '' && regexString === searchInfo.regexString) { // elements are already highlighted
    chrome.storage.local.get({
      'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
      'selectedColor' : DEFAULT_SELECTED_COLOR},
      function(result) {
        selectNextNode(result.highlightColor, result.selectedColor);
      }
    );
  } else { // blank string or invalid regex
    removeHighlight();
    initSearchInfo(regexString);
    returnSearchInfo('search');
  }
}

/*** FUNCTIONS ***/

/*** LISTENERS ***/
/* Received search message, find regex matches */
document.addEventListener('click',function(e){
  console.log('uuuuuuuuuuuuuuuuuu');
  if(e.target.className == 'highlighted_selection_scroll_marker'){
    console.log(e.target.id);
    var temp = document.getElementById(e.target.id).parentElement;
    console.log(temp);
    /* document.getElementById(e.target.id).scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
  }); */
  var rect = temp.getBoundingClientRect();
  if(rect.top > 0){

    scrollToElementMax(temp);
  }
  else{
    scrollToElementMin(temp);
  }
   }
}); 
/* window.onload=function(){
  
  document.getElementById('highlighted_selection_scroll_marker').addEventListener("click",function(e) {
    
  });
} */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ('search' == request.message) {
    
    search(request.regexString, request.configurationChanged);
        
  }
  /* Received selectNextNode message, select next regex match */
  else if ('selectNextNode' == request.message) {
    chrome.storage.local.get({
      'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
      'selectedColor' : DEFAULT_SELECTED_COLOR
      },
      function(result) {
        selectNextNode(result.highlightColor, result.selectedColor);
      }
    );
  }
  /* Received selectPrevNode message, select previous regex match */
  else if ('selectPrevNode' == request.message) {
    chrome.storage.local.get({
      'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
      'selectedColor' : DEFAULT_SELECTED_COLOR
      },
      function(result) {
        selectPrevNode(result.highlightColor, result.selectedColor);
      }
    );
  }
  else if ('copyToClipboard' == request.message) {
    var clipboardHelper = document.createElement('textarea');
    try {
      var text = searchInfo.highlightedNodes.map(function (n) {
        return n.innerText;
      }).join('\n');
      clipboardHelper.appendChild(document.createTextNode(text));
      document.body.appendChild(clipboardHelper);
      clipboardHelper.select();
      document.execCommand('copy');
    } finally {
      document.body.removeChild(clipboardHelper);
    }
  }
  /* Received getSearchInfo message, return search information for this tab */
  else if ('getSearchInfo' == request.message) {
    
    
  
   if(window.getSelection().toString().length){
    var query = window.getSelection().toString().trim();
    
    
    sendResponse({message: query});
  }
    else{
    sendResponse({message: ""});
  }
    returnSearchInfo('getSearchInfo');
  }
});

/*** LISTENERS ***/


/*** INIT ***/
initSearchInfo();
/*** INIT ***/
