import 'dotenv/config'; 
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { books, events, blogPosts, podcasts, livestreams, searchIndex } from "@shared/schema";
import { sql } from "drizzle-orm";

const pool = mysql.createPool({
  host: process.env.RDS_HOST,
  port: Number(process.env.RDS_PORT) || 3306,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});
const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  const existingBooks = await db.select().from(books);
  if (existingBooks.length > 0) {
    console.log("Database already has data. Rebuilding search index only...");
    await rebuildIndex();
    await pool.end();
    return;
  }

  await db.insert(books).values([
    { title: "The Path of Grace", author: "M.Devadas Ayyagaru", language: "English", category: "Theology", description: "A comprehensive exploration of divine grace and its transformative power in everyday life.", tags: ["grace", "theology", "salvation", "christian-living"] },
    { title: "ప్రార్థన శక్తి (Power of Prayer)", author: "M.Devadas Ayyagaru", language: "Telugu", category: "Prayer", description: "ప్రార్థన యొక్క శక్తి మరియు దేవునితో సంభాషణ గురించి లోతైన అధ్యయనం.", tags: ["prayer", "telugu", "devotion", "spiritual-growth"] },
    { title: "Divine Revelations", author: "M.Devadas Ayyagaru", language: "English", category: "Devotional", description: "Insights and revelations received through years of dedicated ministry and spiritual service.", tags: ["revelation", "devotional", "ministry", "faith"] },
    { title: "ఆధ్యాత్మిక ప్రయాణం (Spiritual Journey)", author: "M.Devadas Ayyagaru", language: "Telugu", category: "Sermons", description: "ఆధ్యాత్మిక ప్రయాణం - జీవితంలో దేవుని ప్రణాళికను అర్థం చేసుకోవడం.", tags: ["spiritual-journey", "telugu", "sermons", "god-plan"] },
    { title: "Foundations of Faith", author: "M.Devadas Ayyagaru", language: "English", category: "Theology", description: "Building a strong spiritual foundation through biblical truths and practical application.", tags: ["faith", "theology", "foundation", "bible-study"] },
    { title: "రక్షణ మార్గం (Way of Salvation)", author: "M.Devadas Ayyagaru", language: "Telugu", category: "Theology", description: "రక్షణ మార్గం గురించి వివరమైన బోధన మరియు ఆచరణాత్మక మార్గదర్శకం.", tags: ["salvation", "telugu", "theology", "teaching"] },
    { title: "Walking in Light", author: "M.Devadas Ayyagaru", language: "English", category: "Devotional", description: "Daily guidance for walking in the light of God's word and His promises.", tags: ["devotional", "light", "daily-reading", "christian-living"] },
    { title: "విశ్వాస జీవితం (Life of Faith)", author: "M.Devadas Ayyagaru", language: "Telugu", category: "Devotional", description: "విశ్వాసంతో జీవించడం - ప్రతిరోజూ దేవుని నమ్మకంతో నడవడం.", tags: ["faith", "telugu", "devotional", "daily-living"] },
  ]);

  await db.insert(events).values([
    {
      title: "Annual Global Convention 2026",
      description: "The flagship annual gathering bringing together believers from across the globe for four days of worship, teaching, and fellowship.",
      date: "2026-10-15", time: "9:00 AM - 9:00 PM Daily",
      location: "Bible Mission Grounds, Guntur, Andhra Pradesh",
      latitude: "16.3067", longitude: "80.4365",
      pastorName: "Multiple Speakers", approved: true,
      tags: ["convention", "global", "worship", "fellowship", "annual"],
    },
    {
      title: "Youth Revival Retreat",
      description: "A powerful one-day retreat focused on igniting the faith of young believers through dynamic worship and interactive sessions.",
      date: "2026-11-05", time: "10:00 AM - 5:00 PM",
      location: "City Convention Center, Hyderabad",
      latitude: "17.3850", longitude: "78.4867",
      pastorName: "Pastor Samuel", approved: true,
      tags: ["youth", "revival", "retreat", "worship"],
    },
    {
      title: "Regional Pastors Conference",
      description: "A conference for pastors and ministry leaders in the Andhra Pradesh region to equip and encourage one another.",
      date: "2026-12-12", time: "9:00 AM - 4:00 PM",
      location: "Grace Hall, Vijayawada",
      latitude: "16.5062", longitude: "80.6480",
      pastorName: "Rev. Daniel", approved: true,
      tags: ["pastors", "conference", "leadership", "ministry"],
    },
  ]);

  await db.insert(blogPosts).values([
    {
      title: "Walking in Light: A Daily Devotional",
      slug: "walking-in-light",
      content: "Let your light so shine before men, that they may see your good works and glorify your Father which is in heaven. — Matthew 5:16\n\nIn our daily walk with God, we are called to be lights in a world that often feels shrouded in darkness. This doesn't mean we must be perfect, but rather that we allow God's grace to shine through our imperfections...",
      excerpt: "A reflection on being a light in the world through daily acts of faith and grace.",
      author: "Bible Mission", category: "Devotional", published: true,
      tags: ["devotional", "light", "matthew", "grace", "daily-reading"],
    },
    {
      title: "The Unchanging Word in a Changing World",
      slug: "unchanging-word",
      content: "In an era of rapid change and uncertainty, the Word of God remains our constant anchor. As we navigate the complexities of modern life, the timeless truths found in Scripture provide direction, comfort, and hope...",
      excerpt: "How the timeless truths of Scripture provide direction in today's world.",
      author: "Bible Mission", category: "Teaching", published: true,
      tags: ["teaching", "scripture", "bible", "truth", "modern-life"],
    },
    {
      title: "ప్రార్థన యొక్క శక్తి – దేవునితో మాట్లాడటం",
      slug: "power-of-prayer-telugu",
      content: "ప్రార్థన అనేది దేవునితో మన సంభాషణ. ఇది కేవలం మన అవసరాలను చెప్పుకోవడం మాత్రమే కాదు, ఆయన సన్నిధిలో సమయం గడపడం...",
      excerpt: "ప్రార్థన యొక్క శక్తి గురించి తెలుగులో వివరణ.",
      author: "Bible Mission", category: "ప్రార్థన", published: true,
      tags: ["prayer", "telugu", "devotion", "spiritual-growth"],
    },
  ]);

  await db.insert(podcasts).values([
    { title: "Episode 101: The Power of Grace", description: "An exploration of how God's grace transforms our daily lives and relationships.", duration: "15 mins", episodeNumber: 101, published: true, tags: ["grace", "transformation", "relationships"], category: "Teaching" },
    { title: "Episode 102: Walking by Faith", description: "Understanding what it means to walk by faith and not by sight in today's world.", duration: "18 mins", episodeNumber: 102, published: true, tags: ["faith", "christian-living", "trust"], category: "Devotional" },
    { title: "Episode 103: The Heart of Worship", description: "Exploring true worship beyond music and into everyday devotion.", duration: "12 mins", episodeNumber: 103, published: true, tags: ["worship", "devotion", "music", "praise"], category: "Worship" },
  ]);

  await db.insert(livestreams).values([
    { title: "Sunday Global Service", description: "Weekly Sunday service broadcast live from Guntur Headquarters.", scheduledAt: "Every Sunday 10:00 AM IST", isLive: false, pastorName: "Senior Pastor", tags: ["sunday", "service", "global", "worship"], category: "Service" },
    { title: "Tuesday Bible Study", description: "Mid-week Bible study and discussion.", scheduledAt: "Every Tuesday 6:00 PM IST", isLive: false, pastorName: "Pastor James", tags: ["bible-study", "midweek", "teaching"], category: "Bible Study" },
    { title: "Friday Healing Prayer", description: "Weekly healing prayer service.", scheduledAt: "Every Friday 7:00 PM IST", isLive: false, pastorName: "Pastor Grace", tags: ["prayer", "healing", "friday", "intercession"], category: "Prayer" },
  ]);

  await rebuildIndex();

  console.log("Seeding complete!");
  await pool.end();
}

