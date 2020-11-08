let offset = 0
const limit = 50

const getPokemonURL = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokemonPromises = () => Array(limit)
  .fill()
  .map((_, index) => fetch(getPokemonURL(index + offset + 1))
    .then(response => response.json()))

const getImage = (sprites) => {
  if(sprites.other.dream_world.front_default !== null) {
    return sprites.other.dream_world.front_default
  } else if(sprites.other["official-artwork"].front_default !== null) {
    return sprites.other["official-artwork"].front_default
  } else {
    return sprites.front_default
  }
}

const generateHTML = pokemons => pokemons.reduce((accumulator, {
  id,
  name,
  types,
  sprites
}) => {
  const elementTypes = types.map(typesInfo => typesInfo.type.name)

  accumulator += `  
    <li class="card ${elementTypes[0]}">
      <img class="card-image" src="${getImage(sprites)}" alt="${name}"/>
      <h2 class="card-title">${id}. ${name}</h2>
      <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>
    `
  return accumulator
}, '')

const insertPokemonsIntoPage = pokemons => {
  const ul = document.querySelector('[data-js="pokedex"]')
  ul.innerHTML += pokemons
}

async function getPokemon() {
  const pokemonPromises = generatePokemonPromises()

  await Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonsIntoPage)
}

window.addEventListener('scroll', function () {
  if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && offset < 850) {
    setTimeout(async () => {
      offset += limit
      await getPokemon()
      window.scrollTo(0, window.scrollY)
    }, 500);
  }
})

getPokemon()