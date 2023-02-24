# WT-Gacha-Discord-Bot
A Discord Bot made for a World Trigger Gacha

## Generating Banners
Use the `./create-banners/generateJSfile.js` file to generate an empty "json" file for generation.

Launch the `./create-banners/index.html` file for the webview.

Set the rates at the bottom of the page and generate, output will be printed to the console.

Copy the object using right click and paste it into a banner in `./banners/X.json`.

## Adding Banner
Go to `./utilities/rolling.js`

Import the new banner at the top of the file and add it to this.series under the name you wish to use.

Add a URL to the banner image as well in this.banners.
Go to `./commands/roll.js` and add it to the addChoices function.