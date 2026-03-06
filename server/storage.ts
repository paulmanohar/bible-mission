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
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike, or, desc, and, sql, arrayContains } from "drizzle-orm";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
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
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  getPodcasts(publishedOnly?: boolean): Promise<Podcast[]>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;

  getLivestreams(): Promise<Livestream[]>;
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
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: number, data: Partial<InsertUser & { resetToken: string | null; resetTokenExpiry: Date | null; password: string }>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async getBooks(query?: string, language?: string): Promise<Book[]> {
    let conditions = [];
    if (query) {
      conditions.push(or(ilike(books.title, `%${query}%`), ilike(books.category, `%${query}%`)));
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
    const [created] = await db.insert(books).values(book).returning();
    return created;
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
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async createPrayerRequest(req: InsertPrayerRequest): Promise<PrayerRequest> {
    const [created] = await db.insert(prayerRequests).values(req).returning();
    return created;
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

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async getPodcasts(publishedOnly = true): Promise<Podcast[]> {
    if (publishedOnly) {
      return db.select().from(podcasts).where(eq(podcasts.published, true)).orderBy(desc(podcasts.createdAt));
    }
    return db.select().from(podcasts).orderBy(desc(podcasts.createdAt));
  }

  async createPodcast(podcast: InsertPodcast): Promise<Podcast> {
    const [created] = await db.insert(podcasts).values(podcast).returning();
    return created;
  }

  async getLivestreams(): Promise<Livestream[]> {
    return db.select().from(livestreams);
  }

  async createLivestream(ls: InsertLivestream): Promise<Livestream> {
    const [created] = await db.insert(livestreams).values(ls).returning();
    return created;
  }

  async subscribeNewsletter(sub: InsertNewsletter): Promise<NewsletterSubscription> {
    const [created] = await db.insert(newsletterSubscriptions).values(sub).returning();
    return created;
  }

  async createPastorApplication(app: InsertPastorApplication): Promise<PastorApplication> {
    const [created] = await db.insert(pastorApplications).values(app).returning();
    return created;
  }

  async getPastorApplications(): Promise<PastorApplication[]> {
    return db.select().from(pastorApplications).orderBy(desc(pastorApplications.createdAt));
  }

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(msg).returning();
    return created;
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
          ilike(searchIndex.title, `%${query}%`),
          ilike(searchIndex.description, `%${query}%`),
          ilike(searchIndex.author, `%${query}%`),
          ilike(searchIndex.category, `%${query}%`)
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
        or(...categories.map((c) => ilike(searchIndex.category, c)))
      );
    }

    if (tags && tags.length > 0) {
      conditions.push(
        sql`${searchIndex.tags} && ${sql`ARRAY[${sql.join(tags.map(t => sql`${t}`), sql`, `)}]::text[]`}`
      );
    }

    if (author) {
      conditions.push(ilike(searchIndex.author, `%${author}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(searchIndex)
      .where(whereClause);

    const total = countResult?.count || 0;

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
          ilike(searchIndex.title, `%${query}%`),
          ilike(searchIndex.description, `%${query}%`),
          ilike(searchIndex.author, `%${query}%`),
          ilike(searchIndex.category, `%${query}%`)
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
      if (row.tags) {
        for (const tag of row.tags) {
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
