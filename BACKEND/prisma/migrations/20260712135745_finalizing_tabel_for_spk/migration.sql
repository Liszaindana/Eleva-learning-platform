/*
  Warnings:

  - A unique constraint covering the columns `[id_kriteria,value]` on the table `kriteria_value` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `kriteria` ADD COLUMN `kepentingan` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `kriteria_value_id_kriteria_value_key` ON `kriteria_value`(`id_kriteria`, `value`);
