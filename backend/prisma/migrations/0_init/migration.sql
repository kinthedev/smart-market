-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "column_3" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

