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

{ imageId: "1", title: "Telugu Christhava Keerthanalu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "teluguchristhavakeerthanalu", category: "Hymns", description: "దేవుని స్తుతిస్తూ పాడే ఆత్మీయ క్రైస్తవ కీర్తనల సమాహారం.", sourceUrl: null, sourceType: "pdf", tags: ["hymns","praise","worship","church-songs","devotional-music"] },

{ imageId: "2", title: "Sannidhi Kramavali", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "sannidhikramavali", category: "Worship", description: "దేవుని సన్నిధిలో ఆరాధనను క్రమబద్ధంగా నిర్వహించడానికి మార్గదర్శకం.", sourceUrl: null, sourceType: "pdf", tags: ["worship","presence-of-god","church","devotion"] },

{ imageId: "3", title: "Daiva Lakshanamula Sthuthi", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "daivalakshanamulasthuthi", category: "Theology", description: "దేవుని దివ్య లక్షణాలను స్తుతిస్తూ వివరించే గ్రంథం.", sourceUrl: null, sourceType: "pdf", tags: ["attributes-of-god","praise","theology","holiness"] },

{ imageId: "4", title: "Satanu nedirinchu Soothramulu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "satannedirinchusootramulu", category: "Christian Living", description: "సాతాను ప్రలోభాలను ఎదిరించడానికి ఆత్మీయ మార్గదర్శక సూత్రాలు.", sourceUrl: null, sourceType: "pdf", tags: ["spiritual-war","faith","victory","temptation"] },

{ imageId: "5", title: "Samarpana Prardhanalu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "samarpanaprardhanalu", category: "Prayer", description: "దేవునికి సంపూర్ణ సమర్పణతో చేసే ప్రార్థనల సమాహారం.", sourceUrl: null, sourceType: "pdf", tags: ["prayer","dedication","surrender","devotion"] },

{ imageId: "6", title: "Rakada Prardhanalu Sthuthulu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "rakadaprardhanlusthuthulu", category: "Prophecy", description: "ప్రభువు రాకడను ఎదురుచూస్తూ చేసే ప్రార్థనలు మరియు స్తుతులు.", sourceUrl: null, sourceType: "pdf", tags: ["second-coming","prophecy","watchfulness","jesus-return"] },

{ imageId: "7", title: "Upavasa Pradhana Deeksha", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "upavasaprardhanadiksha", category: "Spiritual Discipline", description: "ఉపవాసం మరియు ప్రార్థన ద్వారా ఆత్మీయ జీవితం బలపడే విధానాన్ని వివరిస్తుంది.", sourceUrl: null, sourceType: "pdf", tags: ["fasting","prayer","discipline","seeking-god"] },

{ imageId: "8", title: "Suvisesha Dhorani", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "suvisheshadorani", category: "Evangelism", description: "సువార్త ప్రచారం యొక్క విధానం మరియు ఆత్మీయ దృక్పథం.", sourceUrl: null, sourceType: "pdf", tags: ["gospel","evangelism","mission","salvation"] },

{ imageId: "9", title: "Siluva Viluva Dyanakaluva", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "siluvaviluvadyanakaluva", category: "Devotional", description: "సిలువ యొక్క విలువను ధ్యానిస్తూ విశ్వాసాన్ని గాఢతరం చేసే గ్రంథం.", sourceUrl: null, sourceType: "pdf", tags: ["cross","lent","redemption","sacrifice","jesus-crucifixion"] },

{ imageId: "10", title: "Sangharadhanalu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "sangaradhanalu", category: "Worship", description: "సంఘంగా దేవునిని ఆరాధించేందుకు రూపొందించిన ఆరాధన విధానాలు.", sourceUrl: null, sourceType: "pdf", tags: ["church","worship","congregation","service"] },

{ imageId: "11", title: "Sannidhi Vanne", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "sannidhivanne", category: "Devotional", description: "దేవుని సన్నిధిలో ఉండే ఆత్మీయ ఆనందాన్ని వివరించే గ్రంథం.", sourceUrl: null, sourceType: "pdf", tags: ["presence-of-god","devotion","faith","spiritual-life"] },

{ imageId: "12", title: "Sannidhi Sampadha", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "sannidhisampadha", category: "Devotional", description: "దేవుని సన్నిధిలో పొందే ఆత్మీయ సంపద గురించి వివరణ.", sourceUrl: null, sourceType: "pdf", tags: ["presence-of-god","blessings","faith","devotion"] },

{ imageId: "13", title: "Vimalathma Prokshanamu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "vimalathmaprokshanamu", category: "Holy Spirit", description: "పరిశుద్ధాత్మ శుద్ధి మరియు ఆత్మీయ ప్రక్షాళన గురించి బోధన.", sourceUrl: null, sourceType: "pdf", tags: ["holy-spirit","purification","sanctification"] },

{ imageId: "14", title: "Prardhana Manjari", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "prardhanamanjari", category: "Prayer", description: "వివిధ సందర్భాలలో ఉపయోగపడే ప్రార్థనల సంకలనం.", sourceUrl: null, sourceType: "pdf", tags: ["prayer","intercession","devotion","supplication"] },

{ imageId: "15", title: "Prabhu Samskarapu Vindu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "prabhusamskarapuvindhu", category: "Theology", description: "ప్రభు భోజనము యొక్క ఆత్మీయ అర్థం మరియు ప్రాముఖ్యత.", sourceUrl: null, sourceType: "pdf", tags: ["communion","sacrament","last-supper","church"] },

{ imageId: "16", title: "Parisudhatma Abhisheka Abhyasamu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "parisudhathmaabhishekaabyasamu", category: "Holy Spirit", description: "పరిశుద్ధాత్మ అభిషేకాన్ని అనుభవించేందుకు ఆత్మీయ సాధన.", sourceUrl: null, sourceType: "pdf", tags: ["holy-spirit","anointing","spiritual-growth"] },

{ imageId: "17", title: "Vikyatha Vanithalu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "vikyathavanithalu", category: "Biography", description: "ఆత్మీయ జీవితంలో విశేషంగా నిలిచిన మహిళల జీవిత కథలు.", sourceUrl: null, sourceType: "pdf", tags: ["women","biography","faith","testimony"] },

{ imageId: "18", title: "Rakshana Vani", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "rakshanavani", category: "Salvation", description: "రక్షణ సత్యాన్ని వివరించే ఆత్మీయ సందేశాలు.", sourceUrl: null, sourceType: "pdf", tags: ["salvation","gospel","redemption","faith"] },

{ imageId: "19", title: "Rakshana Padyamulu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "rakshanapadyamulu", category: "Poetry", description: "రక్షణ సత్యాన్ని పద్యరూపంలో తెలియజేసే రచనలు.", sourceUrl: null, sourceType: "pdf", tags: ["poetry","salvation","faith","devotional"] },

{ imageId: "20", title: "Rakshna Sunadhamu", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "rakshananasunadhamu", category: "Devotional", description: "రక్షణ ఆనందాన్ని తెలియజేసే ఆత్మీయ సందేశాలు.", sourceUrl: null, sourceType: "pdf", tags: ["salvation","joy","faith"] },

{ imageId: "41", title: "Daivika Swasthatha", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "daivikaswasthatha", category: "Healing", description: "దేవుని ద్వారా లభించే దైవిక స్వస్థత గురించి బోధన.", sourceUrl: null, sourceType: "pdf", tags: ["healing","divine-healing","faith-healing","miracles"] },

{ imageId: "45", title: "Aathmiya Swasthatha", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "athmiyaswasthatha", category: "Christian Living", description: "ఆత్మీయ ఆరోగ్యం మరియు విశ్వాసంలో స్థిరత్వం గురించి బోధన.", sourceUrl: null, sourceType: "pdf", tags: ["spiritual-health","inner-healing","faith","restoration"] },

{ imageId: "46", title: "Abhayani", author: "M.Devadas Ayyagaru", language: "Telugu", coverImage: "abhayani", category: "Devotional", description: "దేవుని మీద విశ్వాసం ద్వారా భయంలేని జీవితం గురించి బోధన.", sourceUrl: null, sourceType: "pdf", tags: ["faith","courage","trust-in-god","fearless"] },

{ imageId: "47", title: "Presence Of God", author: "M.Devadas Ayyagaru", language: "English", coverImage: "Sannidhi-Kramavali-_-English-A-Prologue-to-the-presence-of-God", category: "Devotional", description: "A guide explaining how believers can experience the presence of God through worship and devotion.", sourceUrl: null, sourceType: "pdf", tags: ["presence-of-god","worship","devotion","spiritual-growth"] },

{ imageId: "48", title: "Praising Divine Qualities", author: "M.Devadas Ayyagaru", language: "English", coverImage: "Praising-Divine-Qualities", category: "Theology", description: "A reflection on the divine attributes of God encouraging believers to praise His holiness and love.", sourceUrl: null, sourceType: "pdf", tags: ["attributes-of-god","praise","theology"] },

{ imageId: "49", title: "Prayer of Consecration", author: "M.Devadas Ayyagaru", language: "English", coverImage: "Prayer-of-Consecration-Samarpana-Prardhana", category: "Prayer", description: "A guide to dedicating one's life completely to God through prayer and surrender.", sourceUrl: null, sourceType: "pdf", tags: ["prayer","consecration","dedication","surrender"] },

{ imageId: "50", title: "Prayer for Lord's Coming", author: "M.Devadas Ayyagaru", language: "English", coverImage: "Prayers-and-Praises-for-the-Lords-Coming.-Rakada-Prardhana-Stuthulu", category: "Prophecy", description: "Prayers and praises preparing believers for the second coming of the Lord.", sourceUrl: null, sourceType: "pdf", tags: ["second-coming","prophecy","watchfulness"] },

{ imageId: "51", title: "Holy Communion", author: "M.Devadas Ayyagaru", language: "English", coverImage: "holycommunion", category: "Theology", description: "Explains the spiritual meaning and importance of Holy Communion in Christian worship.", sourceUrl: null, sourceType: "pdf", tags: ["communion","sacrament","last-supper"] },

{ imageId: "52", title: "Fasting Prayer", author: "M.Devadas Ayyagaru", language: "English", coverImage: "An-Introduction-to-the-Fasting-Prayer", category: "Spiritual Discipline", description: "An introduction to fasting and prayer as a spiritual discipline.", sourceUrl: null, sourceType: "pdf", tags: ["fasting","prayer","discipline"] },

{ imageId: "53", title: "Sunday Order of Worship", author: "M.Devadas Ayyagaru", language: "English", coverImage: "Sunday-order-of-Worship", category: "Worship", description: "A structured order of worship designed for Sunday church services.", sourceUrl: null, sourceType: "pdf", tags: ["church","worship","liturgy"] },

{ imageId: "54", title: "The Wealth", author: "M.Devadas Ayyagaru", language: "English", coverImage: "The-Wealth-of-the-Lords-Presence-Sannidhi-Sampada", category: "Devotional", description: "Describes the spiritual richness found in living in the presence of the Lord.", sourceUrl: null, sourceType: "pdf", tags: ["presence-of-god","devotion","faith"] },

{ imageId: "55", title: "Conscience Manasakshi", author: "M.Devadas Ayyagaru", language: "English", coverImage: "CONCIENCE-Manasakshi", category: "Christian Living", description: "A reflection on how conscience guides believers toward righteous living.", sourceUrl: null, sourceType: "pdf", tags: ["conscience","faith","righteousness"] }

]);

  await db.insert(events).values([
    {
      title: "Annual Global Convention 2026",
      description: "The flagship annual gathering bringing together believers from across the globe for four days of worship, teaching, and fellowship.",
      date: "2026-10-15", time: "9:00 AM - 9:00 PM Daily",
      location: "Bible Mission Grounds, Guntur, Andhra Pradesh",
      latitude: "16.3067", longitude: "80.4365",
      pastorName: "Multiple Speakers", approved: true,
      sourceUrl: null, sourceType: "image",
      tags: ["convention", "global", "worship", "fellowship", "annual"],
    },
    {
      title: "Youth Revival Retreat",
      description: "A powerful one-day retreat focused on igniting the faith of young believers through dynamic worship and interactive sessions.",
      date: "2026-11-05", time: "10:00 AM - 5:00 PM",
      location: "City Convention Center, Hyderabad",
      latitude: "17.3850", longitude: "78.4867",
      pastorName: "Pastor Samuel", approved: true,
      sourceUrl: null, sourceType: "video",
      tags: ["youth", "revival", "retreat", "worship"],
    },
    {
      title: "Regional Pastors Conference",
      description: "A conference for pastors and ministry leaders in the Andhra Pradesh region to equip and encourage one another.",
      date: "2026-12-12", time: "9:00 AM - 4:00 PM",
      location: "Grace Hall, Vijayawada",
      latitude: "16.5062", longitude: "80.6480",
      pastorName: "Rev. Daniel", approved: true,
      sourceUrl: null, sourceType: "image",
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
      sourceUrl: null, sourceType: "text",
      tags: ["devotional", "light", "matthew", "grace", "daily-reading"],
    },
    {
      title: "The Unchanging Word in a Changing World",
      slug: "unchanging-word",
      content: "In an era of rapid change and uncertainty, the Word of God remains our constant anchor. As we navigate the complexities of modern life, the timeless truths found in Scripture provide direction, comfort, and hope...",
      excerpt: "How the timeless truths of Scripture provide direction in today's world.",
      author: "Bible Mission", category: "Teaching", published: true,
      sourceUrl: null, sourceType: "text",
      tags: ["teaching", "scripture", "bible", "truth", "modern-life"],
    },
    {
      title: "ప్రార్థన యొక్క శక్తి – దేవునితో మాట్లాడటం",
      slug: "power-of-prayer-telugu",
      content: "ప్రార్థన అనేది దేవునితో మన సంభాషణ. ఇది కేవలం మన అవసరాలను చెప్పుకోవడం మాత్రమే కాదు, ఆయన సన్నిధిలో సమయం గడపడం...",
      excerpt: "ప్రార్థన యొక్క శక్తి గురించి తెలుగులో వివరణ.",
      author: "Bible Mission", category: "ప్రార్థన", published: true,
      sourceUrl: null, sourceType: "text",
      tags: ["prayer", "telugu", "devotion", "spiritual-growth"],
    },
  ]);

  await db.insert(podcasts).values([
    { title: "Episode 101: The Power of Grace", description: "An exploration of how God's grace transforms our daily lives and relationships.", duration: "15 mins", episodeNumber: 101, published: true, sourceUrl: null, sourceType: "audio", tags: ["grace", "transformation", "relationships"], category: "Teaching" },
    { title: "Episode 102: Walking by Faith", description: "Understanding what it means to walk by faith and not by sight in today's world.", duration: "18 mins", episodeNumber: 102, published: true, sourceUrl: null, sourceType: "audio", tags: ["faith", "christian-living", "trust"], category: "Devotional" },
    { title: "Episode 103: The Heart of Worship", description: "Exploring true worship beyond music and into everyday devotion.", duration: "12 mins", episodeNumber: 103, published: true, sourceUrl: null, sourceType: "audio", tags: ["worship", "devotion", "music", "praise"], category: "Worship" },
  ]);

  await db.insert(livestreams).values([
    { title: "Sunday Global Service", description: "Weekly Sunday service broadcast live from Guntur Headquarters.", scheduledAt: "Every Sunday 10:00 AM IST", isLive: false, pastorName: "Senior Pastor", sourceUrl: null, sourceType: "video", tags: ["sunday", "service", "global", "worship"], category: "Service" },
    { title: "Tuesday Bible Study", description: "Mid-week Bible study and discussion.", scheduledAt: "Every Tuesday 6:00 PM IST", isLive: false, pastorName: "Pastor James", sourceUrl: null, sourceType: "video", tags: ["bible-study", "midweek", "teaching"], category: "Bible Study" },
    { title: "Friday Healing Prayer", description: "Weekly healing prayer service.", scheduledAt: "Every Friday 7:00 PM IST", isLive: false, pastorName: "Pastor Grace", sourceUrl: null, sourceType: "video", tags: ["prayer", "healing", "friday", "intercession"], category: "Prayer" },
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
    entries.push({ sourceType: "Book", sourceId: b.id, title: b.title, description: b.description, author: b.author, category: b.category, tags: b.tags || [], language: b.language, imageUrl: "books/" + b.imageId + ".jpg", slug: null, date: null, metadata: null });
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
