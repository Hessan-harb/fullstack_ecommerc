<?php
// src/Model/Attribute.php
namespace App\Model;
use PDO;

class Attribute {
    public static function findByProductId($productId, $pdo) {
        $stmt = $pdo->prepare('SELECT * FROM attributes WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
