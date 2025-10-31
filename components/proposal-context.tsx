"use client"

import * as React from "react"
import { z } from "zod"

import { schema as proposalSchema } from "@/components/data-table"

import initialData from "@/app/dashboard/data.json"

type Proposal = z.infer<typeof proposalSchema>

interface ProposalContextType {
  proposals: Proposal[]
  addProposal: (proposal: Omit<Proposal, "id">) => void
}

const ProposalContext = React.createContext<ProposalContextType | undefined>(
  undefined
)

export function ProposalProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = React.useState<Proposal[]>(initialData)

  const addProposal = (proposal: Omit<Proposal, "id">) => {
    setProposals((prev) => {
      const newProposal = {
        ...proposal,
        id: prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
        tanggalDibuat: new Date().toISOString().split("T")[0], // Add creation date
        executiveSummary: "", // Initialize with empty summary
      }
      return [
        ...prev,
        newProposal,
      ]});
  }

  return (
    <ProposalContext.Provider value={{ proposals, addProposal }}>
      {children}
    </ProposalContext.Provider>
  )
}

export function useProposals() {
  const context = React.useContext(ProposalContext)
  if (context === undefined) {
    throw new Error("useProposals must be used within a ProposalProvider")
  }
  return context
}