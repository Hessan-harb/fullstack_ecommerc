<?php
// src/Model/Category.php

namespace App\Model;

class Category {
    public $id;
    public $name;

    public static function find($id) {
        global $pdo;
        $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $category = $stmt->fetch();

        if (!$category) {
            return null;
        }

        return $category;
    }

    public static function where($column, $value) {
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE $column = :value");
        $stmt->execute(['value' => $value]);
        $categories = $stmt->fetchAll();

        return $categories;
    }

    public static function all() {
        global $pdo;
        $stmt = $pdo->query('SELECT * FROM categories');
        $categories = $stmt->fetchAll();

        return $categories;
    }
}
?>
