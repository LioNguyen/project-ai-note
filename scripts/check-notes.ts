/**
 * Script to check how many notes are in the database
 * Run: bun run scripts/check-notes.ts
 */

import prisma from "../src/app/(backend)/api/core/utils/db/prisma";

async function checkNotes() {
  try {
    const count = await prisma.note.count();
    console.log(`\n📊 Total notes in database: ${count}\n`);

    const notes = await prisma.note.findMany({
      select: { id: true, title: true, createdAt: true, userId: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    console.log("Most recent 10 notes:");
    console.log("=".repeat(80));
    notes.forEach((note, i) => {
      const date = note.createdAt.toISOString().split("T")[0];
      console.log(`${i + 1}. ${note.title}`);
      console.log(`   ID: ${note.id} | Date: ${date}`);
    });
    console.log("=".repeat(80) + "\n");
  } catch (error) {
    console.error("❌ Error checking notes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotes();
