import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BuildingsIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { BusinessCombobox } from "@/components/ui/business-combobox/business-combobox";
import { useBusiness } from "@/shared/hooks/useBusiness";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useLanguage } from "@/shared/hooks/useLanguage";
import type { BusinessSelectorButtonProps } from "./business-selector-button.interface";
import type { BusinessSelection } from "@/components/ui/business-combobox/business-combobox.interface";
import { DeviceTypeEnum } from "./business-selector-button.interface";

export function BusinessSelectorButton({
  deviceType,
}: BusinessSelectorButtonProps) {
  const [open, setOpen] = useState(false);
  const { selectedBusiness, setBusiness } = useBusiness();
  const { t } = useTranslation();
  const { addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();

  const handleBusinessChange = useCallback(
    (business: BusinessSelection) => {
      setBusiness(business);
      setOpen(false);

      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("orders") });
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("products") });
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("categories") });
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("users") });
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("order-sessions") });
    },
    [setBusiness, queryClient, addLanguagePrefix]
  );

  const hasSelectedBusiness = selectedBusiness !== null;
  const businessName = selectedBusiness?.name;
  const fallbackText = t("business.selector.placeholder");
  const displayName = hasSelectedBusiness ? businessName : fallbackText;

  const isMobile = deviceType === DeviceTypeEnum.MOBILE;
  const isDesktop = deviceType === DeviceTypeEnum.DESKTOP;

  const titleText = t("business.selector.title");
  const placeholderText = t("business.selector.placeholder");
  const searchPlaceholderText = t("business.selector.searchPlaceholder");
  const emptyMessageText = t("business.selector.emptyMessage");
  const selectedBusinessId = selectedBusiness?.id;

  const triggerButton = (
    <Button
      variant="ghost"
      onClick={() => setOpen(true)}
      className="flex items-center gap-2"
    >
      <BuildingsIcon className="size-5" />
      <span className="text-sm font-medium">{displayName}</span>
    </Button>
  );

  const combobox = (
    <BusinessCombobox
      value={selectedBusinessId}
      onChange={handleBusinessChange}
      placeholder={placeholderText}
      searchPlaceholder={searchPlaceholderText}
      emptyMessage={emptyMessageText}
    />
  );

  if (isMobile) {
    return (
      <div data-device="mobile" className="data-[device=mobile]:block data-[device=mobile]:md:hidden">
        {triggerButton}

        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Content className="min-h-[50vh]">
            <Drawer.Header>
              <Drawer.Title>{titleText}</Drawer.Title>
              <Drawer.Close />
            </Drawer.Header>

            <div className="p-4">{combobox}</div>
          </Drawer.Content>
        </Drawer>
      </div>
    );
  }

  return (
    <div data-device="desktop" className="data-[device=desktop]:hidden data-[device=desktop]:md:block">
      {triggerButton}

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{titleText}</Dialog.Title>
            <Dialog.Close />
          </Dialog.Header>

          <div className="p-6">{combobox}</div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
