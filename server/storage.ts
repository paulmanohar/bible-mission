import 'dotenv/config'; 
import {
  users, books, events, prayerRequests, blogPosts, podcasts,
  livestreams, newsletterSubscriptions, pastorApplications, contactMessages,
  searchIndex,
  type User, type InsertUser,
  type Book, type InsertBook,
  type Event, type InsertEvent,
  type PrayerRequest, type InsertPrayerRequest,
  type BlogPost, type InsertBlogPost,
  type Podcast, type InsertPodcast,
  type Livestream, type InsertLivestream,
  type NewsletterSubscription, type InsertNewsletter,
  type PastorApplication, type InsertPastorApplication,
  type ContactMessage, type InsertContactMessage,
  type InsertSearchIndex, type SearchIndexEntry,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, like, or, desc, and, sql } from "drizzle-orm";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.RDS_HOST,
  port: Number(process.env.RDS_PORT) || 3306,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});
const db = drizzle(pool);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser & { resetToken: string | null; resetTokenExpiry: Date | null; password: string }>): Promise<User | undefined>;

  getBooks(query?: string, language?: string): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;

  getEvents(approvedOnly?: boolean): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  createPrayerRequest(req: InsertPrayerRequest): Promise<PrayerRequest>;
  getPrayerRequests(): Promise<PrayerRequest[]>;

  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  getPodcasts(publishedOnly?: boolean): Promise<Podcast[]>;
  getPodcast(id: number): Promise<Podcast | undefined>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;

  getLivestreams(): Promise<Livestream[]>;
  getLivestream(id: number): Promise<Livestream | undefined>;
  createLivestream(ls: InsertLivestream): Promise<Livestream>;

  subscribeNewsletter(sub: InsertNewsletter): Promise<NewsletterSubscription>;

  createPastorApplication(app: InsertPastorApplication): Promise<PastorApplication>;
  getPastorApplications(): Promise<PastorApplication[]>;

  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;

  globalSearch(params: {
    query?: string;
    types?: string[];
    categories?: string[];
    tags?: string[];
    author?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ results: SearchIndexEntry[]; total: number; facets: { types: Record<string, number>; categories: Record<string, number>; authors: Record<string, number>; tags: Record<string, number> } }>;

  rebuildSearchIndex(): Promise<void>;
}

