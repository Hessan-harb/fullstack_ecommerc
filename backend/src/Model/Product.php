<?php
// src/Model/Product.php

namespace App\Model;

class Product {
    public $id;
    public $name;
    public $inStock;
    public $gallery;
    public $description;
    public $category;
    public $attributes;
    public $prices;
    public $brand;

    public static function find($id) {
        global $pdo;
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $product = $stmt->fetch();

        if (!$product) {
            return null;
        }

        $product = self::fetchRelatedData($product);
        return $product;
    }

    public static function where($column, $value) {
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM products WHERE $column = :value");
        $stmt->execute(['value' => $value]);
        $products = $stmt->fetchAll();

        foreach ($products as &$product) {
            $product = self::fetchRelatedData($product);
        }

        return $products;
    }

    public static function all() {
        global $pdo;
        $stmt = $pdo->query('SELECT * FROM products');
        $products = $stmt->fetchAll();

        foreach ($products as &$product) {
            $product = self::fetchRelatedData($product);
        }

        return $products;
    }

    private static function fetchRelatedData($product) {
        global $pdo;

        // Fetch prices
        $stmt = $pdo->prepare('SELECT * FROM prices WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $product['id']]);
        $product['prices'] = $stmt->fetchAll();

        // Fetch gallery
        $stmt = $pdo->prepare('SELECT image_url FROM galleries WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $product['id']]);
        $product['gallery'] = array_column($stmt->fetchAll(), 'image_url');

        // Fetch attributes
        $stmt = $pdo->prepare('SELECT * FROM attributes WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $product['id']]);
        $attributes = $stmt->fetchAll();

        foreach ($attributes as &$attribute) {
            $stmt = $pdo->prepare('SELECT * FROM attribute_items WHERE attribute_id = :attribute_id');
            $stmt->execute(['attribute_id' => $attribute['id']]);
            $attribute['items'] = $stmt->fetchAll();
        }

        $product['attributes'] = $attributes;

        return $product;
    }
}

$r=new Product();
$r->find('huarache-x-stussy-le');
?>
