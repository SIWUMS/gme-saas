// Configurações para integrações com APIs externas

export interface ExternalApiConfig {
  name: string
  baseUrl: string
  apiKey: string
  enabled: boolean
  timeout: number
  retryAttempts: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}

// Configurações das APIs externas
export const externalApis = {
  taco: {
    name: "API TACO",
    baseUrl: "https://api.taco.gov.br/v1",
    apiKey: process.env.TACO_API_KEY || "",
    enabled: true,
    timeout: 10000,
    retryAttempts: 3,
  },
  whatsapp: {
    name: "WhatsApp Business API",
    baseUrl: "https://graph.facebook.com/v18.0",
    apiKey: process.env.WHATSAPP_API_KEY || "",
    enabled: false,
    timeout: 15000,
    retryAttempts: 2,
  },
  sms: {
    name: "SMS Gateway",
    baseUrl: "https://api.smsgateway.com/v1",
    apiKey: process.env.SMS_API_KEY || "",
    enabled: false,
    timeout: 10000,
    retryAttempts: 3,
  },
  analytics: {
    name: "Google Analytics",
    baseUrl: "https://analyticsreporting.googleapis.com/v4",
    apiKey: process.env.GOOGLE_ANALYTICS_KEY || "",
    enabled: false,
    timeout: 20000,
    retryAttempts: 2,
  },
}

// Classe para gerenciar chamadas de API externa
export class ExternalApiClient {
  private config: ExternalApiConfig

  constructor(config: ExternalApiConfig) {
    this.config = config
  }

  async request<T = any>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE"
      data?: any
      headers?: Record<string, string>
    } = {},
  ): Promise<ApiResponse<T>> {
    if (!this.config.enabled) {
      return {
        success: false,
        error: "API desabilitada",
      }
    }

    const { method = "GET", data, headers = {} } = options
    const url = `${this.config.baseUrl}${endpoint}`

    // Headers padrão
    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      ...headers,
    }

    let attempt = 0
    while (attempt < this.config.retryAttempts) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(url, {
          method,
          headers: defaultHeaders,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        return {
          success: true,
          data: result,
          statusCode: response.status,
        }
      } catch (error) {
        attempt++
        console.error(`Tentativa ${attempt} falhou para ${this.config.name}:`, error)

        if (attempt >= this.config.retryAttempts) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          }
        }

        // Aguardar antes de tentar novamente
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }

    return {
      success: false,
      error: "Máximo de tentativas excedido",
    }
  }
}

// Instâncias dos clientes de API
export const tacoApi = new ExternalApiClient(externalApis.taco)
export const whatsappApi = new ExternalApiClient(externalApis.whatsapp)
export const smsApi = new ExternalApiClient(externalApis.sms)
export const analyticsApi = new ExternalApiClient(externalApis.analytics)

// Funções específicas para cada API

// API TACO - Buscar alimentos
export async function searchTacoFoods(query: string) {
  return await tacoApi.request(`/alimentos/buscar?q=${encodeURIComponent(query)}`)
}

// API TACO - Obter informações nutricionais
export async function getTacoNutrition(foodId: string) {
  return await tacoApi.request(`/alimentos/${foodId}/nutricao`)
}

// WhatsApp - Enviar mensagem
export async function sendWhatsAppMessage(to: string, message: string) {
  return await whatsappApi.request("/messages", {
    method: "POST",
    data: {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    },
  })
}

// SMS - Enviar SMS
export async function sendSMS(to: string, message: string) {
  return await smsApi.request("/send", {
    method: "POST",
    data: {
      to,
      message,
      from: process.env.SMS_FROM_NUMBER,
    },
  })
}

// Analytics - Obter dados de uso
export async function getAnalyticsData(startDate: string, endDate: string) {
  return await analyticsApi.request("/reports:batchGet", {
    method: "POST",
    data: {
      reportRequests: [
        {
          viewId: process.env.GOOGLE_ANALYTICS_VIEW_ID,
          dateRanges: [{ startDate, endDate }],
          metrics: [{ expression: "ga:sessions" }, { expression: "ga:users" }, { expression: "ga:pageviews" }],
          dimensions: [{ name: "ga:date" }],
        },
      ],
    },
  })
}

// Função para testar conectividade de uma API
export async function testApiConnection(apiName: keyof typeof externalApis): Promise<boolean> {
  const config = externalApis[apiName]
  const client = new ExternalApiClient(config)

  try {
    const response = await client.request("/health", { method: "GET" })
    return response.success
  } catch (error) {
    console.error(`Erro ao testar API ${apiName}:`, error)
    return false
  }
}
