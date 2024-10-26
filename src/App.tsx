'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function FullScreenCampaignIdeasForm() {
  const [formData, setFormData] = useState({
    campaignType: '',
    socioEconomicClass: '',
    productType: '',
    format: '',
    demographic: '',
    geographic: '',
    budget: '',
    campaignObjective: ''
  })
  const [campaignIdeas, setCampaignIdeas] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setCampaignIdeas(null)

    try {
      const response = await fetch('http://localhost:5000/generate-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch campaign ideas')
      }

      const data = await response.json()
      setCampaignIdeas(data.campaignIdeas.replace("\n/g","</br>"))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Campaign Ideas Generator</h1>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <Card className="flex-grow flex flex-col m-4 overflow-hidden">
          <CardHeader>
            <CardTitle>Generate Campaign Ideas</CardTitle>
            <CardDescription>Fill in the form to generate campaign ideas</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex overflow-hidden">
            <div className="flex-grow flex gap-4 overflow-hidden">
              <ScrollArea className="flex-grow p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaignType">Campaign Type</Label>
                      <Input
                        id="campaignType"
                        name="campaignType"
                        value={formData.campaignType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socioEconomicClass">Socio-Economic Class</Label>
                      <Input
                        id="socioEconomicClass"
                        name="socioEconomicClass"
                        value={formData.socioEconomicClass}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type</Label>
                      <Input
                        id="productType"
                        name="productType"
                        value={formData.productType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Strategy</Label>
                      <Input
                        id="format"
                        name="format"
                        value={formData.format}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demographic">Demographic</Label>
                      <Input
                        id="demographic"
                        name="demographic"
                        value={formData.demographic}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="geographic">Geographic</Label>
                      <Input
                        id="geographic"
                        name="geographic"
                        value={formData.geographic}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Select name="budget" onValueChange={(value) => handleSelectChange('budget', value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaignObjective">Campaign Objective</Label>
                      <Input
                        id="campaignObjective"
                        name="campaignObjective"
                        value={formData.campaignObjective}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Ideas
                      </>
                    ) : (
                      'Generate Campaign Ideas'
                    )}
                  </Button>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-destructive/15 border border-destructive text-destructive rounded">
                    {error}
                  </div>
                )}
              </ScrollArea>

              <Card className="w-1/2 overflow-hidden">
                <CardHeader>
                  <CardTitle>Generated Campaign Ideas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-12rem)] p-4">
                    {campaignIdeas ? (
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: campaignIdeas }}></div>
                    ) : (
                      <p className="text-muted-foreground">No campaign ideas generated yet. Fill out the form and submit to see results here.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}