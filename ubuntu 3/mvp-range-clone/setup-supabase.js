require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_[REDACTED SECRET]_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  const { data: dailyQuestionExists, error: dailyQuestionError } = await supabase
    .from('daily_question_responses')
    .select('id')
    .limit(1);

  if (dailyQuestionError && dailyQuestionError.code === '42P01') {
    const { error } = await supabase
      .from('daily_question_responses')
      .insert([
        { question_id: 1, user_id: 1, question: 'Sample Question', response: 'Sample Response' }
      ]);
    if (error) console.error('Error creating daily_question_responses:', error);
    else console.log('Created daily_question_responses table');
  } else {
    console.log('daily_question_responses table already exists');
  }

  const { data: spinnerExists, error: spinnerError } = await supabase
    .from('spinner_selections')
    .select('id')
    .limit(1);

  if (spinnerError && spinnerError.code === '42P01') {
    const { error } = await supabase
      .from('spinner_selections')
      .insert([
        { project_id: 1, selected_user_id: 1, selected_user: 'Sample User' }
      ]);
    if (error) console.error('Error creating spinner_selections:', error);
    else console.log('Created spinner_selections table');
  } else {
    console.log('spinner_selections table already exists');
  }
}

setupTables().catch(console.error);
