//chrome.runtime.onMessage.addListener(
chrome.browserAction.onClicked.addListener(function(activeTab){
  console.log(activeTab.id);
  var url  = prompt("URL?", "messenger.com");
  var purpose  = prompt("Purpose?", "POOPING ON THE INTERNET");
  chrome.tabs.create({'url': "http://" + url}, function(tab) {});
  chrome.tabs.create({url: chrome.extension.getURL("purpose.html")}, writePurposeInTab(purpose));      
});


function writePurposeInTab(purpose) {
  return function (tab) {
    //hacky way of making sure the message is sent to the tab after the tab's listener is in place.
    setTimeout(function(){
      console.log("message sent to", tab.id);
      chrome.tabs.sendMessage(tab.id, {"action" : "makeMessage", "content": purpose});
    }, 100);
  }
}
