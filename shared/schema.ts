import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, boolean, timestamp, serial, index, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("member"),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  avatarUrl: text("avatar_url"),
  subscribed: boolean("subscribed").notNull().default(false),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  author: varchar("author", { length: 255 }).notNull().default("M.Devadas Ayyagaru"),
  language: varchar("language", { length: 50 }).notNull().default("English"),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  contentUrl: text("content_url"),
  tags: json("tags").$type<string[]>(),
});

export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 50 }),
  location: varchar("location", { length: 500 }).notNull(),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  pastorName: varchar("pastor_name", { length: 255 }),
  posterImage: text("poster_image"),
  approved: boolean("approved").notNull().default(false),
  tags: json("tags").$type<string[]>(),
});

export const prayerRequests = mysqlTable("prayer_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  request: text("request").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  author: varchar("author", { length: 255 }).notNull().default("Bible Mission"),
  category: varchar("category", { length: 255 }).notNull().default("Devotional"),
  published: boolean("published").notNull().default(false),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const podcasts = mysqlTable("podcasts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  audioUrl: text("audio_url"),
  duration: varchar("duration", { length: 50 }),
  episodeNumber: int("episode_number"),
  published: boolean("published").notNull().default(false),
  tags: json("tags").$type<string[]>(),
  category: varchar("category", { length: 255 }).default("Podcast"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const livestreams = mysqlTable("livestreams", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  streamUrl: text("stream_url"),
  scheduledAt: varchar("scheduled_at", { length: 100 }),
  isLive: boolean("is_live").notNull().default(false),
  pastorName: varchar("pastor_name", { length: 255 }),
  tags: json("tags").$type<string[]>(),
  category: varchar("category", { length: 255 }).default("Livestream"),
});

export const newsletterSubscriptions = mysqlTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pastorApplications = mysqlTable("pastor_applications", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const searchIndex = mysqlTable("search_index", {
  id: serial("id").primaryKey(),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  sourceId: int("source_id").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  author: varchar("author", { length: 255 }),
  category: varchar("category", { length: 255 }),
  tags: json("tags").$type<string[]>(),
  language: varchar("language", { length: 50 }),
  imageUrl: text("image_url"),
  slug: varchar("slug", { length: 500 }),
  date: varchar("date", { length: 50 }),
  metadata: text("metadata"),
}, (table) => [
  index("idx_search_source").on(table.sourceType, table.sourceId),
  index("idx_search_category").on(table.category),
  index("idx_search_type").on(table.sourceType),
]);

export const insertSearchIndexSchema = createInsertSchema(searchIndex).omit({ id: true });
export type InsertSearchIndex = z.infer<typeof insertSearchIndexSchema>;
export type SearchIndexEntry = typeof searchIndex.$inferSelect;

export const insertUserSchema = createInsertSchema(users).omit({ id: true, resetToken: true, resetTokenExpiry: true, createdAt: true });
export const insertBookSchema = createInsertSchema(books).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).omit({ id: true, createdAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertPodcastSchema = createInsertSchema(podcasts).omit({ id: true, createdAt: true });
export const insertLivestreamSchema = createInsertSchema(livestreams).omit({ id: true });
export const insertNewsletterSchema = createInsertSchema(newsletterSubscriptions).omit({ id: true, createdAt: true });
export const insertPastorApplicationSchema = createInsertSchema(pastorApplications).omit({ id: true, createdAt: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertPodcast = z.infer<typeof insertPodcastSchema>;
export type Podcast = typeof podcasts.$inferSelect;
export type InsertLivestream = z.infer<typeof insertLivestreamSchema>;
export type Livestream = typeof livestreams.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertPastorApplication = z.infer<typeof insertPastorApplicationSchema>;
export type PastorApplication = typeof pastorApplications.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
