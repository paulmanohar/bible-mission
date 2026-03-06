import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertBookSchema, insertEventSchema, insertPrayerRequestSchema,
  insertBlogPostSchema, insertPodcastSchema, insertLivestreamSchema,
  insertNewsletterSchema, insertPastorApplicationSchema,
  insertContactMessageSchema, insertUserSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_EXPIRES_IN = "7d";

function signToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function stripPassword(user: any) {
  const { password, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
}

interface AuthRequest extends Request {
  userId?: number;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Books ──
  app.get("/api/books", async (req, res) => {
    const query = req.query.q as string | undefined;
    const language = req.query.language as string | undefined;
    const books = await storage.getBooks(query, language);
    res.json(books);
  });

  app.get("/api/books/:id", async (req, res) => {
    const book = await storage.getBook(Number(req.params.id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  });

  app.post("/api/books", async (req, res) => {
    const parsed = insertBookSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const book = await storage.createBook(parsed.data);
    res.status(201).json(book);
  });

  // ── Events ──
  app.get("/api/events", async (_req, res) => {
    const events = await storage.getEvents(true);
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const event = await storage.createEvent(parsed.data);
    res.status(201).json(event);
  });

  // ── Prayer Requests ──
  app.post("/api/prayer-requests", async (req, res) => {
    const parsed = insertPrayerRequestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const request = await storage.createPrayerRequest(parsed.data);
    res.status(201).json(request);
  });

  // ── Blog Posts ──
  app.get("/api/blog", async (_req, res) => {
    const posts = await storage.getBlogPosts(true);
    res.json(posts);
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPost(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post("/api/blog", async (req, res) => {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const post = await storage.createBlogPost(parsed.data);
    res.status(201).json(post);
  });

  // ── Podcasts ──
  app.get("/api/podcasts", async (_req, res) => {
    const podcasts = await storage.getPodcasts(true);
    res.json(podcasts);
  });

  app.post("/api/podcasts", async (req, res) => {
    const parsed = insertPodcastSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const podcast = await storage.createPodcast(parsed.data);
    res.status(201).json(podcast);
  });

  // ── Livestreams ──
  app.get("/api/livestreams", async (_req, res) => {
    const streams = await storage.getLivestreams();
    res.json(streams);
  });

  app.post("/api/livestreams", async (req, res) => {
    const parsed = insertLivestreamSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const stream = await storage.createLivestream(parsed.data);
    res.status(201).json(stream);
  });

  // ── Newsletter ──
  app.post("/api/newsletter", async (req, res) => {
    const parsed = insertNewsletterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    try {
      const sub = await storage.subscribeNewsletter(parsed.data);
      res.status(201).json(sub);
    } catch (err: any) {
      if (err.code === "23505") {
        return res.status(409).json({ message: "This email is already subscribed." });
      }
      throw err;
    }
  });

  // ── Pastor Applications ──
  app.post("/api/pastor-applications", async (req, res) => {
    const parsed = insertPastorApplicationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const application = await storage.createPastorApplication(parsed.data);
    res.status(201).json(application);
  });

  // ── Contact Messages ──
  app.post("/api/contact", async (req, res) => {
    const parsed = insertContactMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    const message = await storage.createContactMessage(parsed.data);
    res.status(201).json(message);
  });

  // ── Global Search ──
  app.get("/api/search", async (req, res) => {
    const query = req.query.q as string | undefined;
    const types = req.query.types ? (req.query.types as string).split(",") : undefined;
    const categories = req.query.categories ? (req.query.categories as string).split(",") : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : undefined;
    const author = req.query.author as string | undefined;
    const sortBy = (req.query.sort as string) || "relevant";
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    const results = await storage.globalSearch({ query, types, categories, tags, author, sortBy, page, limit });
    res.json(results);
  });

  app.post("/api/search/rebuild", async (_req, res) => {
    await storage.rebuildSearchIndex();
    res.json({ message: "Search index rebuilt successfully" });
  });

  // ── Auth ──
  app.post("/api/auth/register", async (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });
    try {
      const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
      const user = await storage.createUser({ ...parsed.data, password: hashedPassword });
      const token = signToken(user.id);
      res.status(201).json({ user: stripPassword(user), token });
    } catch (err: any) {
      if (err.code === "23505") {
        return res.status(409).json({ message: "Username or email already exists." });
      }
      throw err;
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user.id);
    res.json({ user: stripPassword(user), token });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been generated." });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await storage.updateUser(user.id, { resetToken, resetTokenExpiry });
    res.json({ message: "If that email exists, a reset link has been generated." });
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await storage.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await storage.updateUser(user.id, { password: hashed, resetToken: null, resetTokenExpiry: null });
    res.json({ message: "Password has been reset successfully" });
  });

  app.get("/api/auth/me", authMiddleware as any, async (req: AuthRequest, res) => {
    const user = await storage.getUser(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(stripPassword(user));
  });

  const profileUpdateSchema = z.object({
    fullName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
  });

  app.put("/api/auth/profile", authMiddleware as any, async (req: AuthRequest, res) => {
    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: fromError(parsed.error).toString() });

    try {
      const updated = await storage.updateUser(req.userId!, parsed.data);
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json(stripPassword(updated));
    } catch (err: any) {
      if (err.code === "23505") {
        return res.status(409).json({ message: "Email already in use." });
      }
      throw err;
    }
  });

  app.put("/api/auth/change-password", authMiddleware as any, async (req: AuthRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current and new password are required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await storage.getUser(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 12);
    await storage.updateUser(req.userId!, { password: hashed });
    res.json({ message: "Password changed successfully" });
  });

  return httpServer;
}
