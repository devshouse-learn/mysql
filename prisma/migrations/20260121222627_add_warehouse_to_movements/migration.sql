-- AlterTable
ALTER TABLE "inventory_movements" ADD COLUMN     "warehouse_id" INTEGER;

-- CreateIndex
CREATE INDEX "inventory_movements_warehouse_id_idx" ON "inventory_movements"("warehouse_id");

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
