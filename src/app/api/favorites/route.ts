import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsOnly = searchParams.get("idsOnly") === "true";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([]);
  }

  await connectToDatabase();

  if (idsOnly) {
    const user = await User.findById(session.user.id).select("favorites").lean();
    const ids = ((user as any)?.favorites ?? []).map((id: mongoose.Types.ObjectId) => id.toString());
    return NextResponse.json(ids);
  }

  const user = await User.findById(session.user.id).populate("favorites").lean();
  const favorites = (user as any)?.favorites ?? [];
  return NextResponse.json(JSON.parse(JSON.stringify(favorites)));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipeId } = await request.json();
  if (!recipeId || !mongoose.isValidObjectId(recipeId)) {
    return NextResponse.json({ error: "Invalid recipeId" }, { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findById(session.user.id).select("favorites").lean();
  const favorites = ((user as any)?.favorites ?? []) as mongoose.Types.ObjectId[];
  const alreadyFavorited = favorites.some((id) => id.toString() === recipeId);

  const objectId = new mongoose.Types.ObjectId(recipeId);
  const update = alreadyFavorited
    ? { $pull: { favorites: objectId } }
    : { $push: { favorites: objectId } };

  const updated = await User.findByIdAndUpdate(session.user.id, update, {
    new: true,
    upsert: true,
  }).select("favorites").lean();

  const updatedIds = ((updated as any)?.favorites ?? []).map((id: mongoose.Types.ObjectId) => id.toString());

  return NextResponse.json({ favorited: !alreadyFavorited, favorites: updatedIds });
}
