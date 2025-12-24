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
      className="w-full flex items-start justify-start gap-3 sm:gap-4 min-h-20 sm:h-24"
      {...props}
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-20 sm:h-24 aspect-video rounded-md object-cover shrink-0"
      />
      <div className="w-full flex flex-col items-start justify-between gap-1 py-1 sm:py-0">
        <span className="font-semibold text-sm sm:text-base line-clamp-2">
          {name}
        </span>
        <span className="font-normal text-xs sm:text-sm text-muted-foreground line-clamp-1">
          {description}
        </span>
        <div className="flex justify-between items-center w-full mt-auto">
          <span className="font-semibold text-sm sm:text-base">{price}</span>
          <button
            onClick={onAddClick}
            className="hover:opacity-80 transition-opacity p-1"
            aria-label={`Adicionar ${name} ao pedido`}
          >
            <PlusCircle
              color="oklch(0.577 0.245 27.325)"
              size={18}
              className="sm:w-5 sm:h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Foods = ({ items = [] }) => {
  return (
    <ul className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
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
