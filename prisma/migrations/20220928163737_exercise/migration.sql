-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "gitHubUrl" VARCHAR(255) NOT NULL,
    "readMeUrl" VARCHAR(255) NOT NULL,
    "objectives" TEXT[],

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseUser" (
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseUser_userId_exerciseId_key" ON "ExerciseUser"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "ExerciseUser" ADD CONSTRAINT "ExerciseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseUser" ADD CONSTRAINT "ExerciseUser_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
