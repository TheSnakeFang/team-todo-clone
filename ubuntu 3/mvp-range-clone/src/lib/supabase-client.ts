import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxdaegofprctilbbooqy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZGFlZ29mcHJjdGlsYmJvb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2MjI2NjksImV4cCI6MjAzNzE5ODY2OX0.zY77L-etLf_qr0iu8KDicOTBqzRDfEY_xpiXPAernlc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function createTables() {
  const { error: dailyQuestionError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'daily_question_responses',
    definition: `
      id SERIAL PRIMARY KEY,
      question_id INT NOT NULL,
      user_id INT NOT NULL,
      question TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `
  })

  if (dailyQuestionError) {
    console.error('Error creating daily_question_responses table:', dailyQuestionError)
  }

  const { error: spinnerError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'spinner_selections',
    definition: `
      id SERIAL PRIMARY KEY,
      project_id INT NOT NULL,
      selected_user_id INT NOT NULL,
      selected_user TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `
  })

  if (spinnerError) {
    console.error('Error creating spinner_selections table:', spinnerError)
  }
}
