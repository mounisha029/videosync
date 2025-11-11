"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Code2, Play, RotateCcw } from "lucide-react";
import { CODING_QUESTIONS, LANGUAGES, type CodeQuestion } from "@/constants";

interface CodeEditorProps {
  onClose?: () => void;
}

function CodeEditor({ onClose }: CodeEditorProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<CodeQuestion>(CODING_QUESTIONS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "python" | "java">("javascript");
  const [code, setCode] = useState(selectedQuestion.starterCode[selectedLanguage]);
  const [output, setOutput] = useState("");

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId);
    if (question) {
      setSelectedQuestion(question);
      setCode(question.starterCode[selectedLanguage]);
      setOutput("");
    }
  };

  const handleLanguageChange = (lang: "javascript" | "python" | "java") => {
    setSelectedLanguage(lang);
    setCode(selectedQuestion.starterCode[lang]);
    setOutput("");
  };

  const handleReset = () => {
    setCode(selectedQuestion.starterCode[selectedLanguage]);
    setOutput("");
  };

  const handleRun = () => {
    setOutput("Code execution is simulated. In production, this would run in a secure sandbox environment.");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Coding Challenge
          </h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {/* Question Selector */}
        <div className="flex gap-2 flex-wrap">
          {CODING_QUESTIONS.map((q) => (
            <Button
              key={q.id}
              variant={selectedQuestion.id === q.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuestionChange(q.id)}
            >
              {q.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/2 border-r overflow-y-auto p-6">
          <h3 className="text-2xl font-bold mb-4">{selectedQuestion.title}</h3>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap mb-6">
              {selectedQuestion.description}
            </p>

            <h4 className="font-semibold mb-3">Examples:</h4>
            {selectedQuestion.examples.map((example, idx) => (
              <div key={idx} className="bg-muted p-4 rounded-lg mb-4">
                <p className="mb-2">
                  <strong>Input:</strong> <code>{example.input}</code>
                </p>
                <p className="mb-2">
                  <strong>Output:</strong> <code>{example.output}</code>
                </p>
                {example.explanation && (
                  <p>
                    <strong>Explanation:</strong> {example.explanation}
                  </p>
                )}
              </div>
            ))}

            {selectedQuestion.constraints && (
              <>
                <h4 className="font-semibold mb-3">Constraints:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {selectedQuestion.constraints.map((constraint, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Language Selector & Actions */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.id}
                  variant={selectedLanguage === lang.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang.id as any)}
                >
                  {lang.name}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={handleRun}>
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm bg-muted resize-none focus:outline-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />

            {/* Output Panel */}
            {output && (
              <div className="border-t bg-background">
                <div className="px-4 py-2 border-b bg-muted">
                  <span className="text-sm font-semibold">Output</span>
                </div>
                <div className="p-4 font-mono text-sm max-h-32 overflow-y-auto">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
