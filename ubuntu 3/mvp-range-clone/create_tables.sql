CREATE TABLE IF NOT EXISTS daily_question_responses (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spinner_selections (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    selected_user_id INT NOT NULL,
    selected_user TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
