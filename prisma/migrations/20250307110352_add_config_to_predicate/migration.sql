/*
  Warnings:

  - Added the required column `config` to the `predicateEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "predicateEntry" ADD COLUMN     "config" JSONB NOT NULL;