async function insertAndReturn<T>(table: any, values: any): Promise<T> {
  const result = await db.insert(table).values(values);
  const insertId = (result as any)[0].insertId;
  const [row] = await db.select().from(table).where(eq(table.id, insertId));
  return row as T;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.resetToken, token),
        sql`${users.resetTokenExpiry} > NOW()`
      )
    );
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    return insertAndReturn<User>(users, user);
  }

  async updateUser(id: number, data: Partial<InsertUser & { resetToken: string | null; resetTokenExpiry: Date | null; password: string }>): Promise<User | undefined> {
    await db.update(users).set(data).where(eq(users.id, id));
    const [updated] = await db.select().from(users).where(eq(users.id, id));
    return updated;
  }

  async getBooks(query?: string, language?: string): Promise<Book[]> {
    let conditions = [];
    if (query) {
      conditions.push(or(like(books.title, `%${query}%`), like(books.category, `%${query}%`)));
    }
    if (language) {
      conditions.push(eq(books.language, language));
    }
    if (conditions.length > 0) {
      return db.select().from(books).where(and(...conditions));
    }
    return db.select().from(books);
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(book: InsertBook): Promise<Book> {
    return insertAndReturn<Book>(books, book);
  }

  async getEvents(approvedOnly = true): Promise<Event[]> {
    if (approvedOnly) {
      return db.select().from(events).where(eq(events.approved, true));
    }
    return db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    return insertAndReturn<Event>(events, event);
  }

  async createPrayerRequest(req: InsertPrayerRequest): Promise<PrayerRequest> {
    return insertAndReturn<PrayerRequest>(prayerRequests, req);
  }

  async getPrayerRequests(): Promise<PrayerRequest[]> {
    return db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));
  }

  async getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    return insertAndReturn<BlogPost>(blogPosts, post);
  }

  async getPodcasts(publishedOnly = true): Promise<Podcast[]> {
    if (publishedOnly) {
      return db.select().from(podcasts).where(eq(podcasts.published, true)).orderBy(desc(podcasts.createdAt));
    }
    return db.select().from(podcasts).orderBy(desc(podcasts.createdAt));
  }

  async getPodcast(id: number): Promise<Podcast | undefined> {
    const [row] = await db.select().from(podcasts).where(eq(podcasts.id, id));
    return row;
  }

  async createPodcast(podcast: InsertPodcast): Promise<Podcast> {
    return insertAndReturn<Podcast>(podcasts, podcast);
  }

  async getLivestreams(): Promise<Livestream[]> {
    return db.select().from(livestreams);
  }

  async getLivestream(id: number): Promise<Livestream | undefined> {
    const [row] = await db.select().from(livestreams).where(eq(livestreams.id, id));
    return row;
  }

  async createLivestream(ls: InsertLivestream): Promise<Livestream> {
    return insertAndReturn<Livestream>(livestreams, ls);
  }

  async subscribeNewsletter(sub: InsertNewsletter): Promise<NewsletterSubscription> {
    return insertAndReturn<NewsletterSubscription>(newsletterSubscriptions, sub);
  }

  async createPastorApplication(app: InsertPastorApplication): Promise<PastorApplication> {
    return insertAndReturn<PastorApplication>(pastorApplications, app);
  }

  async getPastorApplications(): Promise<PastorApplication[]> {
    return db.select().from(pastorApplications).orderBy(desc(pastorApplications.createdAt));
  }

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    return insertAndReturn<ContactMessage>(contactMessages, msg);
  }

  async rebuildSearchIndex(): Promise<void> {
    await db.delete(searchIndex);

    const allBooks = await db.select().from(books);
    const allEvents = await db.select().from(events).where(eq(events.approved, true));
    const allPosts = await db.select().from(blogPosts).where(eq(blogPosts.published, true));
    const allPodcasts = await db.select().from(podcasts).where(eq(podcasts.published, true));
    const allStreams = await db.select().from(livestreams);

    const entries: InsertSearchIndex[] = [];

    for (const b of allBooks) {
      entries.push({
        sourceType: "Book",
        sourceId: b.id,
        title: b.title,
        description: b.description,
        author: b.author,
        category: b.category,
        tags: b.tags || [],
        language: b.language,
        imageUrl: b.coverImage,
        slug: null,
        date: null,
        metadata: null,
      });
    }

    for (const e of allEvents) {
      entries.push({
        sourceType: "Event",
        sourceId: e.id,
        title: e.title,
        description: e.description,
        author: e.pastorName,
        category: "Event",
        tags: e.tags || [],
        language: null,
        imageUrl: e.posterImage,
        slug: null,
        date: e.date,
        metadata: JSON.stringify({ location: e.location, time: e.time }),
      });
    }

    for (const p of allPosts) {
      entries.push({
        sourceType: "Article",
        sourceId: p.id,
        title: p.title,
        description: p.excerpt || p.content.substring(0, 200),
        author: p.author,
        category: p.category,
        tags: p.tags || [],
        language: null,
        imageUrl: p.coverImage,
        slug: p.slug,
        date: p.createdAt?.toISOString().split("T")[0] || null,
        metadata: null,
      });
    }

    for (const pod of allPodcasts) {
      entries.push({
        sourceType: "Podcast",
        sourceId: pod.id,
        title: pod.title,
        description: pod.description,
        author: null,
        category: pod.category || "Podcast",
        tags: pod.tags || [],
        language: null,
        imageUrl: null,
        slug: null,
        date: pod.createdAt?.toISOString().split("T")[0] || null,
        metadata: JSON.stringify({ duration: pod.duration, episode: pod.episodeNumber }),
      });
    }

    for (const ls of allStreams) {
      entries.push({
        sourceType: "Livestream",
        sourceId: ls.id,
        title: ls.title,
        description: ls.description,
        author: ls.pastorName,
        category: ls.category || "Livestream",
        tags: ls.tags || [],
        language: null,
        imageUrl: null,
        slug: null,
        date: null,
        metadata: JSON.stringify({ scheduledAt: ls.scheduledAt, isLive: ls.isLive }),
      });
    }

    if (entries.length > 0) {
      await db.insert(searchIndex).values(entries);
    }
  }

  async globalSearch(params: {
    query?: string;
    types?: string[];
    categories?: string[];
    tags?: string[];
    author?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ results: SearchIndexEntry[]; total: number; facets: { types: Record<string, number>; categories: Record<string, number>; authors: Record<string, number>; tags: Record<string, number> } }> {
    const { query, types, categories, tags, author, sortBy = "relevant", page = 1, limit: pageLimit = 20 } = params;
    const offset = (page - 1) * pageLimit;

    let conditions: any[] = [];

    if (query && query.trim()) {
      conditions.push(
        or(
          like(searchIndex.title, `%${query}%`),
          like(searchIndex.description, `%${query}%`),
          like(searchIndex.author, `%${query}%`),
          like(searchIndex.category, `%${query}%`),
          sql`JSON_SEARCH(${searchIndex.tags}, 'one', ${`%${query}%`}) IS NOT NULL`
        )
      );
    }

    if (types && types.length > 0) {
      conditions.push(
        or(...types.map((t) => eq(searchIndex.sourceType, t)))
      );
    }

    if (categories && categories.length > 0) {
      conditions.push(
        or(...categories.map((c) => like(searchIndex.category, c)))
      );
    }

    if (tags && tags.length > 0) {
      const tagConditions = tags.map(t =>
        sql`JSON_CONTAINS(${searchIndex.tags}, JSON_QUOTE(${t}))`
      );
      conditions.push(or(...tagConditions));
    }

    if (author) {
      conditions.push(like(searchIndex.author, `%${author}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(searchIndex)
      .where(whereClause);

    const total = Number(countResult?.count) || 0;

    let orderClause;
    if (sortBy === "newest") {
      orderClause = desc(searchIndex.date);
    } else if (sortBy === "title") {
      orderClause = searchIndex.title;
    } else {
      orderClause = searchIndex.id;
    }

    const results = await db
      .select()
      .from(searchIndex)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(pageLimit)
      .offset(offset);

    const queryCondition = query && query.trim()
      ? or(
          like(searchIndex.title, `%${query}%`),
          like(searchIndex.description, `%${query}%`),
          like(searchIndex.author, `%${query}%`),
          like(searchIndex.category, `%${query}%`),
          sql`JSON_SEARCH(${searchIndex.tags}, 'one', ${`%${query}%`}) IS NOT NULL`
        )
      : undefined;

    const allMatchingForFacets = await db.select({
      sourceType: searchIndex.sourceType,
      category: searchIndex.category,
      author: searchIndex.author,
      tags: searchIndex.tags,
    }).from(searchIndex).where(queryCondition);

    const typeFacets: Record<string, number> = {};
    const categoryFacets: Record<string, number> = {};
    const authorFacets: Record<string, number> = {};
    const tagFacets: Record<string, number> = {};

    for (const row of allMatchingForFacets) {
      typeFacets[row.sourceType] = (typeFacets[row.sourceType] || 0) + 1;
      if (row.category) {
        categoryFacets[row.category] = (categoryFacets[row.category] || 0) + 1;
      }
      if (row.author) {
        authorFacets[row.author] = (authorFacets[row.author] || 0) + 1;
      }
      const tagList = row.tags as string[] | null;
      if (tagList) {
        for (const tag of tagList) {
          tagFacets[tag] = (tagFacets[tag] || 0) + 1;
        }
      }
    }

    return {
      results,
      total,
      facets: {
        types: typeFacets,
        categories: categoryFacets,
        authors: authorFacets,
        tags: tagFacets,
      },
    };
  }
}

export const storage = new DatabaseStorage();
