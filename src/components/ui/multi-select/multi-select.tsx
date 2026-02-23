import { useState, useCallback } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Selecionar...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = useCallback(
    (optionValue: string) => {
      const isSelected = value.includes(optionValue);
      const newValue = isSelected
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];

      onChange(newValue);
    },
    [value, onChange]
  );

  const selectedCount = value.length;
  const hasSelections = selectedCount > 0;

  const buttonText = hasSelections
    ? `${selectedCount} selecionado${selectedCount > 1 ? "s" : ""}`
    : placeholder;

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{buttonText}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            "z-50 w-[var(--radix-popover-trigger-width)] rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          align="start"
          sideOffset={4}
        >
          <div className="max-h-[300px] overflow-y-auto p-1 space-y-1">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    isSelected && "bg-accent"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(option.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <CheckIcon className="size-4 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default MultiSelect;
