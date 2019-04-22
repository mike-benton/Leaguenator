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

/*
const app = new Vue({
	el: '#app',
	data:
    {
        title:"League of Legends Champion Streams",
        results: ""
	},
    created()
    {
        this.search();
    },
	methods:{
	search(){
		//if (! this.term.trim()) return;
        let url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/RiotSchmick?api_key=";
        let key="RGAPI-c90a6ee2-aef5-4bdb-b4fb-834ae9636466";
		fetch(url,
            {
                'X_CMC_PRO_API_KEY': key
            })
		.then(response => {
			if(!response.ok){
				throw Error(`ERROR: ${response.statusText}`);
			}
			return response.json();
		})
		.then(json => {
            this.results = json;
			console.log(json);
		})
	   }, // end search
	} // end methods
});*/


//Twitch Info
const twitchURL = "https://api.twitch.tv/kraken";
const clientID = "4gqmz463yaeixhvuvwuposq1j5maxb";

//League Info
const leagueURL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let summonerName = "RiotSchmick";
const leagueKey = "?api_key=RGAPI-c90a6ee2-aef5-4bdb-b4fb-834ae9636466";//Key needs to be updated every 24 hours

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
        getLeagueData: function(){
            if(document.querySelector("#summonerNameInput").value != "")
                {
                    summonerName = document.querySelector("#summonerNameInput").value;
                }
            else
            {
                summonerName = "RiotSchmick";
            }
            url = leagueURL + summonerName + leagueKey;
            $.getJSON(url, function(data){
                    console.log(data.name);
                    console.log(data.profileIconId);
                })
        }
	} // end methods
});