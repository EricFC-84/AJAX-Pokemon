let allPokemons;
let pokemon__types;
let pokemon__data = [];
let pokemonTable = document.getElementById("pokemonTable");


/* 
TO DO: filtrar repetidos--> crear nueva array. añadir objetos con name/pic/data y type. Antes de crear la row, mirar si ya está en la array
y se es así solo añadir el type adicional. Al final, crear una row con cada posición del array y append al tbody */


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
		pokemon__types = JSON.parse(response)["results"];
	})
	setTimeout(() => {
		addElements();
	}, 200);
}

function addElements() {
	let filterBox = document.getElementById("filterContainer");

	for (let i = 0; i < pokemon__types.length; i++) {
		/* let chkBox = document.createElement("input");
		chkBox.setAttribute("type", "checkbox");
		chkBox.setAttribute("class", "form-check-input")
		chkBox.setAttribute */
		let chkDiv = document.createElement("div");
		chkDiv.className = "checkDiv col-md-4 col-6";
		chkDiv.style.textIndent = "50%";
		let chkBox = document.createElement("input");
		let chkLabel = document.createElement("label");
		chkBox.type = "checkbox";
		chkBox.value = `${pokemon__types[i]["name"]}`;

		chkLabel.appendChild(document.createTextNode(`${pokemon__types[i]["name"]}`));
		chkLabel.style.textIndent = "1rem";
		chkDiv.innerHTML = chkBox.outerHTML + chkLabel.outerHTML;
		// console.log(chkDiv.innerHTML);

		// console.log (`${pokemon__types[i]["name"]}`);
		// chkLabel.style.display = "inline-block";
		// chkBox.style.display = "block";
		filterBox.appendChild(chkDiv);

		/* document.getElementsByClassName("container")[0].appendChild(chkBox);
		document.getElementsByClassName("container")[0].appendChild(chkLabel); */
	}

}

function whatIsChecked() {
	let boxes = document.querySelectorAll('input[type="checkbox"]');
	let filtersChecked = [];
	for (var i = 0; i < boxes.length; i++) {
		console.log(boxes[i]["checked"]);
		if (boxes[i]["checked"] == true) {
			filtersChecked.push(boxes[i].value);
		}
	}
	return filtersChecked
}

function getPokemon() {
	pokemon__data = [];
	let body = document.getElementsByTagName("tbody")[0];
	body.parentNode.removeChild(body);
	getPokemonTypes();
}

function getPokemonTypes() {
	let filters = filterPokemon()
	//Test con 3 filtros fijos
	// console.log(filters)


	for (let i = 0; i < filters.length; i++) {
		let url = "https://pokeapi.co/api/v2/type/" + filters[i];
		// console.log(url)
		let response;
		httpGetAsync(url, function (response) {
			/* console.log(JSON.parse(response)); */ // document.getElementById(`countryCode${i+1}`).setAttribute("value", JSON.parse(response)["name"]);
			/* document.getElementById("currency").innerText = JSON.parse(response)["currencies"][0]["name"];
			document.getElementById("flag").setAttribute("src", JSON.parse(response)["flag"]);
			document.getElementById("flag").style["border"] = "2px solid black" */
			/* console.log("1" + pokemon__data);
			console.log(`2. ${console.log(JSON.parse(response))}`);
			console.log(JSON.parse(response)["pokemon"]); */
			pokemon__data.push(JSON.parse(response)["pokemon"]);
		})
	}
	console.log(pokemon__data);

	var timeout = setInterval(function () {
		if (pokemon__data.length > 0) {
			clearInterval(timeout);
			pokeDOM();
		}
	}, 100);

	// setTimeout(() => {

	// }, 500);
}

//Añade en el DOM los pokemons filtrados
function pokeDOM() {

	console.log(pokemon__data + "pokedata");
	console.log(document.getElementsByClassName("pokeName"));
	let tableBody = document.createElement("tbody");
	for (let j = 0; j < pokemon__data.length; j++) {


		for (let i = 0; i < pokemon__data[j].length; i++) {
			let tableRow = document.createElement("tr");
			let nameCell = document.createElement("td");
			let picCell = document.createElement("td");
			let picData = document.createElement("div");
			let dataCell = document.createElement("td");


			nameCell.innerText = pokemon__data[j][i]["pokemon"]["name"];
			var str = pokemon__data[j][i]["pokemon"]["url"];
			dataCell.innerHTML = `<a href="${str}">${str}</a>`;
			var res = str.substring(34, str.length - 1);
			//string.replace(url, "");
			var urlImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + res + ".png";

			picData.className = "pokePic";

			picData.style.backgroundImage = `url(${urlImage})`;
			picCell.appendChild(picData);

			tableRow.innerHTML = picCell.outerHTML + nameCell.outerHTML + dataCell.outerHTML;
			tableBody.appendChild(tableRow);

		}
		pokemonTable.appendChild(tableBody);
	}
	
}


function filterPokemon() {
	//comprobar todos los checkBoxex del html y si están marcados o tienen texto los inputs, añadir String con el filtro a una array
	let listaFiltros = whatIsChecked();
	return listaFiltros;

}

function filterButtonDelay() {

	let button = document.getElementById("filterButton");
	button.setAttribute("disabled", "disabled");
	setTimeout(() => {
		button.removeAttribute("disabled");
	}, 600);
}

/* function enableTypeFilters() {
	if (document.getElementById("filterType")) {

	} else {

	}
	let filters = document.getElementsByClassName("pokemon__Types");
	for (let i = 0; i < filters.length; i++) {
		filters[i].removeAttribute("disabled");
	}

} */


/* function initTypes() {
	let url = "https://pokeapi.co/api/v2/type/";
	let response;
	let name = "";
	let currency = [];
	httpGetAsync(url, function (response) {
		document.getElementById(`countryCode${i+1}`).setAttribute("value", JSON.parse(response)["name"]);


	})
} */





function httpGetAsync(theUrl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
}


function preventRefresh(event) {
	event.preventDefault();
}