
export const FootCategoryItem = ({ name, imgUrl }) => {
    return <li>Foot Category Item</li>;
}

export const FootCategories = ({ items = [] }) => {
    return (
        <ul>
            {items.map(item => (
                <FootCategoryItem key={item.id} name={item?.name} imgUrl={item?.url} />
            ))}
        </ul>
    )
}