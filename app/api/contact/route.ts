import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Insert message into Supabase
    const { error } = await supabase
      .from('messages')
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 })
  }
}
