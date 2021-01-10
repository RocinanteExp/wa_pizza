/**
 * create ingredient panel
 * @param {String} name
 * @param {Array} of String ingredients
 * @param {Function} handleOnChange
 * @param {Integer} id
 * @returns {Component} IngredientsMenu
 **/

const IngredientsMenu = ({ name, ingredients, handleOnChange, id }) => {
    const ingredientsGroupedByInitials = groupByInitials(ingredients);

    return (
        <div id={id}>
            <h1>{name}</h1>
            {ingredientsGroupedByInitials.map((group) => createIngredientsGroup(group, handleOnChange))}
        </div>
    );
};

const createPizzaIcons = (ingredientName) => {
    const style = {
        width: "1.25rem",
        height: "1.25rem",
        borderRadius: "50%",
        backgroundColor: "green",
    };

    const id = `id-container-icons-${ingredientName}`
    const idRadioLeft = `id-radio-left-icons-${ingredientName}`
    const idRadioCenter = `id-radio-center-icons-${ingredientName}`
    const idRadioRight = `id-radio-right-icons-${ingredientName}`

    return (
        <div id={id} className="container-flex flex-cross-center">
            <div className="container-flex pos-relative">
                <input type="radio" id={idRadioLeft} name="pizza-side" value="left"></input>
                <label for={idRadioLeft} className="left-half-circle bg-black toggle"></label>
                <label for={idRadioLeft} className="right-half-circle bg-white"></label>
            </div>

            <div className="container-flex pos-relative">
                <input type="radio" id={idRadioCenter} name="pizza-side" value="both"></input>
                <label for={idRadioCenter} className="left-half-circle bg-black toggle"></label>
                <label for={idRadioCenter} className="right-half-circle bg-black toggle"></label>

            </div>

            <div className="container-flex pos-relative">
                <input type="radio" id={idRadioRight} name="pizza-side" value="right"></input>
                <label for={idRadioRight} className="left-half-circle bg-white"></label>
                <label for={idRadioRight} className="right-half-circle bg-black toggle"></label>
            </div>
        </div>
    );
};

const createIngredientRow = (data, handleOnChange) => {
    const id = `row-id-${data}`;
    const inputId = `input-id-${data}`;
    const key = `key-${data}`;
    const displayName = `${data.slice(0, 1).toUpperCase() + data.slice(1, data.length)}`;

    const onChange = (event) => {
        handleOnChange(event.target.value, event.target.checked);
    };

    return (
        <div id={id} key={key} className="container-flex flex-cross-center flex-main-sb">
            <input id={inputId} value={displayName} type="checkbox" onChange={onChange}></input>
            <label className="container-flex flex-cross-center" htmlFor={inputId}>
                {displayName}
            </label>
            {createPizzaIcons(data)}
        </div>
    );
};

function createIngredientsGroup(ingredients, ...handlers) {
    const initial = ingredients[0].slice(0, 1).toUpperCase();
    const key = `group-key-initial-${initial}`;
    const id = `group-id-initial-${initial}`;

    return (
        <div key={key} id={id}>
            <div className="font size-m weight-bold">{initial}</div>
            {ingredients.map((ingredient) => createIngredientRow(ingredient, handlers[0]))}
        </div>
    );
}

/**
 * group the ingredients by their initial
 * @param {Array} of String ingredients
 * @param {Array} of Function handlers
 * @returns {Array} of Array
 **/
function groupByInitials(ingredients) {
    const ret = [];

    // transform every word to lowercase
    const lowerCasedIngredients = ingredients.map((i) => i.toLowerCase());
    // sort the array
    lowerCasedIngredients.sort();

    let last = null;
    let group = [];
    for (const ingredient of lowerCasedIngredients) {
        const initial = ingredient.slice(0, 1);

        // a different letter means a new group
        if (initial !== last) {
            group = [];
            last = initial;
            ret.push(group);
        }

        group.push(ingredient);
    }

    return ret;
}

export { IngredientsMenu };
