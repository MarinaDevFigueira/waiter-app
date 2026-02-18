import { SquaresFour, Rows } from "@phosphor-icons/react";
import { useOrdersView } from "@/shared/hooks/useOrdersView";
import { OrdersViewEnum, type OrdersView } from "@/shared/enums/orders-view.enum";
import type { OrdersViewToggleProps } from "@/pages/orders/kitchen-orders/components/orders-view-toggle/orders-view-toggle.interface";

const VIEW_BUTTONS: { view: OrdersView; Icon: typeof Rows }[] = [
  { view: OrdersViewEnum.TABLE, Icon: Rows },
  { view: OrdersViewEnum.KITCHEN, Icon: SquaresFour },
];

export function OrdersViewToggle({ disabled = true }: OrdersViewToggleProps) {
  const { view, setOrdersView } = useOrdersView();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border p-1">
      {VIEW_BUTTONS.map(({ view: btnView, Icon }) => {
        const isActive = view === btnView;
        const isDisabled = disabled;

        const activeClassName = "p-1.5 rounded bg-primary text-primary-foreground";
        const enabledClassName = "p-1.5 rounded text-muted-foreground hover:text-foreground";
        const disabledClassName = "p-1.5 rounded text-muted-foreground cursor-not-allowed select-none opacity-50";

        let buttonClassName = enabledClassName;
        if (isActive) {
          buttonClassName = activeClassName;
        }
        if (isDisabled) {
          buttonClassName = disabledClassName;
        }

        return (
          <button
            key={btnView}
            className={buttonClassName}
            onClick={() => setOrdersView(btnView)}
            type="button"
            disabled={isDisabled}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
