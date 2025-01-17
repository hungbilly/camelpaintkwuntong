import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileName, fileType, fileData } = await req.json()

    if (!fileData || !fileName || !fileType) {
      return new Response(
        JSON.stringify({ error: 'Missing required file data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Convert base64 to Uint8Array
    const base64Decoder = atob(fileData)
    const uint8Array = new Uint8Array(base64Decoder.length)
    for (let i = 0; i < base64Decoder.length; i++) {
      uint8Array[i] = base64Decoder.charCodeAt(i)
    }

    // Sanitize filename and generate unique path
    const sanitizedFileName = fileName.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    console.log('Uploading file:', filePath)

    // Upload file to storage
    const { data, error: uploadError } = await supabase.storage
      .from('store-images')
      .upload(filePath, uint8Array, {
        contentType: fileType,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('store-images')
      .getPublicUrl(filePath)

    console.log('File uploaded successfully:', publicUrl)

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})