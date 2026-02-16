import { logger, LogLevel } from "./logger";

// Exemplo 1: Uso básico
function basicUsageExample() {
  logger.debug("Debugging application state", { state: "loading" });
  logger.info("User action completed", { action: "submit_form" });
  logger.warn("Deprecated API used", { endpoint: "/api/v1/old" });

  try {
    throw new Error("Something went wrong");
  } catch (error) {
    logger.error("Failed to process request", error, { userId: 123 });
  }
}

// Exemplo 2: Uso com contexto
function contextExample() {
  const authLogger = logger.withContext("AUTH");

  authLogger.info("User login attempt", { username: "john.doe" });
  authLogger.info("Token generated");
  authLogger.info("Login successful");
}

// Exemplo 3: Uso em serviço
class ProductService {
  constructor() {
    this.logger = logger.withContext("ProductService");
  }

  async fetchProducts() {
    this.logger.debug("Fetching products from API");

    try {
      const response = await fetch("/api/products");
      const products = await response.json();

      this.logger.info("Products fetched successfully", {
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger.error("Failed to fetch products", error, {
        url: "/api/products",
      });
      throw error;
    }
  }

  async createProduct(data) {
    this.logger.info("Creating new product", { name: data.name });

    try {
      const product = await this.saveProduct(data);
      this.logger.info("Product created", { id: product.id });
      return product;
    } catch (error) {
      this.logger.error("Failed to create product", error, { data });
      throw error;
    }
  }

  saveProduct() {}
}

// Exemplo 4: Uso em componente React
function componentExample() {
  const OrderComponent = () => {
    const componentLogger = logger.withContext("OrderComponent");

    const _handleSubmit = async (orderData) => {
      componentLogger.debug("Submitting order", { items: orderData.items });

      try {
        const order = await createOrder(orderData);
        componentLogger.info("Order created successfully", { orderId: order.id });
      } catch (error) {
        componentLogger.error("Order creation failed", error, {
          orderData,
        });
      }
    };
  };

  return OrderComponent;
}

// Exemplo 5: Configuração de nível de log
function configurationExample() {
  logger.setLevel(LogLevel.WARN);

  logger.debug("This will not be logged");
  logger.info("This will not be logged");
  logger.warn("This will be logged");
  logger.error("This will be logged");

  logger.setLevel(LogLevel.DEBUG);
}

// Exemplo 6: Uso em hook customizado
function hookExample() {
  const useProducts = () => {
    const hookLogger = logger.withContext("useProducts");

    const loadProducts = async () => {
      hookLogger.debug("Loading products");

      try {
        const data = await fetchProductsApi();
        hookLogger.info("Products loaded", { count: data.length });
        return data;
      } catch (error) {
        hookLogger.error("Failed to load products", error);
        throw error;
      }
    };

    return { loadProducts };
  };

  return useProducts;
}

// Exemplo 7: Contexto global e temporário
function globalContextExample() {
  logger.setContext("CHECKOUT");
  logger.info("Starting checkout process");
  logger.info("Validating cart");
  logger.info("Processing payment");
  logger.clearContext();

  logger.info("Checkout complete");
}

function createOrder() {}
function fetchProductsApi() {}

export {
  basicUsageExample,
  contextExample,
  componentExample,
  configurationExample,
  hookExample,
  globalContextExample,
  ProductService,
};
