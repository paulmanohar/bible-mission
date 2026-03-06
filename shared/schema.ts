import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("member"),
  phone: text("phone"),
  location: text("location"),
  avatarUrl: text("avatar_url"),
  subscribed: boolean("subscribed").notNull().default(false),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull().default("M.Devadas Ayyagaru"),
  language: text("language").notNull().default("English"),
  category: text("category").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  contentUrl: text("content_url"),
  tags: text("tags").array(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  pastorName: text("pastor_name"),
  posterImage: text("poster_image"),
  approved: boolean("approved").notNull().default(false),
  tags: text("tags").array(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  request: text("request").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  author: text("author").notNull().default("Bible Mission"),
  category: text("category").notNull().default("Devotional"),
  published: boolean("published").notNull().default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url"),
  duration: text("duration"),
  episodeNumber: integer("episode_number"),
  published: boolean("published").notNull().default(false),
  tags: text("tags").array(),
  category: text("category").default("Podcast"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const livestreams = pgTable("livestreams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  streamUrl: text("stream_url"),
  scheduledAt: text("scheduled_at"),
  isLive: boolean("is_live").notNull().default(false),
  pastorName: text("pastor_name"),
  tags: text("tags").array(),
  category: text("category").default("Livestream"),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pastorApplications = pgTable("pastor_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const searchIndex = pgTable("search_index", {
  id: serial("id").primaryKey(),
  sourceType: text("source_type").notNull(),
  sourceId: integer("source_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  author: text("author"),
  category: text("category"),
  tags: text("tags").array(),
  language: text("language"),
  imageUrl: text("image_url"),
  slug: text("slug"),
  date: text("date"),
  metadata: text("metadata"),
}, (table) => [
  index("idx_search_source").on(table.sourceType, table.sourceId),
  index("idx_search_category").on(table.category),
  index("idx_search_type").on(table.sourceType),
]);

export const insertSearchIndexSchema = createInsertSchema(searchIndex).omit({ id: true });
export type InsertSearchIndex = z.infer<typeof insertSearchIndexSchema>;
export type SearchIndexEntry = typeof searchIndex.$inferSelect;

// Insert schemas
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

// Types
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
