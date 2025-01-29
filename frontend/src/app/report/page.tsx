"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"

export default function MedisyncReportAnalyser() {
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [analysis, setAnalysis] = useState("")

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setTimeout(() => {
        setAnalysis(`Analysis of ${files[0].name}: This is a sample analysis of the uploaded medical report.`)
      }, 2000)
    }
  }

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
  )
}
