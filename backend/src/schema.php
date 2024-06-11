<?php
namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use RuntimeException;
use Throwable;
use App\Model\Category;
use App\Model\Product;
use App\Model\Order;
class GraphQLController {
    static public function handle() {
        try {
            // Define the Price Type
            $priceType = new ObjectType([
                'name' => 'Price',
                'fields' => [
                    'amount' => Type::float(),
                    'currency_label' => Type::string(),
                    'currency_symbol' => Type::string()
                ]
            ]);

            // Define the Attribute Item Type
            $attributeItemType = new ObjectType([
                'name' => 'AttributeItem',
                'fields' => [
                    'displayValue' => Type::string(),
                    'value' => Type::string()
                ]
            ]);

            // Define the Attribute Type
            $attributeType = new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'name' => Type::string(),
                    'type' => Type::string(),
                    'items' => Type::listOf($attributeItemType)
                ]
            ]);

            // Define the Category Type
            $categoryType = new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'id' => Type::int(),
                    'name' => Type::string()
                ]
            ]);

            // Define the Product Type
            $productType = new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => Type::string(),
                    'name' => Type::string(),
                    'price' => Type::float(),
                    'inStock' => Type::boolean(),
                    'description' => Type::string(),
                    'category' => Type::string(),
                    'brand' => Type::string(),
                    'prices' => Type::listOf($priceType),
                    'gallery' => Type::listOf(Type::string()),
                    'attributes' => Type::listOf($attributeType)
                ]
            ]);

            // Define the Order Type
            $orderType = new ObjectType([
                'name' => 'Order',
                'fields' => [
                    'id' => Type::int(),
                    'products' => Type::listOf($productType),
                    'totalAmount' => Type::float(),
                ]
            ]);

            // Define the Mutation Type
            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'createOrder' => [
                        'type' => $orderType,
                        'args' => [
                            'products' => Type::nonNull(Type::listOf(Type::string())),
                        ],
                        'resolve' => function($root, $args) {
                            try {
                                $order = new Order();
                                return $order->create($args['products']);
                            } catch (Throwable $e) {
                                error_log("Order creation failed: " . $e->getMessage());
                                // Temporary output of error message for debugging
                                return [
                                    'errors' => [
                                        ['message' => $e->getMessage()]
                                    ]
                                ];
                            }
                        }
                    ]
                ]
            ]);

            // Define the Query Type
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'product' => [
                        'type' => $productType,
                        'args' => [
                            'id' => Type::nonNull(Type::string())
                        ],
                        'resolve' => function($root, $args) {
                            return Product::find($args['id']);
                        }
                    ],
                    'categories' => [
                        'type' => Type::listOf($categoryType),
                        'resolve' => function() {
                            return Category::all();
                        }
                    ],
                    'productsByCategory' => [
                        'type' => Type::listOf($productType),
                        'args' => [
                            'category' => Type::nonNull(Type::string())
                        ],
                        'resolve' => function($root, $args) {
                            return Product::where('category', $args['category']);
                        }
                    ],
                    'products' => [
                        'type' => Type::listOf($productType),
                        'resolve' => function() {
                            return Product::all();
                        }
                    ]
                ]
            ]);

            // Create the schema
            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType
            ]);

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            if (!isset($input['query'])) {
                throw new RuntimeException('No query provided');
            }
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            error_log("GraphQL error: " . $e->getMessage());
            $output = [
                'errors' => [
                    ['message' => $e->getMessage()]
                ]
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        
        echo json_encode($output);
    }
}
