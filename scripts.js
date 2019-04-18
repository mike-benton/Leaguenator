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
});