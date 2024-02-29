const fs = require('fs/promises');

async function writeDataFile(fileName, data) {

    try {
        console.log(`Escrevendo dados no arquivo ${fileName}...`);
        await fs.writeFile(fileName, data);
        console.log(`Dados escritos no arquivo ${fileName} com sucesso.`);

    } catch (error) {
        console.error(`Erro ao escrever dados no arquivo ${fileName}:`, error);
    }
}

async function readDataFile(fileName) {

    try {
        console.log(`Lendo dados do arquivo: ${fileName}`);
        const data = await fs.readFile(fileName, 'utf-8');
        console.log(`Dados lidos do arquivo ${fileName}`);
        return data;

    } catch (error) {
        console.error(`Erro ao ler dados do arquivo ${fileName}`, error);
    }
}

async function filterPokeDataAsync(data) {

    const pokemonInfo = {
        nome: data.name,
        tipo: data.types.map(type => type.type.name),
        peso: data.weight,
        altura: data.height,
        id: data.id,
        sprite: data.sprites.front_default
    };

    return JSON.stringify(pokemonInfo, null, 2);
}

async function fetchAndProcessPokemonDataAsync() {

    try {
        console.log('Aguardando retorno da Poke API...');
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const jsonData = await response.json();
        const filteredPokeData = await filterPokeDataAsync(jsonData);

        await writeDataFile('pokemon.json', filteredPokeData);
        console.log('Pokémon cadastrado! :D');

        const savedPokeData = await readDataFile('pokemon.json', filteredPokeData);
        console.log('Conteúdo do arquivo pokemon:', savedPokeData);

    } catch (error) {
        console.error('Erro ao obter e/ou manipular os dados do Pokémon :c', error)
    }
}

async function getSinglePokemonData(i) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + i);
    return response.json();
}

async function processPokemonData() {
    const pokeArr = [];

    for (let i = 1; i < 152; i++) {
        const pokeInfo = await getSinglePokemonData(i);
        pokeArr.push(filterPokeDataAsync(pokeInfo));
    }

    console.log(pokeArr);

    await writeDataFile('pokemon.json', pokeArr);
    const pokemonData = await readDataFile('pokemon.json');
}

processPokemonData();