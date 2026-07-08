import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "desc" }, // 'Urgent' comes before 'Normal' in desc order
          { publishDate: "desc" }
        ]
      });
      return res.status(200).json(notices);
    }

    if (req.method === "POST") {
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

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: typeof image === "string" && image.trim() !== "" ? image.trim() : null,
        },
      });
      return res.status(201).json(notice);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
