const gacha = require("simple-gacha");
const characters = require("./characters.json");
const startDash = require('../banners/StartDash.json');

class Rolling {
    constructor() {
        this.rolled = [];
        this.lastReset = new Date();
        this.series = { "starter": startDash };
        this.banners = { "starter": "https://cdn.discordapp.com/attachments/607063189254963220/930110222758993971/WT_Starter_Banner_2.jpg" };
    }
    getBanner(banner) {
        if (this.banners[banner] == null)
            return null;
        return this.banners[banner];
    }
    roll(banner) {
        console.log(banner);
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