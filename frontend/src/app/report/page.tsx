"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { supabase } from "@/lib/supabaseClient"
import { Sidebar } from "@/components/sidebar"

export default function MedisyncReportAnalyser() {
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

const handleFileChange = async (files: File[]) => {
  if (files.length > 0) {
    try {
      const selectedFile = files[0];
      
      // Ensure user is properly authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Authentication error:", authError);
        alert("Please login to upload files");
        return;
      }

      // Sanitize filename
      const sanitizedName = selectedFile.name
        .replace(/[^a-zA-Z0-9-_.]/g, '_')
        .replace(/\s+/g, '_');
      
      const filePath = `${user.id}/${sanitizedName}`;

      // Upload with error handling
      const { data, error } = await supabase.storage
        .from("Report")
        .upload(filePath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
        });

      if (error) {
        console.error("Storage error:", error);
        alert(`Upload failed: ${error.message}`);
        return;
      }

      console.log("Upload successful:", data);
      setFile(selectedFile);

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred");
    }
  }
};
  

  const handleQuestionSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (question.trim()) {
      setTimeout(() => {
        setAnalysis(
          (prev) => `${prev}\n\nQ: ${question}\nA: This is a sample answer to your question about the report.`
        )
        setQuestion("")
      }, 1000)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        <Sidebar onOpenChange={setIsSidebarOpen} />
              <main
                className={`flex-1 p-4 md:p-8 pl-20 md:pl-4 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "md:ml-64" : "md:ml-16"
                  }`}
        >
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Medisync Report Analyser</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <Label className="block mb-2 font-semibold">Upload Medical Report</Label>
              <FileUpload onChange={handleFileChange} />
            </motion.div>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2 text-sm text-muted-foreground bg-blue-50 p-2 rounded"
                >
                  <FileText size={16} />
                  <span>{file.name}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-4 rounded-lg shadow max-h-64 overflow-y-auto"
                >
                  <h3 className="font-semibold mb-2 text-blue-600">Analysis Results:</h3>
                  <p className="whitespace-pre-wrap">{analysis}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-3xl mx-auto mt-6">
        <Card className="shadow-xl">
          <CardContent className="p-4">
            <motion.form
              onSubmit={handleQuestionSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label htmlFor="question" className="block mb-2 font-semibold">
                Ask a Question
              </Label>
              <div className="flex space-x-2">
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question about the report..."
                  className="flex-grow resize-none"
                  rows={2}
                />
                <Button type="submit" size="icon" disabled={!file || !question.trim()} className="self-end">
                  <Send size={18} />
                </Button>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </div>
      </main>
    </main>
  )
}
