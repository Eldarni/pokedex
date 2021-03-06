
//
import React from 'react';

//
import pokemon from '../static/pokemon.json';

//
import { useApplicationState }  from '../context/ApplicationContext';
import { useProfileState } from '../context/ProfileContext';

//
import Header  from './Header';
import Content from './Content';
import Footer  from './Footer';

//
import PokeDex from './PokeDex';

//
import pokemonSearch from '../utils/pokemonSearch';

//
import Popup from './Popup';
import ProfileManager from './ProfileManager';
import TagManager from './TagManager';

//
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from './ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faMinusSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'

//
export default () => {

    //
    const [ currentProfileState ] = useApplicationState();

    //get the user applied tags for the current profile
    const userTags = JSON.parse(window.localStorage.getItem('profile-' + currentProfileState)) || {};

    //merge the user's tags into the main list of pokemon
    const taggedPokemon = objectMap(pokemon, function(value) {
        if (value.id in userTags) {
            return { ...value, 'tags' : [ ...value.tags, ...userTags[value.id] ] };
        }
        return value;
    });

    //now apply the current profile filter
    const profiles = useProfileState();
    const currentProfile = profiles.getCurrentProfile();

    const filteredPokemon = ((currentProfile.filter !== '') ? pokemonSearch(taggedPokemon, currentProfile.filter) : taggedPokemon);

    //allow the visibility of the popups to be toggled
    const [showProfilesPopop, setShowProfilesPopop] = React.useState(false);
    const [showTagsPopop,     setShowTagsPopop]     = React.useState(false);

    //
    return (
        <React.Fragment>

            <Header />
            <Content className={((showProfilesPopop || showTagsPopop) ? 'blurred' : '')}>
                <PokeDex pokemon={filteredPokemon} setShowProfilesPopop={setShowProfilesPopop} setShowTagsPopop={setShowTagsPopop} />
                <Popup title="Profiles" visible={showProfilesPopop} onClose={() => setShowProfilesPopop(false)}><ProfileManager /></Popup>
                <Popup title="Tags"     visible={showTagsPopop}     onClose={() => setShowTagsPopop(false)}><TagManager /></Popup>
            </Content>
            <Footer />

            <ContextMenu selector='.pokemon[data-selected="yes"]'>
                <ContextMenuItem><FontAwesomeIcon size="lg" icon={faSquare} /> Owned</ContextMenuItem>
                <ContextMenuItem><FontAwesomeIcon size="lg" icon={faMinusSquare} /> Shiny</ContextMenuItem>
                <ContextMenuItem><FontAwesomeIcon size="lg" icon={faCheckSquare} /> Lucky</ContextMenuItem>
                <ContextMenuDivider />
                <ContextMenuItem>Clear All Tags</ContextMenuItem>
            </ContextMenu>

        </React.Fragment>
    );

};

//apply the supplied function to each property in the object and return a new object
function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key])
        return result
    }, {})
};