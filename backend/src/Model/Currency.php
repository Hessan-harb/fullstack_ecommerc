<?php
// src/Model/Currency.php
namespace App\Model;
use PDO;

class Currency {
    public static function find($id, $pdo) {
        $stmt = $pdo->prepare('SELECT * FROM currencies WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public static function findAll($pdo) {
        $stmt = $pdo->query('SELECT * FROM currencies');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
