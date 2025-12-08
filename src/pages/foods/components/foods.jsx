import { PlusCircle } from "lucide-react";

export const FoodOption = ({
  name = "Nome do prato",
  description = "Descrição do prato",
  price = "00.00",
  imageUrl = "",
  onAddClick = () => {},
  ...props
}) => {
  return (
    <div
      className="w-full flex items-start justify-start h-24 max-h-24 max-w-[500px]"
      {...props}
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-full aspect-video rounded-md"
      />
      <div className="w-full h-full inline-flex flex-col items-start justify-between gap-1 px-3 py-0">
        <span className="font-semibold text-base">{name}</span>
        <span className="font-normal text-sm text-gray-400">{description}</span>
        <div className="flex justify-between items-center w-full">
          <span className="block">{price}</span>
          <PlusCircle
            className="hover:cursor-pointer"
            onClick={onAddClick}
            color="red"
            size={18}
          />
        </div>
      </div>
    </div>
  );
};

export const Foods = ({ items = [] }) => {
  return (
    <ul className="w-full flex flex-col items-start justify-start gap-4">
      {items.map((food) => (
        <FoodOption
          key={food?.name}
          name={food?.name}
          description={food?.description}
          price={food?.price}
          imageUrl={food?.imageUrl}
        />
      ))}
    </ul>
  );
};
