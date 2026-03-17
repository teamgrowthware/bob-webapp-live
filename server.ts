import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Basic memory store for matchmaking
  let waitingQueue: { socketId: string; userId: string; userName: string; avatar: string }[] = [];
  const activeBattles = new Map<string, {
    players: string[];
    scores: Record<string, number>;
    questions: any[];
  }>();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join Matchmaking Queue
    socket.on("join_queue", async ({ userId, userName }) => {
      console.log(`[Queue] ${userName} joined`);

      // Prevent duplicate queueing
      if (waitingQueue.find(p => p.userId === userId)) return;

      waitingQueue.push({ socketId: socket.id, userId, userName, avatar: `avatar-${Math.floor(Math.random() * 5)}.png` });

      // Check if we have 2 players
      if (waitingQueue.length >= 2) {
        const p1 = waitingQueue.shift()!;
        const p2 = waitingQueue.shift()!;

        const roomId = `battle_${p1.userId}_${p2.userId}_${Date.now()}`;

        // Fetch 5 random questions for the battle
        const questionsDB = await prisma.question.findMany({ take: 10 });
        const battleQuestions = questionsDB.sort(() => Math.random() - 0.5).slice(0, 5).map(q => ({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options),
          correctOption: q.correctOption,
          timeLimit: 15 // Faster paced for multiplayer
        }));

        activeBattles.set(roomId, {
          players: [p1.userId, p2.userId],
          scores: { [p1.userId]: 0, [p2.userId]: 0 },
          questions: battleQuestions
        });

        // Join socket room
        io.sockets.sockets.get(p1.socketId)?.join(roomId);
        io.sockets.sockets.get(p2.socketId)?.join(roomId);

        // Strip correct answers for client
        const secureQuestions = battleQuestions.map(q => ({ ...q, correctOption: undefined }));

        io.to(roomId).emit("match_found", {
          roomId,
          players: [p1, p2],
          questions: secureQuestions
        });

        console.log(`[Match] Created room ${roomId} for ${p1.userName} & ${p2.userName}`);
      }
    });

    // Handle Score Update
    socket.on("update_score", ({ roomId, userId, points }) => {
      const battle = activeBattles.get(roomId);
      if (battle) {
        battle.scores[userId] += points;
        io.to(roomId).emit("score_updated", battle.scores);
      }
    });

    // Handle Battle End
    socket.on("battle_end", async ({ roomId }) => {
      const battle = activeBattles.get(roomId);
      if (battle) {
        // Find winner based on server tracked scores
        const p1Id = battle.players[0];
        const p2Id = battle.players[1];
        const p1Score = battle.scores[p1Id] || 0;
        const p2Score = battle.scores[p2Id] || 0;

        const winnerId = p1Score > p2Score ? p1Id : (p2Score > p1Score ? p2Id : null);

        // Record to DB
        await prisma.battle.create({
          data: {
            player1Id: p1Id,
            player2Id: p2Id,
            p1Score,
            p2Score,
            winnerId
          }
        });

        // Award XP logic could trigger here
        if (winnerId) {
          await prisma.user.update({
            where: { id: winnerId },
            data: { xp: { increment: 500 }, coins: { increment: 100 } }
          });
        }

        io.to(roomId).emit("battle_result", { winnerId, p1Score, p2Score });
        activeBattles.delete(roomId);
      }
    });

    socket.on("disconnect", () => {
      waitingQueue = waitingQueue.filter(p => p.socketId !== socket.id);
      console.log("Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 BOB Custom Server ready on :${PORT}`);
    console.log(`⚡ WebSockets (Socket.IO) Enabled`);
    console.log(`========================================\n`);
  });
});
