import { Button } from "@/components/ui/button";
import { FootCategories } from "./components/food-categories/FootCategories"
import FoodItem from "./components/food-item/FoodItem"

const listItems = [
    {
        img: "../../../../../src/assets/imgPizzaQuatroQ.png",
        title: "Quatro Queijos",
        description: "Pizza de Quatro Queijos com borda tradicional",
        price: "40,00"
    },
    { img: "../../../../../src/assets/imgPizzaFrango.png",
     title: "Frango com Catupiry", 
     description: "Pizza de Frango com Catupiry e borda tradicional", 
     price: "40,00" },
    { 
    img: "../../../../../src/assets/imgPizzaMarguerita.png",
     title: "Marguerita", 
     description: "Pizza de Marguerita no melhor estilo italiano", 
     price: "50,00" },
];

export const FootPage = () => {
    return (
        <div>
            <div className="flex flex-col items-start justify-center mb-6">
            <span className="text-gray-600">Bem-vindo(a) ao</span>
            <span className="text-3xl font-mono text-gray-600"><strong className="text-black">WAITER</strong>APP</span>
            </div>

            <FootCategories items={ 
                listItems
            } />

            <ul id="food-list " className="mb-24">
                {listItems.map((item,index)=>{
                    return (
                   <div>
                    <FoodItem 
                    key={item.id}
                    id={index}
                    img={item.img}
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    />
                       
 {
 index < listItems.length - 1 && (
                            <div className="border-b-2 border-gray-200 w-full mb-8 mt-8">

                            </div>
                        )}
                    </div>
                    
                    )
                })}
                
            </ul>
            <Button className="w-full h-12  rounded-4xl">
                Novo Pedido
            </Button>
        </div>
    )
}

export default FootPage