This is a fork of https://github.com/rogershen/chrome-regex-search with the following added features:  
1. Multiple regular expressions can be combined into one query (delimited by ~).Matches for each regular expression are highlighted by a different color.By using ~ over |, the | operator can be used within each separate regular expression in the query.In the demo below, note that all digits are the same color because it is a separate regular expression. "Microsoft" and "Internet explorer" are highlighted by the same color as well because these words are separated be | instead of ~ .  
2. Multi-color scrollbar marks.Each match is highlighted on the scrollbar(similar to Chrome Ctrl-F scrollbar) with the same color as the corresponding result.Matches for each regular expression are highlighted by a different color.  
3. To scroll to a match, click on its' scrollbar marker.Works correctly unless on hover over the marker the cursor turns into a pointer that indicates a link, in which case it will load a random link from the page.It's a known issue.  
4. Latest regex query auto fills the search box across the tabs/sessions.When the extension is activated, latest regex query automatically fills the search box.  
5. To search for selected text, activate the extension when the selection is active either by clicking on the icon or through the activation shortcut(it can be set at chrome://extensions/shortcuts).If the search box already contains a query, the selection will be appended with ~ delimiter and will be highlighted differently.  
6. To cycle through the query history, press Up and Down arrows.Alternatively, it is possible to view the history of queries and click on saved queries to add them to the search box. 


## Demo  
![Demo](https://i.imgur.com/pyUtrLu.gif)

Regex: javascript\~web~\d\~Java\b~sun\b\~microsoft|internet explorer  
All digits and several groups of words are highlighted   

## Installation  
1. Go to  https://github.com/Roining/Regex-search-extension/releases/, download Regex-search-extension.zip from latest release.  
2. Unpack the archive.  
3. Go to  chrome://extensions/ , check the "Developer mode" checkbox, click "Load Unpacked", select the src folder in the extension's directory.    
  
OR  
  
1. Clone this repository.    
2. Go to  chrome://extensions/ , check the "Developer mode" checkbox, click "Load Unpacked", select the src folder in the extension's directory.  

The original description is below.  

# Chrome Regex Search

<img src="https://raw.githubusercontent.com/rogershen/chrome-regex-search/master/src/icons/icons_128.png" align="right" style="padding-left: 10px;" />

An extension for Regex Search in lieu of Chrome's CTRL+F.

<img src="https://raw.githubusercontent.com/rogershen/chrome-regex-search/master/google-webstore/popup.png" />
<br />
Instead of writing a program to download a web page to find regex matches, use 
this simple extension to highlight regex matches on the web page dynamically as you type.

Offers customizable highlighting, case-insensitive and instantaneous search in the extension options.

Also, offers a search history that can be configured to the max number of records.

Note that textarea and input elements will not be highlighted as they cannot be styled by CSS3 natively.

## Installation

Go to https://chrome.google.com/webstore/detail/chrome-regex-search/bpelaihoicobbkgmhcbikncnpacdbknn?hl=en&gl=US
Click 'Add to Chrome'

## Screenshots
<img src="https://raw.githubusercontent.com/rogershen/chrome-regex-search/master/google-webstore/googlenews.png" />
Four letter words
<img src="https://raw.githubusercontent.com/rogershen/chrome-regex-search/master/google-webstore/settings.png" />
Customizable settings

## Keyboard Shortcuts
<b>ENTER</b> : select next regex match on page
<br />
<b>SHIFT+ENTER</b> : select previous regex match on page

<b>Instructions to set up a keyboard shortcut to open the popup:</b>
<br />
In your browser, go to chrome://extensions/shortcuts
<br />
Scroll to Chrome Regex Search
<br />
Click 'Keyboard Shortcuts'
<br />
Type your custom command (ie CTRL+SHIFT+F)
<br />
Now whenever, you want to open the popup simply enter your custom command.




## License

Chrome Regex Search is under the MIT license. See the <a href="https://raw.githubusercontent.com/rogershen/chrome-regex-search/master/LICENSE">LICENSE</a> file for details.
