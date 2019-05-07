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
const leagueKey = "?api_key=RGAPI-d217609f-57c6-4595-b51e-9e43f93dd43d";//Key needs to be updated every 24 hours
const leagueMatchURL = "https://cors-anywhere.herokuapp.com/https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/";

const leagueDataURL = "http://ddragon.leagueoflegends.com/cdn/"
const leagueCurrentPatch = 9.9;

let leagueChampionData = "";
let leagueAccountId = "";

const app = new Vue({
	el: '#app',
	data:
    {
        title:"Top League of Legends Streams"
	},
	mounted() {
		this.displayStreams();
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
                    console.log(data.name);
                    console.log(data.profileIconId);
                    leagueAccountId = data.accountId;
					app.getChampionData();
                    app.getLeagueMatchData();
                })
        },
        
        //LoL Match Data
        getLeagueMatchData: function(){
            url = leagueMatchURL + leagueAccountId + leagueKey;
            $.getJSON(url, function(data){
                    document.querySelector("#matchHistory").innerHTML = "<tr><th>#</th><th>Champion</th><th>Role</th><th>Timestamp</th></tr>";
                    for(let i=0; i<document.querySelector("#searchLength").value; i++)
                        {
                            if(data.matches[i] != null)
                                {
                                    document.querySelector("#matchHistory").innerHTML += "<tr><th>" + (i + 1) + "<td>" + getChampionByID(data.matches[i].champion).name + "</td><td>" + data.matches[i].role + "</td><td>" + data.matches[i].timestamp + "</td></tr>";
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