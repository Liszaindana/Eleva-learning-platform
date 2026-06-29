/*
  Warnings:

  - The primary key for the `exams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `minimumScore` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enrollments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class_id` to the `exams` table without a default value. This is not possible if the table is not empty.
  - The required column `exam_id` was added to the `exams` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_mentorId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollments` DROP FOREIGN KEY `enrollments_classId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollments` DROP FOREIGN KEY `enrollments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `exam_results` DROP FOREIGN KEY `exam_results_examId_fkey`;

-- DropForeignKey
ALTER TABLE `exam_results` DROP FOREIGN KEY `exam_results_userId_fkey`;

-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_classId_fkey`;

-- DropForeignKey
ALTER TABLE `materials` DROP FOREIGN KEY `materials_classId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_classId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_mentorId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_userId_fkey`;

-- DropIndex
DROP INDEX `exams_classId_fkey` ON `exams`;

-- AlterTable
ALTER TABLE `exams` DROP PRIMARY KEY,
    DROP COLUMN `classId`,
    DROP COLUMN `id`,
    DROP COLUMN `minimumScore`,
    ADD COLUMN `class_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `exam_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `is_passed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `min_score` INTEGER NOT NULL DEFAULT 60,
    ADD COLUMN `score` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`exam_id`);

-- DropTable
DROP TABLE `classes`;

-- DropTable
DROP TABLE `enrollments`;

-- DropTable
DROP TABLE `exam_results`;

-- DropTable
DROP TABLE `materials`;

-- DropTable
DROP TABLE `mentors`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `role` (
    `role_id` VARCHAR(191) NOT NULL,
    `role_text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `join_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `category_id` VARCHAR(191) NOT NULL,
    `categories` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode` (
    `periode_id` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`periode_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `level` (
    `level_id` VARCHAR(191) NOT NULL,
    `level_info` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`level_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class` (
    `class_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `periode_id` VARCHAR(191) NOT NULL,
    `level_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollment` (
    `enrollment_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `role_in_class` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`enrollment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materi` (
    `materi_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `video_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`materi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `review_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
