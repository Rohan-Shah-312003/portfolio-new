"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setMessages(prev => prev.filter(msg => msg.id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Message Dashboard</h1>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{message.name}</CardTitle>
                      <CardDescription>{message.email}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">{message.message}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-zinc-500 mb-4">No messages yet</p>
              <p className="text-zinc-400 text-sm">Messages from your contact form will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
