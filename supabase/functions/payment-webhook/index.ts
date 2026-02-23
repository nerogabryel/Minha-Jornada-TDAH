import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

serve(async (req) => {
    // Config for CORS (Cross-Origin Resource Sharing)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json()
        const signature = req.headers.get('stripe-signature') // If using stripe
        // Webhook auth logic here (e.g., verify Kiwify token or Stripe signature)

        // Initialize Supabase with the service_role key to bypass RLS limits
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

        // Detect the event type and the customer email
        // Below is a hybrid pseudocode representing both Kiwify and Stripe structures
        let customerEmail = ''
        let isApproved = false
        let isRefunded = false

        // KIWIFY EXAMPLE STRUCTURE
        if (payload.order_status === 'paid' && payload.Customer?.email) {
            customerEmail = payload.Customer.email
            isApproved = true
        } else if (payload.order_status === 'refunded' && payload.Customer?.email) {
            customerEmail = payload.Customer.email
            isRefunded = true
        }

        // STRIPE EXAMPLE STRUCTURE
        if (payload.type === 'checkout.session.completed' && payload.data?.object?.customer_details?.email) {
            customerEmail = payload.data.object.customer_details.email
            isApproved = true
        } else if (payload.type === 'charge.refunded' && payload.data?.object?.billing_details?.email) {
            customerEmail = payload.data.object.billing_details.email
            isRefunded = true
        }

        if (!customerEmail) {
            return new Response('Igored: No email found', { status: 200 })
        }

        // 1. Find the User by Email
        // Note: since Auth users emails are primarily stored in auth.users, and user_profiles is linked by ID,
        // we must first find the user.
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()
        if (userError) throw userError

        const user = userData.users.find(u => u.email === customerEmail)
        if (!user) {
            console.warn(`Webhook received for ${customerEmail} but no matching account found in Supabase.`)
            // They might buy before creating an account. In a full system, you'd log this or send an invite link.
            return new Response('User not found in system', { status: 404 })
        }

        // 2. Update their subscription tier
        const newTier = isApproved ? 'premium' : (isRefunded ? 'free' : null)

        if (newTier) {
            const { error: profileError } = await supabaseAdmin
                .from('user_profiles')
                .update({ subscription_tier: newTier })
                .eq('id', user.id)

            if (profileError) throw profileError
            console.log(`Successfully updated ${customerEmail} to tier: ${newTier}`)
        }

        return new Response(JSON.stringify({ success: true, user: customerEmail, tier: newTier }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}
