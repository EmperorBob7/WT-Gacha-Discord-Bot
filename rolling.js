const gacha = require("simple-gacha");
const characters = require("./characters.json");
const startDash = require('./banners/StartDash.json');

class Rolling {
    constructor() {
        this.rolled = [];
        this.lastReset = new Date();
        this.series = { "starter": startDash };
        this.banners = { "starter": "https://cdn.discordapp.com/attachments/607063189254963220/849274715482488862/Untitled-1.png" };
    }
    getBanner(banner) {
        if (this.banners[banner] == null)
            return null;
        return this.banners[banner];
    }
    roll(banner) {
        if (this.series[banner] == null)
            return null;
        return gacha.simple(this.series[banner]);
    }
    getCharacter(id) {
        console.log(id);
        return characters[id];
    }
}
module.exports = Rolling;