async function rebuildIndex() {
  console.log("Rebuilding search index...");
  await db.delete(searchIndex);

  const allBooks = await db.select().from(books);
  const allEvents = await db.select().from(events);
  const allPosts = await db.select().from(blogPosts);
  const allPodcasts = await db.select().from(podcasts);
  const allStreams = await db.select().from(livestreams);

  const entries: any[] = [];
  for (const b of allBooks) {
    entries.push({ sourceType: "Book", sourceId: b.id, title: b.title, description: b.description, author: b.author, category: b.category, tags: b.tags || [], language: b.language, imageUrl: b.coverImage, slug: null, date: null, metadata: null });
  }
  for (const e of allEvents) {
    entries.push({ sourceType: "Event", sourceId: e.id, title: e.title, description: e.description, author: e.pastorName, category: "Event", tags: e.tags || [], language: null, imageUrl: e.posterImage, slug: null, date: e.date, metadata: JSON.stringify({ location: e.location, time: e.time }) });
  }
  for (const p of allPosts) {
    entries.push({ sourceType: "Article", sourceId: p.id, title: p.title, description: p.excerpt || p.content.substring(0, 200), author: p.author, category: p.category, tags: p.tags || [], language: null, imageUrl: p.coverImage, slug: p.slug, date: p.createdAt?.toISOString().split("T")[0] || null, metadata: null });
  }
  for (const pod of allPodcasts) {
    entries.push({ sourceType: "Podcast", sourceId: pod.id, title: pod.title, description: pod.description, author: null, category: pod.category || "Podcast", tags: pod.tags || [], language: null, imageUrl: null, slug: null, date: pod.createdAt?.toISOString().split("T")[0] || null, metadata: JSON.stringify({ duration: pod.duration, episode: pod.episodeNumber }) });
  }
  for (const ls of allStreams) {
    entries.push({ sourceType: "Livestream", sourceId: ls.id, title: ls.title, description: ls.description, author: ls.pastorName, category: ls.category || "Livestream", tags: ls.tags || [], language: null, imageUrl: null, slug: null, date: null, metadata: JSON.stringify({ scheduledAt: ls.scheduledAt, isLive: ls.isLive }) });
  }
  if (entries.length > 0) await db.insert(searchIndex).values(entries);
  console.log(`Search index built with ${entries.length} entries.`);
}

seed().catch(console.error);
