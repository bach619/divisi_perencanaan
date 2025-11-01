"use client"

import * as React from "react"
import { IconUpload } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FileInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [fileNames, setFileNames] = React.useState<string[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const names = Array.from(files).map((file) => file.name)
      setFileNames(names)
    } else {
      setFileNames([])
    }
  }

  return (
    <Label
      htmlFor="file-upload"
      className={cn(
        "border-input hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-transparent p-6 text-sm text-muted-foreground transition-colors",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <IconUpload className="size-8" />
        {fileNames.length > 0 ? (
          <ul className="list-disc pl-5">
            {fileNames.map((name, index) => <li key={index}>{name}</li>)}
          </ul>
        ) : (
          <span>Seret & lepas file atau klik untuk mengunggah</span>
        )}
      </div>
      <input
        type="file"
        className="sr-only"
        ref={ref}
        onChange={handleFileChange}
        {...props}
      />
    </Label>
  )
})
FileInput.displayName = "FileInput"

export { FileInput }