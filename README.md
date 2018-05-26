# reddify
Listen to music or watch videos from your favorite subreddits

### Purpose
I follow some music subreddits and was frustrated that there wasn't a playlist feature for all of the soundcloud and youtube links that get posted. While there are some websites out there that have that functionality, I thought it might be fun to build my own.

### How to Use
Reddify (a very fun and original name that isn't stolen) is a Google Sheet Script that combs chosen subreddits for soundcloud and youtube links, organizes them into a playlist, and then plays them in a video player. 

1. Create a Google Sheet
2. Tools > Script Editor
3. Copy the contents of `reddify.gs` into the script window that opens
4. File > New > HTML File
5. Name the file `index.html` and overwrite its contents with the provided `index.html` file
6. In the index file, replace <YOUR CLIENT ID> with your soundcloud client ID (use this [link](https://stackoverflow.com/questions/40992480/getting-a-soundcloud-api-client-id) to find your client ID)
7. Save the files, go back to your Sheet and refresh. You should see a "Reddify" menu show up in the toolbar
8. In the "Reddit" menu, click "New Sub" and input a subreddit like r/trap or r/futurebass
    * You will proabably need to give permission for the Script to run at this point. Google makes this difficult for some reason. Scroll down in the prompt that appears and click "Advanced". Scroll all the way down again and click "Go To ___ (unsafe)". I swear it's safe.
9. A new sheet should be added - go to that sheet and click "Open" in the "SideBar" menu. This should open the video player and your first video should start playing
  
### Other Important Things
To continue getting new music, you currently need to setup Google Script triggers to keep adding new reddit posts to your sheets. To do this:

1. Reopen the "Script Editor" in the "Tools" menu
2. Edit > Current Project's Triggers
3. Add a New Trigger. Select the function `updateAll` and set the trigger to fire every 30 minutes or up to every few hours depending how active your subreddits are

Feel free to add as many subreddits as you want. As your trigger keeps adding posts, your playlist for each sub will continue growing. Enjoy a crowd-curated playlist.

### The Future
The future can be hard to predict. I've had this project completed for almost a year now. Thought about launching it as its own website, but got lazy and didn't really want to make it into more than what it needed to be. So I'm publishing it here for whoever wants to use it. Updates that may or may not be complete lies I tell myself to feel like I have goals include:
* Mixed playlists - play music from multiple subreddits at the same time
* A Reddify ICO - ReddifyCoin (RDFY) is a peer-to-peer digital currency secured by a highly decentralized and energy efficient dPOS blockchain poised to revolutionize the music industry by lazily aggregating other platforms' content in a fancy database and capitalizing on uninformed investors riding the hype. We're looking to raise about $50M so we can moon and buy lambos when we 10x in a month despite not having an actual working product.
* New themes!
