import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    if (req.method === "GET") {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) return res.status(404).json({ error: "Notice not found" });
      return res.status(200).json(notice);
    }

    if (req.method === "PUT") {
      const { title, body, category, priority, publishDate, image } = req.body;

      if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required and must be text" });
      }

      if (!body || typeof body !== "string" || body.trim() === "") {
        return res.status(400).json({ error: "Body is required and must be text" });
      }

      if (!category || !["Exam", "Event", "General"].includes(category)) {
        return res.status(400).json({ error: "Category must be either Exam, Event, or General" });
      }

      if (!priority || !["Normal", "Urgent"].includes(priority)) {
        return res.status(400).json({ error: "Priority must be either Normal or Urgent" });
      }

      if (!publishDate || isNaN(Date.parse(publishDate))) {
        return res.status(400).json({ error: "A valid publishDate is required" });
      }

      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Notice not found" });

      const updated = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: typeof image === "string" && image.trim() !== "" ? image.trim() : null,
        },
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Notice not found" });

      await prisma.notice.delete({ where: { id } });
      return res.status(200).json({ message: "Notice deleted" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
