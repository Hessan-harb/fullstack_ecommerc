<?php
// src/Model/AttributeSet.php
namespace App\Model;
use PDO;

class AttributeSet {
    public static function find($id, $pdo) {
        $stmt = $pdo->prepare('SELECT * FROM attribute_sets WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
