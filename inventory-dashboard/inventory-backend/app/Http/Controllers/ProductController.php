<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
            'status' => 'required|string',
            'sku' => 'required|string|unique:products,sku',
            'expiry' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($validated);
        
        // Set out_of_stock_date if stock is 0
        if ($product->stock === 0) {
            $product->out_of_stock_date = now();
            $product->save();
        }

        return $product;
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
            'status' => 'required|string',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'expiry' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        // Update out_of_stock_date based on stock
        if ($product->stock === 0 && !$product->out_of_stock_date) {
            $product->out_of_stock_date = now();
            $product->save();
        } elseif ($product->stock > 0) {
            $product->out_of_stock_date = null;
            $product->save();
        }

        return $product;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
