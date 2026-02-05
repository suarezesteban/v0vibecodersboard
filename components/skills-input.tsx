"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import useSWR from "swr"

interface SkillSuggestion {
  skill: string
  count: number
}

interface SkillsInputProps {
  name: string
  defaultValue?: string
  placeholder?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function SkillsInput({ name, defaultValue = "", placeholder }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Fetch suggestions based on current query
  const { data: suggestions = [] } = useSWR<SkillSuggestion[]>(
    isOpen ? `/api/skills?q=${encodeURIComponent(currentQuery)}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  
  // Get the current skill being typed (after the last comma)
  const getCurrentSkill = useCallback(() => {
    const parts = inputValue.split(",")
    return parts[parts.length - 1].trim()
  }, [inputValue])
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setCurrentQuery(getCurrentSkillFromValue(value))
    setIsOpen(true)
  }
  
  const getCurrentSkillFromValue = (value: string) => {
    const parts = value.split(",")
    return parts[parts.length - 1].trim()
  }
  
  // Handle suggestion click
  const handleSuggestionClick = (skill: string) => {
    const parts = inputValue.split(",")
    parts.pop() // Remove current incomplete skill
    const newValue = [...parts.map(p => p.trim()).filter(Boolean), skill].join(", ")
    setInputValue(newValue + ", ")
    setIsOpen(false)
    inputRef.current?.focus()
  }
  
  // Handle focus
  const handleFocus = () => {
    setCurrentQuery(getCurrentSkill())
    setIsOpen(true)
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  // Filter out already selected skills
  const selectedSkills = inputValue.split(",").map(s => s.trim().toLowerCase()).filter(Boolean)
  const filteredSuggestions = suggestions.filter(
    s => !selectedSkills.includes(s.skill.toLowerCase())
  )
  
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.skill}
              type="button"
              onClick={() => handleSuggestionClick(suggestion.skill)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between items-center"
            >
              <span className="text-foreground">{suggestion.skill}</span>
              <span className="text-muted-foreground text-xs">({suggestion.count})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
