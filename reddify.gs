function openDialog() {
  //This function opens the sidebar where the music player is displayed and controlled
  //It uses whichever sheet the user is targeting to pull links from and displays the html in the Index.html file
  var sheet = SpreadsheetApp.getActive().getActiveSheet().getName();
  var html = HtmlService.createHtmlOutputFromFile('Index').setTitle("You're listening to " + sheet);
  SpreadsheetApp.getUi().showSidebar(html);
}

function doSomeShit() {
  //This is the organizing function that feeds information from our sheet to our interface
  //It retrieves all viable youtube and soundcloud links from the sheet
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  if (sheet.getName().indexOf("r/") != 0) return [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ];
  
  var data = sheet.getRange(2, sheet.getLastColumn(), sheet.getLastRow()-1, 1).getValues();
  var links = [];
  for (var k in data) {
    if (data[k][0].indexOf('youtu') > -1 || data[k][0].indexOf('soundcloud.com') > -1) links.push(data[k][0]);
  }
  return links;
}

function updateAll() {
  //This is a function that loops through each of the sheets and updates ones representing subreddits
  var sheets = SpreadsheetApp.getActive().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getName().indexOf("r/") == 0) scrapeReddit(sheet, 10);
  }
}

function scrapeReddit(sheet, posts) {
  //This function is called by updateAll on each of the subreddits to fetch new posts and log them in the correct sheet
  var REDDIT = sheet.getName();
  if (REDDIT.indexOf("r/") != 0) {
    Logger.log("Incorrect sheet name format. Please rename " + REDDIT + " using the r/subreddit format.");
    SpreadsheetApp.getUi().alert("Incorrect sheet name format. Please rename " + REDDIT + " using the r/subreddit format.");
    return;
  }
  posts = posts || 50; //updating defaults to 50 new posts unless otherwise specified
  var url = "http://www.reddit.com/" + REDDIT + "/new.json?limit=" + posts;
  var success = false;
  //requests to the reddit api don't always go through, so we try 5 times before giving up
  for (var tries = 0; tries < 5; tries++) {
    try {
      var response = UrlFetchApp.fetch(url);
      success = true;
      break;
    }
    catch(err) {
      Logger.log(err);
      Utilities.sleep(5000);
    }
  }
  if (!success) {
    //If you'd like the script to notify you if it runs into an error, 
    //replace <YOUR EMAIL HERE> with your email and remove the two slashes at the beginning of the line
    //MailApp.sendEmail("<YOUR EMAIL HERE>", "Scripts Failure", "Despite your best efforts, your Reddit Update script has failed during a URL fetch request : (");
    return;
  }
  var doc = JSON.parse(response.getContentText()); 
  var entries = doc.data.children;
  var checks = sheet.getRange(2, 4, posts+5, 1).getDisplayValues();
  var toAdd = [],
      next = sheet.getRange("A2").getValue() + 1;
  //We need to figure out if there are new posts and if there are we need to add them to the sheet
  for (var i = entries.length-1; i >= 0; i--) {
    var entry = entries[i].data;
    
    var newEntry = true; //assume the latest post is new
    for (var check = 0; check < checks.length; check++) {
      if (checks[check] == entry.title) {
        //if the title of the post matches one of the posts already cataloged, don't add it again
        newEntry = false;
        break;
      }
    }
    
    if (newEntry) {
      //if it is a new entry, add it to the toAdd array and increment the post number
      toAdd.push([
        next, 
        Utilities.formatDate(new Date(), "America/Los_Angeles", "yyyy-MM-dd"), 
        "=hyperlink(\"http://www.reddit.com/"+ entry.permalink +"\",\"link\")", 
        entry.title, 
        entry.url
      ]);
      next++;
    }
  }
  if (toAdd.length > 0) {
    //if there are entries to add, insert new rows and add the entries
    sheet.insertRowsBefore(2, toAdd.length);
    sheet.getRange(2, 1, toAdd.length, toAdd[0].length).setValues(toAdd);
  }
}

function newSub() {
  //this function is for adding a new subreddit
  var ui = SpreadsheetApp.getUi();
  //we ask the user for the subreddit they'd like to add
  var newSub = ui.prompt(
    "Add New Subreddit", 
    "Type in name of subreddit you want to add [r/subreddit]", 
    ui.ButtonSet.OK_CANCEL
  );
  var res = newSub.getResponseText();
  if (newSub.getSelectedButton() == ui.Button.CANCEL || res == "") return; //if they cancel the request or don't provide a sub, abort
  if (res.indexOf("r/") != 0) {
    //if they don't provide a valid subreddit in the "r/" format, tell them and then abort
    ui.alert("Incorrect sheet name format. Please try again using the r/subreddit format. Your entry: " + res);
    return;
  }
  //add new sheet for the subreddit they choose and add the headers
  var s = SpreadsheetApp.getActive();
  var sheets = s.getSheets();
  s.insertSheet(res, sheets.length);
  var sheet = s.getSheetByName(res);
  sheet.getRange(1, 1, 1, 5)
    .setValues([["Post", "Date", "Reddit", "Title", "Media Link"]])
    .setBackgrounds([["black","black","black","black","black"]])
    .setFontColors([["white","white","white","white","white"]])
    .setFontWeights([["bold","bold","bold","bold","bold"]]);
  
  scrapeReddit(sheet, 50); //fetch 50 posts to start with
}

function onOpen() {
  //this function runs when you open the sheet. It adds menus to the toolbar.
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Reddify")
    .addSubMenu(ui.createMenu("SideBar").addItem("Open", "openDialog"))
    .addSubMenu(ui.createMenu("Reddit").addItem("Add new subreddit", "newSub").addItem("Fetch posts", "updateAll"))
  .addToUi();
}
