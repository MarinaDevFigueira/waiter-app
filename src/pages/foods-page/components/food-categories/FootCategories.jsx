const listCategory=[
    {name:"Pizzas",
     icone: "../../../../../public/pizza.png"},
    {name:"Bebidas",
     icone:"../../../../../public/bebidas.png"
    },
    {name:"Lanches",
     icone:"../../../../../public/lanches.png"
    },{name:"Promoções",
     icone:"../../../../../public/promocoes.png"
    }]

export const FootCategoryItem = ({ name, imgUrl }) => {

    return <li className="flex   flex-col  justify-center items-center w-15 text-center">
        <img src={imgUrl} alt="" className="w-15 h-15 p-5 bg-white rounded-4xl shadow-sm "/>
        <span className="text-black font-bold mt-3">{name}</span>
    </li>;
}

export const FootCategories = () => {
    return (
        <ul className="flex flex-row gap-3 justify-between mb-6">
            {listCategory.map(item => (
                <FootCategoryItem key={item.id} name={item?.name} imgUrl={item?.icone} />
            ))}
        </ul>
    )
}