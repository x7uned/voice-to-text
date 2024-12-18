/*
  Warnings:

  - You are about to drop the column `content` on the `Record` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `words` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "content",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "words" INTEGER NOT NULL;
