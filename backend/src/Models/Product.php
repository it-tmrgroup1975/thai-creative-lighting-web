<?php
namespace App\Models;

/**
 * Product Model อ้างอิงตามโครงสร้างจาก sky-website.pdf
 * เน้นการใช้ Strict Typing และ Constructor Property Promotion ใน PHP 8
 */
class Product {
    public function __construct(
        public ?int $id = null,
        public string $sku,           // เช่น JUSTIN-B15
        public string $name,          // เช่น CHANKAPOR
        public string $style,         // Classic, Modern, Semi-Modern
        public ?string $material,     // อลูมิเนียม/เคลือบแก้ว
        public ?string $size_info,    // 18x23x33 cm.
        public ?string $bulb_type,    // E27
        public float $price = 0.0,
        public string $stock_status = 'Ready to Ship',
        public array $images = []     // รายการ URL รูปภาพ
    ) {}

    /**
     * แปลงข้อมูลเป็น Array เพื่อส่งออก API (JSON)
     * อ้างอิงคำแนะนำจาก "The Art of Modern PHP 8"
     */
    public function toSimpleArray(): array {
        return [
            'id'           => $this->id,
            'sku'          => $this->sku,
            'name'         => $this->name,
            'style'        => $this->style,
            'specs'        => [
                'material' => $this->material,
                'size'     => $this->size_info,
                'bulb'     => $this->bulb_type,
            ],
            'price'        => $this->price,
            'status'       => $this->stock_status,
            'images'       => $this->images,
            'display_image' => $this->images[0] ?? 'default-placeholder.jpg'
        ];
    }
}