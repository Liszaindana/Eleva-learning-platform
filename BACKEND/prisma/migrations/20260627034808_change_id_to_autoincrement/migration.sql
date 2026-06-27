/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `category_id` on the `category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `class_id` on the `class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `category_id` on the `class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `periode_id` on the `class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `level_id` on the `class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `enrollment_id` on the `enrollment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `user_id` on the `enrollment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `class_id` on the `enrollment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `exams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `class_id` on the `exams` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `exam_id` on the `exams` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `user_id` on the `exams` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `level` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `level_id` on the `level` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `materi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `materi_id` on the `materi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `class_id` on the `materi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `periode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `periode_id` on the `periode` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `user_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `class_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `role_id` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `role_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `class_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `class_level_id_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `class_periode_id_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `enrollment_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `enrollment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `materi` DROP FOREIGN KEY `materi_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_role_id_fkey`;

-- DropIndex
DROP INDEX `class_category_id_fkey` ON `class`;

-- DropIndex
DROP INDEX `class_level_id_fkey` ON `class`;

-- DropIndex
DROP INDEX `class_periode_id_fkey` ON `class`;

-- DropIndex
DROP INDEX `enrollment_class_id_fkey` ON `enrollment`;

-- DropIndex
DROP INDEX `enrollment_user_id_fkey` ON `enrollment`;

-- DropIndex
DROP INDEX `exams_class_id_fkey` ON `exams`;

-- DropIndex
DROP INDEX `exams_user_id_fkey` ON `exams`;

-- DropIndex
DROP INDEX `materi_class_id_fkey` ON `materi`;

-- DropIndex
DROP INDEX `review_class_id_fkey` ON `review`;

-- DropIndex
DROP INDEX `review_user_id_fkey` ON `review`;

-- DropIndex
DROP INDEX `user_role_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `category` DROP PRIMARY KEY,
    MODIFY `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`category_id`);

-- AlterTable
ALTER TABLE `class` DROP PRIMARY KEY,
    MODIFY `class_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `category_id` INTEGER NOT NULL,
    MODIFY `periode_id` INTEGER NOT NULL,
    MODIFY `level_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`class_id`);

-- AlterTable
ALTER TABLE `enrollment` DROP PRIMARY KEY,
    MODIFY `enrollment_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `class_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`enrollment_id`);

-- AlterTable
ALTER TABLE `exams` DROP PRIMARY KEY,
    MODIFY `class_id` INTEGER NOT NULL,
    MODIFY `exam_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`exam_id`);

-- AlterTable
ALTER TABLE `level` DROP PRIMARY KEY,
    MODIFY `level_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`level_id`);

-- AlterTable
ALTER TABLE `materi` DROP PRIMARY KEY,
    MODIFY `materi_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `class_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`materi_id`);

-- AlterTable
ALTER TABLE `periode` DROP PRIMARY KEY,
    MODIFY `periode_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`periode_id`);

-- AlterTable
ALTER TABLE `review` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `class_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    MODIFY `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`role_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `role_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`periode_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `level`(`level_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materi` ADD CONSTRAINT `materi_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
