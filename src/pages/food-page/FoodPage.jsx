import ImgQuatroQ from "../../assets/imgPizzaQuatroQ.png"
import Ingrediente from "./components/Ingrediente";
function FoodPage(){
    return (
        <div className="w-96 flex justify-center items-start flex-col">
            <img src={ImgQuatroQ} alt="" className="w-full h-64 rounded-none" />
            
            <div className="flex flex-col items-start justify-center pt-10 pb-6">
            <span className="font-bold  text-3xl font-sans">Quatro Queijos </span>
             <span className="text-lg text-gray-500">Pizza de Quatro Queijos com borda tradicional</span>
             </div>
             <span className="flex justify-start items-center font-bold text-gray-500">Ingredientes</span>
             <Ingrediente/>
        </div>
    )
}

export default FoodPage;