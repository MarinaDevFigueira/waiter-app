import ImgIcone from "../../../../../public/plus-icon.svg"



function FoodItem({id,img,title,description,price}) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {
                   
                    <li key={id} className="flex flex-row gap-4   ">
                        <img src={img} alt="" className="bg-amber-500 w-32 h-32 rounded-2xl outline-none" />
                        <div className=" w-64 h-32  flex items-start justify-between flex-col">
                            <span className="text-black font-bold font-mono text-base ">{title} <br /> </span>
                            <span className="text-gray-700">{description}<br />
                            </span>
                            <span className="flex justify-between w-full">
                                <span className="font-bold">{price}</span>
                                <img src={ImgIcone} alt="icone" className="w-5 h-5" />
                            </span>

                        </div>
                    
                    </li>
                    
                   }


        </div>
    )
}

export default FoodItem