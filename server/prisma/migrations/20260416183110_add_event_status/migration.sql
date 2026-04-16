-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('scheduled', 'cancelled');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'scheduled';
