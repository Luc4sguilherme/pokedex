let offset = 0
const limit = 50
const amountOfPokemon = 1118

const getPokemonURL = (limit, offset) => fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`).then(response => response.json())

const getImage = (sprites) => {
  if (sprites.other.dream_world.front_default !== null) {
    return sprites.other.dream_world.front_default
  } else if (sprites.other["official-artwork"].front_default !== null) {
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
  getPokemonURL(limit, offset).then(({ results }) => {
    Promise.all(results.map(async data => {
      const response = await fetch(`${data.url}`)
      const pokemon = await response.json()
      return pokemon
    }))
    .then(generateHTML)
    .then(insertPokemonsIntoPage)
  })
    
  offset += limit
}

function getPokemonLength() {
  return document.querySelector('.pokedex').childElementCount
}

window.addEventListener('scroll', async () => {
  if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && getPokemonLength() < amountOfPokemon) {
    await getPokemon()
    window.moveTo(0, 1)
  }
})

window.addEventListener('touchmove', async () => {
  if (((window.innerHeight + window.scrollY)  >= document.body.offsetHeight - 50) && getPokemonLength() < amountOfPokemon) {
    await getPokemon()
    window.moveTo(0, 1)
  }
})

getPokemon()