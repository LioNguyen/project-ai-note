/**
 * Script to create 20 random notes and sync them to Pinecone
 * Run: bun run scripts/create-random-notes.ts
 */

import { notesIndex } from "../src/app/api/core/utils/db/pinecone";
import prisma from "../src/app/api/core/utils/db/prisma";
import { getEmbedding } from "../src/app/api/core/utils/openai";

// Sample data for random note generation
const noteTitles = [
  "Meeting Notes - Q4 Planning",
  "Shopping List",
  "Book Recommendations",
  "Project Ideas",
  "Daily Journal Entry",
  "Recipe: Chocolate Cake",
  "Travel Itinerary - Japan",
  "Workout Routine",
  "Learning Goals 2025",
  "Gift Ideas",
  "Home Improvement Tasks",
  "Movie Watchlist",
  "Budget Planning",
  "Meditation Tips",
  "Code Snippets",
  "Restaurant Recommendations",
  "Birthday Party Planning",
  "New Year Resolutions",
  "Gardening Notes",
  "Interview Preparation",
  "Product Launch Ideas",
  "Weekly Review",
  "Study Notes - React",
  "Vacation Planning",
  "Side Project Ideas",
];

const noteContents = [
  "Need to review the quarterly goals and set new KPIs for the team. Focus on customer satisfaction and product improvements.",
  "Milk, eggs, bread, coffee, fruits, vegetables, chicken, rice, pasta, olive oil.",
  "1. The Great Gatsby\n2. To Kill a Mockingbird\n3. 1984\n4. Pride and Prejudice\n5. The Catcher in the Rye",
  "Create a mobile app for task management with AI suggestions. Build a personal blog about web development.",
  "Today was productive. Completed three major tasks and had a great meeting with the team. Feeling accomplished!",
  "Ingredients:\n- 2 cups flour\n- 1 cup sugar\n- 3 eggs\n- 1 cup cocoa powder\n- 1 tsp vanilla extract\n\nBake at 350°F for 30 minutes.",
  "Day 1: Tokyo - Visit Shibuya and Shinjuku\nDay 2: Kyoto - Temples and gardens\nDay 3: Osaka - Food tour",
  "Monday: Chest and triceps\nTuesday: Back and biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio and abs",
  "1. Master TypeScript and Next.js\n2. Learn Rust\n3. Complete AWS certification\n4. Build 3 full-stack projects",
  "Mom: Cashmere scarf\nDad: Smart watch\nSister: Novel series\nBest friend: Concert tickets",
  "- Repaint the living room\n- Fix the leaky faucet\n- Replace door handles\n- Clean the gutters",
  "Must watch:\n- The Shawshank Redemption\n- Inception\n- Interstellar\n- The Dark Knight\n- Pulp Fiction",
  "Income: $5000\nExpenses:\n- Rent: $1500\n- Food: $600\n- Utilities: $200\n- Entertainment: $300\nSavings: $2400",
  "Practice mindfulness for 10 minutes daily. Focus on breath. Let thoughts pass without judgment. Start with 5 minutes if needed.",
  "// React custom hook for debounce\nconst useDebounce = (value, delay) => {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n};",
  "Italian: Bella Vita on Main St\nJapanese: Sushi Palace\nMexican: El Camino\nIndian: Spice Garden\nThai: Bangkok Kitchen",
  "Date: March 15th\nVenue: Garden Pavilion\nGuests: 50 people\nTheme: Garden party\nCatering: Italian buffet\nEntertainment: Live jazz band",
  "1. Exercise 3x per week\n2. Read 24 books\n3. Learn a new language\n4. Save $10,000\n5. Travel to 3 new countries",
  "Planted tomatoes, peppers, and herbs in the spring garden. Remember to water daily and add fertilizer bi-weekly. Harvest expected in June.",
  "Technical preparation:\n- Review data structures\n- Practice LeetCode problems\n- Prepare system design examples\n\nBehavioral:\n- STAR method for past experiences\n- Research company culture",
  "Product: AI-powered note-taking app\nTarget: Professionals and students\nFeatures: Smart categorization, voice notes, collaboration\nLaunch: Q2 2025",
  "Wins:\n- Completed project ahead of schedule\n- Positive feedback from client\n- Learned new framework\n\nImprove:\n- Better time management\n- More code reviews",
  "React Hooks:\n- useState: State management\n- useEffect: Side effects\n- useContext: Context API\n- useMemo: Memoization\n- useCallback: Function memoization",
  "Destination: Bali, Indonesia\nDuration: 10 days\nActivities: Beach, temples, hiking, surfing\nAccommodation: Beachfront villa\nBudget: $3000",
  "1. Chrome extension for productivity\n2. Weather app with beautiful UI\n3. Social media dashboard\n4. E-commerce platform\n5. Portfolio website generator",
];

async function createRandomNotes() {
  console.log("🚀 Starting random notes creation...\n");

  try {
    // Get the first user ID from the database (or prompt for one)
    console.log("👤 Finding user in database...");
    const user = await prisma.note.findFirst({
      select: { userId: true },
    });

    if (!user) {
      console.error(
        "❌ No users found in database. Please create a user first through the app.",
      );
      process.exit(1);
    }

    const userId = user.userId;
    console.log(`✅ Using user ID: ${userId}\n`);

    // Generate 20 random notes
    const notesToCreate = 20;
    let successCount = 0;
    let errorCount = 0;

    console.log(`📝 Creating ${notesToCreate} random notes...\n`);

    for (let i = 0; i < notesToCreate; i++) {
      try {
        // Select random title and content
        const titleIndex = Math.floor(Math.random() * noteTitles.length);
        const contentIndex = Math.floor(Math.random() * noteContents.length);

        const title = `${noteTitles[titleIndex]} ${i + 1}`;
        const content = noteContents[contentIndex];

        // Create note in database
        const note = await prisma.note.create({
          data: {
            title,
            content,
            userId,
          },
        });

        console.log(`  ✓ Created note: "${note.title}" (ID: ${note.id})`);

        // Generate embedding
        const noteText = note.title + "\n\n" + (note.content || "");
        const embedding = await getEmbedding(noteText);

        // Upsert to Pinecone
        await notesIndex.upsert([
          {
            id: note.id,
            values: embedding,
            metadata: {
              userId: note.userId,
            },
          },
        ]);

        console.log(`  ✓ Synced to Pinecone: "${note.title}"\n`);

        successCount++;

        // Add small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ✗ Failed to create note ${i + 1}:`, error);
        errorCount++;
      }
    }

    console.log("=".repeat(50));
    console.log("📊 Creation Summary:");
    console.log(`  ✅ Successfully created: ${successCount} notes`);
    console.log(`  ❌ Failed: ${errorCount} notes`);
    console.log("=".repeat(50) + "\n");

    if (errorCount > 0) {
      console.log(
        "⚠️  Some notes failed to create. Check the error messages above.",
      );
    } else {
      console.log("🎉 All notes successfully created and synced to Pinecone!");
    }
  } catch (error) {
    console.error("❌ Fatal error during note creation:", error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await prisma.$disconnect();
    console.log("\n✨ Process completed.");
  }
}

// Run the script
createRandomNotes();
