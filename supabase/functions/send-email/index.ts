import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Initialize Resend API Key from Environment
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') as string

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Config for CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { email, subject, type, name } = await req.json()

        // 1. Determine HTML Content based on Type
        let htmlContent = ''
        if (type === 'welcome') {
            htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #1cb0f6;">Bem-vinda à Minha Jornada TDAH!</h1>
                <p>Olá ${name || 'Aluna'},</p>
                <p>Seu pagamento foi aprovado e seu acesso VIP às trilhas comportamentais e cognitivas está liberado na plataforma.</p>
                <a href="${Deno.env.get('FRONTEND_URL') || 'https://minhajornada.com.br'}" style="background-color: #1cb0f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 16px;">Acessar Portal</a>
                <p style="color: #666; font-size: 12px; margin-top: 32px;">Se você tiver qualquer dúvida, responda este e-mail.</p>
            </div>
        `
        } else {
            htmlContent = `<p>Olá ${name}, esta é uma notificação do sistema Minha Jornada TDAH.</p>`
        }

        // 2. Fire Request to Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Suporte Minha Jornada <suporte@seu-dominio-comprado.com.br>',
                to: [email],
                subject: subject || 'Acesso Liberado - Minha Jornada TDAH',
                html: htmlContent,
            }),
        })

        const data = await res.json()

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.ok ? 200 : 400,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
