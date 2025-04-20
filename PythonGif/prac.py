import openai

openai.api_key = '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' # Fill in your own key

def generate_blog(paragraph_topic):
  response = openai.completions.create(
    model = 'gpt-3.5-turbo-instruct',
    prompt = 'Write a paragraph about the following topic. ' + paragraph_topic,
    max_tokens = 400,
    temperature = 0.3
  )

  retrieve_blog = response.choices[0].text

  return retrieve_blog

print(generate_blog('Why NYC is better than your city.'))