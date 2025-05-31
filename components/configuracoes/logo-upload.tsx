"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Trash2 } from "lucide-react"

export function LogoUpload() {
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?height=200&width=200&text=Logo")
  const [bannerUrl, setBannerUrl] = useState("/placeholder.svg?height=300&width=800&text=Banner")

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setBannerUrl(url)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo da Instituição</CardTitle>
          <CardDescription>Faça upload do logo oficial (recomendado: 200x200px, PNG/JPG)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Selecionar Logo</Label>
              <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="w-64" />
              <div className="flex gap-2">
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button size="sm" variant="outline" onClick={() => setLogoUrl("")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner/Cabeçalho</CardTitle>
          <CardDescription>Imagem para cabeçalho dos relatórios (recomendado: 800x300px)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center overflow-hidden">
              {bannerUrl ? (
                <img src={bannerUrl || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-upload">Selecionar Banner</Label>
              <Input id="banner-upload" type="file" accept="image/*" onChange={handleBannerUpload} className="w-64" />
              <div className="flex gap-2">
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBannerUrl("")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
