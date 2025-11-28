import { FootCategories } from "./components/food-categories/FootCategories"

const foodList = [
    { id: '1', name: 'Burgers', url: '' },
    { id: '2', name: 'Pizzas', url: '' },
    { id: '3', name: 'Drinks', url: '' }
]

export const FootPage = () => {
    return (
        <div>

            <FootCategories items={
                foodList
            } />

            <ul id="food-list">
                <FoodItem />
                <FoodItem />
                <FoodItem />
                <FoodItem />
            </ul>
        </div>
    )
}