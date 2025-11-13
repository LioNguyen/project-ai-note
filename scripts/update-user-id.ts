/**
 * Script to update all notes to a new userId
 * Run: bun run scripts/update-user-id.ts
 */

import prisma from "../src/app/api/core/utils/db/prisma";

const NEW_USER_ID = "user_2bX1QoJf9o1rtg3SVchU1UjVLTK";

async function updateUserId() {
  console.log("🚀 Starting userId update...\n");

  try {
    // Get current count
    const totalNotes = await prisma.note.count();
    console.log(`📊 Total notes in database: ${totalNotes}\n`);

    // Get unique userIds before update
    const uniqueUsers = await prisma.note.findMany({
      select: { userId: true },
      distinct: ["userId"],
    });

    console.log("Current user IDs:");
    uniqueUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.userId}`);
    });
    console.log();

    // Update all notes to new userId
    console.log(`🔄 Updating all notes to userId: ${NEW_USER_ID}...\n`);

    const result = await prisma.note.updateMany({
      data: {
        userId: NEW_USER_ID,
      },
    });

    console.log(`✅ Successfully updated ${result.count} notes!\n`);

    // Verify update
    const updatedCount = await prisma.note.count({
      where: { userId: NEW_USER_ID },
    });

    console.log("=".repeat(50));
    console.log("📊 Update Summary:");
    console.log(`  ✅ Notes with new userId: ${updatedCount}`);
    console.log(`  👤 New userId: ${NEW_USER_ID}`);
    console.log("=".repeat(50) + "\n");

    console.log("🎉 All notes successfully updated!");
  } catch (error) {
    console.error("❌ Fatal error during update:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("\n✨ Update completed.");
  }
}

// Run the script
updateUserId();
