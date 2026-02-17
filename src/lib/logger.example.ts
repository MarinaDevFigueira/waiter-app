import { logger, LogLevel } from "./logger";

function basicUsageExample(): void {
  logger.debug("Debugging application state", { state: "loading" });
  logger.info("User action completed", { action: "submit_form" });
  logger.warn("Deprecated API used", { endpoint: "/api/v1/old" });

  try {
    throw new Error("Something went wrong");
  } catch (error) {
    logger.error("Failed to process request", error as Error, { userId: 123 });
  }
}

function contextExample(): void {
  const authLogger = logger.withContext("AUTH");

  authLogger.info("User login attempt", { username: "john.doe" });
  authLogger.info("Token generated");
  authLogger.info("Login successful");
}

interface ProductData {
  name: string;
  [key: string]: unknown;
}

interface Product {
  id: string;
  name: string;
}

class ProductService {
  private logger = logger.withContext("ProductService");

  async fetchProducts(): Promise<Product[]> {
    this.logger.debug("Fetching products from API");

    try {
      const response = await fetch("/api/products");
      const products = (await response.json()) as Product[];

      this.logger.info("Products fetched successfully", {
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger.error("Failed to fetch products", error as Error, {
        url: "/api/products",
      });
      throw error;
    }
  }

  async createProduct(data: ProductData): Promise<Product> {
    this.logger.info("Creating new product", { name: data.name });

    try {
      const product = await this.saveProduct(data);
      this.logger.info("Product created", { id: product.id });
      return product;
    } catch (error) {
      this.logger.error("Failed to create product", error as Error, { data });
      throw error;
    }
  }

  saveProduct(_data: ProductData): Promise<Product> {
    return Promise.resolve({ id: "", name: "" });
  }
}

function componentExample(): () => void {
  const OrderComponent = () => {
    const componentLogger = logger.withContext("OrderComponent");

    const _handleSubmit = async (orderData: { items: unknown[] }) => {
      componentLogger.debug("Submitting order", { items: orderData.items });

      try {
        const order = await createOrder(orderData);
        componentLogger.info("Order created successfully", { orderId: (order as { id: string }).id });
      } catch (error) {
        componentLogger.error("Order creation failed", error as Error, {
          orderData,
        });
      }
    };
  };

  return OrderComponent;
}

function configurationExample(): void {
  logger.setLevel(LogLevel.WARN);

  logger.debug("This will not be logged");
  logger.info("This will not be logged");
  logger.warn("This will be logged");
  logger.error("This will be logged");

  logger.setLevel(LogLevel.DEBUG);
}

function hookExample(): () => { loadProducts: () => Promise<unknown[]> } {
  const useProducts = () => {
    const hookLogger = logger.withContext("useProducts");

    const loadProducts = async () => {
      hookLogger.debug("Loading products");

      try {
        const data = await fetchProductsApi();
        hookLogger.info("Products loaded", { count: (data as unknown[]).length });
        return data;
      } catch (error) {
        hookLogger.error("Failed to load products", error as Error);
        throw error;
      }
    };

    return { loadProducts };
  };

  return useProducts;
}

function globalContextExample(): void {
  logger.setContext("CHECKOUT");
  logger.info("Starting checkout process");
  logger.info("Validating cart");
  logger.info("Processing payment");
  logger.clearContext();

  logger.info("Checkout complete");
}

function createOrder(_data: unknown): Promise<unknown> {
  return Promise.resolve({});
}

function fetchProductsApi(): Promise<unknown[]> {
  return Promise.resolve([]);
}

export {
  basicUsageExample,
  contextExample,
  componentExample,
  configurationExample,
  hookExample,
  globalContextExample,
  ProductService,
};
