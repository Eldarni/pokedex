import React, { useState, useEffect } from 'react';

import cloneDeep from 'lodash.clonedeep';

import concatUnique from '../utils/concatUnique';
import pokemonSearch from '../utils/pokemonSearch';

import PokeCard from './PokeCard';

import basePokemonData from '../static/pokemon.json';

const Pokedex = (props) => {

    //clone the base pokemon data so we can mutate it safely
    const pokemonData = cloneDeep(basePokemonData);

    //store the user's data in state
    const [userData, setUserData] = useState(() => {
        return JSON.parse(window.localStorage.getItem('user-data')) || {};
    });

    //save the user's data to local storage
    useEffect(() => {
        window.localStorage.setItem('user-data', JSON.stringify(userData));
    });

    //------------------------------------------------------------------------------

    //merge the contents of the user's personal tags into the main tag list
    Object.keys(userData).forEach(function(pokemon) {
        if (pokemon in pokemonData) {
            pokemonData[pokemon]['tags'] = concatUnique(pokemonData[pokemon]['tags'], userData[pokemon]);
        }
    });

    //------------------------------------------------------------------------------

    //filter the base list of pokemon by the search string
    let filteredPokemon = pokemonData;
    if (props.searchString !== '') {
        filteredPokemon = pokemonSearch(pokemonData, props.searchString);
    } 

    //------------------------------------------------------------------------------

    //add the functionality to toggle a user:TAG on a pokemon
    const onToggleTag = function(pokemonID, tag) {

        //get an array containing all the tags for a specified pokemon (or init an empty array)
        const pokemonTags = userData[pokemonID] || [];
        
        //does the tag already exists in our tag list
        const i = pokemonTags.indexOf('user:' + tag);

        //add it if not, remove it if so
        if (i === -1) {
            pokemonTags.push('user:' + tag);
        } else {
            pokemonTags.splice(i, 1);
        }

        //update the state
        setUserData(prevState => { 
            return {...prevState, [pokemonID]: pokemonTags};
        });

    }

    //------------------------------------------------------------------------------

    //
    return (
        <div className="pokedex">
            {Object.keys(filteredPokemon).map(function(key) {
                return <PokeCard key={key} details={filteredPokemon[key]} onToggleTag={onToggleTag}></PokeCard>
            })}
        </div>
    );

    //------------------------------------------------------------------------------

}

export default Pokedex;
