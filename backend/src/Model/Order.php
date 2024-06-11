<?php 

namespace App\Model;

class Order {
    
    public function create($productIds) {
        global $pdo;

        try {
            $products = [];
            $totalAmount = 0;

            foreach ($productIds as $productId) {
                $product = $this->findProductById($productId);
                if ($product) {
                    $price = $this->findPriceByProductId($productId);
                    if ($price) {
                        $product['price'] = $price['amount'];
                        $totalAmount += $price['amount']; // Calculate totalAmount
                        $products[] = $product;
                    } else {
                        throw new \RuntimeException("Price not found for product ID: " . $productId);
                    }
                } else {
                    throw new \RuntimeException("Product not found for ID: " . $productId);
                }
            }

            $productsJson = json_encode($products); // Convert to JSON for storage

            // Insert order into the database
            $stmt = $pdo->prepare("INSERT INTO orders (products, total_amount) VALUES (:products, :total_amount)");
            $stmt->bindParam(':products', $productsJson);
            $stmt->bindParam(':total_amount', $totalAmount);

            if ($stmt->execute()) {
                $orderId = $pdo->lastInsertId();
                $order = $this->find($orderId);
                $order['products'] = $products;
                $order['totalAmount'] = $totalAmount; // Set totalAmount in the returned order
                return $order;
            } else {
                throw new \RuntimeException("Failed to create order");
            }
        } catch (\Throwable $e) {
            throw new \RuntimeException("Order creation failed: " . $e->getMessage());
        }
    }

    public function find($id) {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($order) {
                $order['products'] = $this->findProductsByIds(json_decode($order['products'], true));
                return $order;
            } else {
                throw new \RuntimeException("Order not found for ID: " . $id);
            }
        } catch (\Throwable $e) {
            throw new \RuntimeException("Order retrieval failed: " . $e->getMessage());
        }
    }


    private function findProductById($id) {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT id, name FROM products WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\Throwable $e) {
            error_log("Product retrieval failed for ID: " . $id . ". Error: " . $e->getMessage());
            throw new \RuntimeException("Product retrieval failed for ID: " . $id . ". Error: " . $e->getMessage());
        }
    }

    private function findPriceByProductId($productId) {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT amount FROM prices WHERE product_id = :product_id");
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\Throwable $e) {
            error_log("Price retrieval failed for product ID: " . $productId . ". Error: " . $e->getMessage());
            throw new \RuntimeException("Price retrieval failed for product ID: " . $productId . ". Error: " . $e->getMessage());
        }
    }

    private function findProductsByIds($ids) {
        global $pdo;
    
        try {
            // Ensure $ids is an array
            if (!is_array($ids)) {
                throw new \InvalidArgumentException('IDs must be an array');
            }
    
            // Prepare placeholders for the IN clause
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
    
            // Prepare the SQL statement with placeholders
            $stmt = $pdo->prepare("SELECT id, name FROM products WHERE id IN ($placeholders)");
    
            // Bind parameters and execute the statement
            //$stmt->execute($ids);
    
            // Fetch products as associative array
            $products = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    
            foreach ($products as &$product) {
                // Assuming findPriceByProductId returns an array with 'amount' key
                $price = $this->findPriceByProductId($product['id']);
                $product['price'] = $price['amount'];
            }
    
            return $products;
        } catch (\Throwable $e) {
            error_log("Products retrieval failed for IDs: " . implode(', ', $ids) . ". Error: " . $e->getMessage());
            throw new \RuntimeException("Products retrieval failed for IDs: " . implode(', ', $ids) . ". Error: " . $e->getMessage());
        }
    }
    
    
    
    
}
