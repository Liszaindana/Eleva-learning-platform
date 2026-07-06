/*
  Warnings:

  - You are about to alter the column `year` on the `periode` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `exams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_text]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_user_id_fkey`;

-- AlterTable
ALTER TABLE `periode` MODIFY `year` INTEGER NOT NULL;

-- DropTable
DROP TABLE `exams`;

-- CreateTable
CREATE TABLE `exam` (
    `exam_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `min_score` INTEGER NOT NULL DEFAULT 60,
    `score` INTEGER NOT NULL DEFAULT 0,
    `is_passed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`exam_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria` (
    `id_kriteria` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `bobot` DOUBLE NOT NULL,

    UNIQUE INDEX `kriteria_kode_key`(`kode`),
    PRIMARY KEY (`id_kriteria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria_value` (
    `id_value` INTEGER NOT NULL AUTO_INCREMENT,
    `id_kriteria` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,

    PRIMARY KEY (`id_value`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendation_request` (
    `id_recomen` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `periode_id` INTEGER NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_recomen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_bobot` (
    `id_bobot` INTEGER NOT NULL AUTO_INCREMENT,
    `id_recomen` INTEGER NOT NULL,
    `id_kriteria` INTEGER NOT NULL,
    `bobot_req` DOUBLE NOT NULL,

    PRIMARY KEY (`id_bobot`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendation_result` (
    `id_hasil` INTEGER NOT NULL AUTO_INCREMENT,
    `id_recomen` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `ranking` INTEGER NOT NULL,

    PRIMARY KEY (`id_hasil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `role_role_text_key` ON `role`(`role_text`);

-- AddForeignKey
ALTER TABLE `exam` ADD CONSTRAINT `exam_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam` ADD CONSTRAINT `exam_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria_value` ADD CONSTRAINT `kriteria_value_id_kriteria_fkey` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria`(`id_kriteria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation_request` ADD CONSTRAINT `recommendation_request_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation_request` ADD CONSTRAINT `recommendation_request_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation_request` ADD CONSTRAINT `recommendation_request_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`periode_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_bobot` ADD CONSTRAINT `request_bobot_id_recomen_fkey` FOREIGN KEY (`id_recomen`) REFERENCES `recommendation_request`(`id_recomen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_bobot` ADD CONSTRAINT `request_bobot_id_kriteria_fkey` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria`(`id_kriteria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation_result` ADD CONSTRAINT `recommendation_result_id_recomen_fkey` FOREIGN KEY (`id_recomen`) REFERENCES `recommendation_request`(`id_recomen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendation_result` ADD CONSTRAINT `recommendation_result_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
