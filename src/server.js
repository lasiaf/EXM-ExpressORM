require("dotenv/config");

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();

app.use(express.json());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal membuat user",
      error: error.message,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
});


app.get("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil user",
      error: error.message,
    });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengupdate user",
      error: error.message,
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "User berhasil dihapus",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus user",
      error: error.message,
    });
  }
});


app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
