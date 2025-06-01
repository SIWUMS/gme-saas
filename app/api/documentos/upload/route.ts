import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const tipo = formData.get("tipo") as string
    const numero = formData.get("numero") as string
    const descricao = formData.get("descricao") as string
    const fornecedor_id = formData.get("fornecedor_id") as string
    const valor = formData.get("valor") as string

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), "uploads", "documentos")
    await mkdir(uploadDir, { recursive: true })

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const filePath = join(uploadDir, fileName)

    // Salvar arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Salvar informações no banco
    const result = await query(
      `
      INSERT INTO documentos (
        tipo, numero, descricao, arquivo_nome, arquivo_path,
        arquivo_tamanho, fornecedor_id, valor, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        tipo,
        numero,
        descricao,
        fileName,
        filePath,
        file.size,
        fornecedor_id || null,
        valor ? Number.parseFloat(valor) : null,
        session.user.id,
      ],
    )

    return NextResponse.json({
      success: true,
      documento: result.rows[0],
      message: "Documento enviado com sucesso",
    })
  } catch (error) {
    console.error("Upload documento error:", error)
    return NextResponse.json({ error: "Erro ao fazer upload do documento" }, { status: 500 })
  }
}
