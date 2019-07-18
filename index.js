let allPokemons;
let pokemon__types;
let pokemon__data = [];


/* calcular URL de imagen a trabes de la url del pokemon
	var str = "https://pokeapi.co/api/v2/pokemon/7/";
  var res = str.substring(34, str.length-1);
  var urlImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+res+".png"; 
*/
function listPokemon() {
	/*Obtenemos la lista con todos los pokemons (solo nombre y url para info detallada) */
	// let url = "https://pokeapi.co/api/v2/pokemon/?limit=300"; //964, or use key "count" and add as new url.
	let url = "https://pokeapi.co/api/v2/type/"
	let response;
	httpGetAsync(url, function (response) {
		// document.getElementById("broma").innerText = JSON.parse(response)["value"];
		// allPokemons = JSON.parse(response);
		// console.log(allPokemons);
		pokemon__types = JSON.parse(response)["results"];
	})
	setTimeout(() => {
		addElements();
	}, 100);
}

function addElements() {
	for (let i = 0; i < pokemon__types.length; i++) {
		/* let chkBox = document.createElement("input");
		chkBox.setAttribute("type", "checkbox");
		chkBox.setAttribute("class", "form-check-input")
		chkBox.setAttribute */
		let chkBox = document.createElement("label");
		chkBox.innerHTML = `<input type="checkbox" value="">${pokemon__types[i]["name"]}`;
		chkBox.style.display="block";
		document.body.appendChild(chkBox);
	}
}

function httpGetAsync(theUrl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
}

function getPokemon() {
	getPokemonTypes();
}

function getPokemonTypes() {
	let filters = filterPokemon()
	//Test con 3 filtros fijos
	console.log(filters)


	for (let i = 0; i < filters.length; i++) {
		console.log()
		let url = "https://pokeapi.co/api/v2/type/" + filters[i];
		let response;
		httpGetAsync(url, function (response) {
			/* console.log(JSON.parse(response)); */ // document.getElementById(`countryCode${i+1}`).setAttribute("value", JSON.parse(response)["name"]);
			/* document.getElementById("currency").innerText = JSON.parse(response)["currencies"][0]["name"];
			document.getElementById("flag").setAttribute("src", JSON.parse(response)["flag"]);
			document.getElementById("flag").style["border"] = "2px solid black" */
			pokemon__data.push(JSON.parse(response)["pokemon"]);
		})
	}
	console.log(pokemon__data);

	// pokeDOM();
	setTimeout(() => {
		pokeDOM();
	}, 100);



}

function pokeDOM() {
	document.getElementsByClassName("pokeName")[0].innerText = pokemon__data[0][0]["pokemon"]["name"];
	// console.log(pokemon__data[0][0]["pokemon"]["name"])
	var str = pokemon__data[0][0]["pokemon"]["url"];
	var res = str.substring(34, str.length - 1);
	var urlImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + res + ".png";
	console.log(urlImage);
	document.getElementsByClassName("pokePic")[0].setAttribute("src", urlImage);
}



function filterPokemon() {
	//comprobar todos los checkBoxex del html y si están marcados o tienen texto los inputs, añadir String con el filtro a una array
	let listaFiltros = ["water", "fire", "flying"];
	return listaFiltros;

}


function enableTypeFilters() {
	if (document.getElementById("filterType")) {

	} else {

	}
	let filters = document.getElementsByClassName("pokemon__Types");
	for (let i = 0; i < filters.length; i++) {
		filters[i].removeAttribute("disabled");
	}

}


/* function initTypes() {
	let url = "https://pokeapi.co/api/v2/type/";
	let response;
	let name = "";
	let currency = [];
	httpGetAsync(url, function (response) {
		document.getElementById(`countryCode${i+1}`).setAttribute("value", JSON.parse(response)["name"]);


	})
} */








function preventRefresh(event) {
	event.preventDefault();
}