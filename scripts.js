/*let request = new XMLHttpRequest();

request.open('GET', 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/RiotSchmick?api_key=RGAPI-c90a6ee2-aef5-4bdb-b4fb-834ae9636466', true);

request.onload = function()
{
    let data = JSON.parse(this.response);
    
    data.forEach(obj =>{
        console.log(obj.title);
    })
}

request.send();*/




//Twitch Info
const twitchURL = "https://api.twitch.tv/kraken";
const clientID = "4gqmz463yaeixhvuvwuposq1j5maxb";

//League Info
const leagueURL = "https://cors-anywhere.herokuapp.com/https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let summonerName = "Jeporite";
const leagueKey = "?api_key=RGAPI-bd5e2c58-7543-48f1-8d58-be0c9e2aeeeb";//Key needs to be updated every 24 hours
const leagueMatchURL = "https://cors-anywhere.herokuapp.com/https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/";

const leagueDataURL = "https://ddragon.leagueoflegends.com/cdn/"
const leagueCurrentPatch = 9.9;

let leagueChampionData = "";
let leagueAccountId = "";

//Save Search terms
const nameKey = "Name";
const champKey = "Champion"
const storedSummoner = localStorage.getItem(nameKey);
const storedChampion = localStorage.getItem(champKey);
let championName = "";

let championArr = [];
let streamers = ["Imaqtpie", "Voyboy", "Scarra", "Nightblue3", "Aphromoo", "Shiphtur", "Meteos", "TFBlade", "WildTurtle", "Pobelter"];

const app = new Vue({
	el: '#app',
	data:
    {
        title:"Top League of Legends Streams"
	},
	mounted() {
		this.initChampionArr();
		this.displayStreams();
        if(storedSummoner)
            {
                summonerName = storedSummoner;
            }
        if(storedChampion)
            {
                championName = storedChampion;
            }
	},
	methods:{
        
        //Twitch Stream Data
		displayStreams: function() {
			url = twitchURL + "/streams/?game=League of Legends" + "&client_id=" + clientID;
			$.getJSON(url, function(data) {
				let streamer = "";
				let streamURL = "";
				for (let i = 0; i < 25; i++) {
					streamer = data.streams[i].channel.name;
					streamURL = "http://twitch.tv/" + streamer;
					streamer = streamer.charAt(0).toUpperCase() + streamer.slice(1);
					document.querySelector('#streams').innerHTML += "<li> <a href='" + streamURL + "'>" + streamer + '</a>' + ' (Current Viewers: ' + data.streams[i].viewers + ')</li>';
					
				}
			});
		},
        
        //LoL Account Data
        getLeagueData: function(){
            if(document.querySelector("#summonerNameInput").value != "")
                {
                    summonerName = document.querySelector("#summonerNameInput").value;
                    championName = document.querySelector("#championNameInput").value;
                }
            else
            {
                summonerName = "RiotSchmick";
            }
			
			//let query = encodeURIComponent("summonerName") + "=" + encodeURIComponent(summonerName);
			//let proxy_url = proxy + '?' + query;
			//console.log(proxy_url);
			
			/**$.ajax({
			type: "GET",
			url: proxy,
			data: {'summonerName': summonerName}
			});**/
			
			
            url = leagueURL + summonerName + leagueKey;
            $.getJSON(url, function(data){
                    //console.log(data.name);
                    //console.log(data.profileIconId);
                    leagueAccountId = data.accountId;
					app.getChampionData();
                    app.getLeagueMatchData();
					
					
					for (i in championArr) {
						championArr[i].getSummonerList();
					}
					
                    localStorage.setItem(nameKey, summonerName);
                    localStorage.setItem(champKey, championName);
                })
        },
        
        //LoL Match Data
        getLeagueMatchData: function(){
            url = leagueMatchURL + leagueAccountId + leagueKey;
            $.getJSON(url, function(data){
                    document.querySelector("#matchHistory").innerHTML = "<tr><th>#</th><th>Champion</th><th>Role</th><th>Recommended Streamer</th></tr>";
                    for(let i=0; i<document.querySelector("#searchLength").value; i++)
                        {
                            if(data.matches[i] != null)
                                {
                                    if(document.querySelector("#championNameInput").value=="" || document.querySelector("#championNameInput").value==getChampionByID(data.matches[i].champion).name)
                                        {
											let recommendStream = [];
											for (let j in championArr[data.matches[i].champion].getSummonerList()) {
												recommendStream.push(j);
											}
											if (recommendStream.length != 0) {
												recommendStream = recommendStream[Math.floor(Math.random() * recommendStream.length)];
												recommendStream = "<a href='http://twitch.tv/" + recommendStream + "'>" + recommendStream + "</a>";
											}
											else {
												recommendStream = "No Streams :("
											}
											
											
                                            document.querySelector("#matchHistory").innerHTML += "<tr><th>" + (i + 1) + "<td>" + getChampionByID(data.matches[i].champion).name + "</td><td>" + data.matches[i].role + "</td><td>" + recommendStream + "</td></tr>";
                                        }
                                }
                        }
                    //console.log(data.matches);
            })
        },
		
		getChampionData: function(){
			url = leagueDataURL + leagueCurrentPatch + ".1/data/en_US/champion.json";
			$.getJSON(url, function(data){
				
				leagueChampionData = data.data;
				
				
				
				
				//console.log(data.data);
            })
		},
		
		initChampionArr: function(){
			url = leagueDataURL + leagueCurrentPatch + ".1/data/en_US/champion.json";
			$.getJSON(url, function(data){
				for (i in data.data) {
					let champ = new Champion(data.data[i].id, data.data[i].key);
					championArr[data.data[i].key] = champ;
				}
				
				
			})
			
				
			for (let i = 0; i < streamers.length; i++) {
				let streamerID = "";
				url = leagueURL + streamers[i] + leagueKey;
				$.getJSON(url, function(data){
					streamerID = data.accountId;
					url = leagueMatchURL + streamerID + leagueKey;
					$.getJSON(url, function(data){
						for (let j = 0; j < data.matches.length; j++) {
							championArr[data.matches[j].champion].addSummoner(streamers[i]);
						}
					})
				})
			}
			
		}
		
	} // end methods
});

function getChampionByID(id) {
	for (i in leagueChampionData) {
		if (leagueChampionData[i].key == id) {
			//console.log(leagueChampionData[i]);
			return leagueChampionData[i];
		}
	}
}

class Champion {
	constructor(name, id) {
		this.summonerList = [];
		this.name = name;
		this.id = id;
	}
	
	addSummoner(name) {
		if (name in this.summonerList) {
			this.summonerList[name]++;
		}
		else {
			this.summonerList[name] = 1;
			this.length++;
		}		
	}
	
	getSummonerList() {
		for (i in this.summonerList) {
			if (this.summonerList[i] <= 2) { //Removes pro players with 2 or fewer games on the champion - casuals!
				delete this.summonerList[i];
				//this.length--;
			}
		}
		return this.summonerList;
	}
}

window.onload = function(e){
    if(summonerName != null)
        {
            document.querySelector("#summonerNameInput").value = summonerName;
            document.querySelector("#championNameInput").value = championName;
            app.getLeagueData();
        }
}