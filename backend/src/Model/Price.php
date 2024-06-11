<?php
// src/Model/Price.php
namespace App\Model;
use PDO;

class Price {
    public static function findByProductId($productId, $pdo) {
        $stmt = $pdo->prepare('SELECT * FROM prices WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
