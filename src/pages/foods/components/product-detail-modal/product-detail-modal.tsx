import { useState, useCallback, useMemo } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/shared/schemas/product.schema";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = useCallback(() => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      return newQuantity;
    });
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => {
      const newQuantity = prev - 1;
      const canDecrement = newQuantity >= 1;
      const finalQuantity = canDecrement ? newQuantity : prev;
      return finalQuantity;
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    const hasProduct = !!product;
    if (!hasProduct) return;

    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  }, [product, quantity, onAddToCart, onClose]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const isClosed = !isOpen;
      if (isClosed) {
        setQuantity(1);
        onClose();
      }
    },
    [onClose]
  );

  const images = useMemo(() => {
    const hasProduct = !!product;
    if (!hasProduct) {
      const emptyImages: string[] = [];
      return emptyImages;
    }

    const hasImages = !!product.images?.length;
    const imageList = hasImages ? product.images : ["/no-image.png"];
    return imageList;
  }, [product]);

  const formattedPrice = useMemo(() => {
    const hasProduct = !!product;
    if (!hasProduct) {
      const emptyPrice = "";
      return emptyPrice;
    }

    const price = formatPrice(product.price);
    return price;
  }, [product]);

  const hasProduct = !!product;
  if (!hasProduct) return null;

  const multipleImagesExist = images.length > 1;
  const hasMultipleImages = multipleImagesExist;
  const quantityIsOne = quantity === 1;
  const canDecrement = !quantityIsOne;

  const productId = product.id;
  const productName = product.name;
  const productDescription = product.description;
  const unitPriceLabel = t("productDetail.unitPrice");
  const quantityLabel = t("productDetail.quantity");
  const addToCartLabel = t("productDetail.addToCart");

  const imageSwiper = (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={hasMultipleImages}
      pagination={hasMultipleImages ? { clickable: true } : false}
      loop={hasMultipleImages}
      className="w-full h-full"
    >
      {images.map((image, index) => {
        const slideKey = `${productId}-${index}`;
        return (
          <SwiperSlide key={slideKey}>
            <img
              src={image}
              alt={productName}
              className="w-full h-full object-contain"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );

  const quantityControls = (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {quantityLabel}
      </span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={!canDecrement}
          data-testid="decrement-quantity"
          className="size-10"
        >
          <Minus className="size-4" />
        </Button>
        <span
          className="text-xl font-semibold w-12 text-center"
          data-testid="quantity-display"
        >
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          data-testid="increment-quantity"
          className="size-10"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );

  const priceBlock = (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {unitPriceLabel}
      </span>
      <span className="text-xl font-bold text-primary">
        {formattedPrice}
      </span>
    </div>
  );

  const addToCartButton = (
    <Button
      onClick={handleAddToCart}
      className="w-full"
      size="lg"
      data-testid="add-to-cart-button"
    >
      <ShoppingCart className="size-5 mr-2" />
      <span>
        {addToCartLabel}
      </span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <Drawer.Content className="max-h-[85vh] flex flex-col">
          <Drawer.Header className="border-b">
            <Drawer.Title>{productName}</Drawer.Title>
            <Drawer.Close />
          </Drawer.Header>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="relative w-full aspect-video bg-muted shrink-0">
              {imageSwiper}
            </div>

            <div className="p-4 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {productDescription}
              </p>

              <div className="flex flex-col gap-4 pt-4 border-t">
                {quantityControls}
                {priceBlock}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t p-4">
            {addToCartButton}
          </div>
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content className="max-w-lg p-0 overflow-hidden max-h-[85vh] flex flex-col">
        <Dialog.Header className="border-b">
          <Dialog.Title>{productName}</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative w-full aspect-video bg-muted shrink-0">
            {imageSwiper}
          </div>

          <div className="p-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {productDescription}
            </p>

            <div className="flex flex-col gap-4 pt-3 border-t">
              {quantityControls}
              {priceBlock}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t p-4">
          {addToCartButton}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
